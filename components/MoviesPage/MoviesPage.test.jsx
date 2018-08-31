import React from 'react'
import Helmet from 'react-helmet'
import { translate } from 'react-i18next'

import { mountGraphql, mockAutoSizer, selectFilterChange } from 'tests/helpers'
import MovieRelations from 'components/MoviePage/MovieRelations/MovieRelations'
import mutationResponse from 'components/Relation/mutationResponse'
import i18nClient from 'libs/i18nClient'

import MoviesPage, { MoviesQuery, GenresQuery, CountryQuery } from './MoviesPage'
import response from './fixtures/response.json'
import genres from './fixtures/genres.json'
import countries from './fixtures/countries.json'
import emptyResponse from './fixtures/empty_response.json'

describe('Movies Page Component', () => {
  let element
  let wrapper

  beforeAll(mockAutoSizer)

  describe('Unit', () => {
    beforeAll(() => i18nClient.changeLanguage('en'))
    beforeEach(async () => {
      const data = { ...response.data, fetchMore: jest.fn(), loadNextPage: jest.fn() }
      const MoviesPagePure = translate()(MoviesPage.WrappedComponent)
      element = (<MoviesPagePure
        data={data} genreData={genres.data} countryData={countries.data}/>)
      wrapper = await mountGraphql(element)
    })

    it('should render movies', () => {
      expect(wrapper.find('MovieShort').length).toBeGreaterThan(0)
    })

    it('should render select filters', () => {
      expect(wrapper.find('SelectGeneric')).toHaveLength(2)
      expect(wrapper.find('SelectGeneric[code="view"]').find('option')).toHaveLength(1)
      expect(wrapper.find('SelectGeneric[code="orderBy"]').find('option')).toHaveLength(3)
      expect(wrapper.find('SelectFilter')).toHaveLength(3)
      expect(wrapper.find('SelectFilter[code="relation"]').find('option')).toHaveLength(MovieRelations.codes.length + 1)
      expect(wrapper.find('SelectFilter[code="genres"]').find('option')).toHaveLength(genres.data.list.length + 1)
      expect(wrapper.find('SelectFilter[code="countries"]').find('option')).toHaveLength(countries.data.list.length + 1)
    })

    it('should render active filter, when filter selected', () => {
      expect(wrapper.find('ActiveFilters')).toHaveLength(3)
      expect(wrapper.find('ActiveFilters[code="genres"]').find('span')).toHaveLength(0)
      selectFilterChange(wrapper, 'SelectFilter[code="genres"]', 'R2VucmVOb2RlOjQ=')
      expect(wrapper.find('ActiveFilters[code="genres"]').find('span')).toHaveLength(1)
    })

    describe('i18n. en', () => {
      beforeAll(() => i18nClient.changeLanguage('en'))
      it('should render filter relation options', () => expect(wrapper.text()).toContain('Relation'))
      it('should render page title', () => expect(Helmet.peek().title).toBe('Movies'))
    })

    describe('i18n. ru', () => {
      beforeAll(() => i18nClient.changeLanguage('ru'))
      it('should render page title', () => expect(Helmet.peek().title).toBe('Фильмы'))
    })
  })

  describe('GraphQL', () => {
    const mockMovies = {
      request: { query: MoviesQuery, variables: { first: 100, after: '', orderBy: 'relations_count__like' } },
      result: response,
    }
    const mockCountries = { request: { query: CountryQuery }, result: countries }
    const mockGenres = { request: { query: GenresQuery }, result: genres }
    const mockWithParams = params => ({
      ...mockMovies,
      request: {
        ...mockMovies.request,
        variables: {
          ...mockMovies.request.variables,
          ...params
        },
      },
    })

    beforeAll(() => i18nClient.changeLanguage('en'))

    it('should render movies', async () => {
      wrapper = await mountGraphql(<MoviesPage/>, [mockMovies, mockCountries, mockGenres])
      expect(wrapper.find('MovieShort').length).toBeGreaterThan(0)
      expect(wrapper.find('SelectFilter[code="genres"]').find('option').length).toBeGreaterThan(1)
      expect(wrapper.find('SelectFilter[code="countries"]').find('option').length).toBeGreaterThan(1)
    })

    it('should send filter params in request', async () => {
      global.console.warn = jest.fn()
      wrapper = await mountGraphql(
        <MoviesPage/>,
        [
          mockMovies, mockCountries, mockGenres,
          mockWithParams({
            relation: null,
            genres: ['R2VucmVOb2RlOjQ='],
            countries: [],
          }),
          mockWithParams({
            relation: null,
            genres: ['R2VucmVOb2RlOjQ='],
            countries: ['Q291bnRyeU5vZGU6MTE='],
          }),
          mockWithParams({
            relation: 'fav',
            genres: ['R2VucmVOb2RlOjQ='],
            countries: ['Q291bnRyeU5vZGU6MTE='],
          }),
          mockWithParams({
            relation: 'fav',
            genres: ['R2VucmVOb2RlOjQ='],
            countries: ['Q291bnRyeU5vZGU6MTE='],
            orderBy: 'year',
          }),
        ])
      selectFilterChange(wrapper, 'SelectFilter[code="genres"]', 'R2VucmVOb2RlOjQ=')
      selectFilterChange(wrapper, 'SelectFilter[code="countries"]', 'Q291bnRyeU5vZGU6MTE=')
      selectFilterChange(wrapper, 'SelectFilter[code="relation"]', 'fav')
      selectFilterChange(wrapper, 'SelectGeneric[code="orderBy"]', 'year')
    })

    it('should change relation', async () => {
      wrapper = await mountGraphql(
        <MoviesPage/>,
        [
          mockMovies, mockCountries, mockGenres,
          {
            request: {
              query: MovieRelations.fragments.relate,
              variables: { id: response.data.list.edges[0].movie.id, code: 'fav' },
            },
            result: { data: mutationResponse(response.data.list.edges[0].movie, 'fav') },
          },
        ])
      expect(wrapper.find('Relation[code="fav"]').find('span[className="active"]')).toHaveLength(0)
      // expect(wrapper.find('Relation[code="fav"]').first().text()).toBe('2')
      wrapper.find('Relation[code="fav"]').find('span').first().simulate('click')
      expect(wrapper.find('Relation[code="fav"]').find('span[className="active"]')).toHaveLength(1)
      // expect(wrapper.find('Relation[code="fav"]').first().text()).toBe('3')
    })

    it('should render message if no results in response', async () => {
      wrapper = await mountGraphql(<MoviesPage/>, [{ ...mockMovies, result: emptyResponse }])
      expect(wrapper.find('MovieShort')).toHaveLength(0)
      expect(wrapper.text()).toContain('There is no such movies.')
    })
  })
})

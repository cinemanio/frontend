import React from 'react'
import _ from 'lodash'

import { mountGraphql, mockAutoSizer, selectFilterChange, i18nProps } from 'tests/helpers'
import MovieRelations from 'components/MoviePage/MovieRelations/MovieRelations'
import mutationResponse from 'components/Relation/mutationResponse'

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
    beforeEach(async () => {
      const data = _.clone(response.data)
      data.fetchMore = jest.fn()
      data.loadNextPage = jest.fn()
      element = (<MoviesPage.WrappedComponent
        data={data} genreData={genres.data} countryData={countries.data} {...i18nProps}/>)
      wrapper = await mountGraphql(element)
    })

    it('should render movies', () => {
      expect(wrapper.find('MovieShort').length).toBeGreaterThan(0)
    })

    it('should render select filters', () => {
      expect(wrapper.find('SelectFilter')).toHaveLength(2)
      expect(wrapper.find('SelectFilter').at(0).find('option')).toHaveLength(genres.data.list.length + 1)
      expect(wrapper.find('SelectFilter').at(1).find('option')).toHaveLength(countries.data.list.length + 1)
    })

    it('should render active filter, when filter selected', () => {
      expect(wrapper.find('ActiveFilters')).toHaveLength(2)
      expect(wrapper.find('ActiveFilters').at(0).find('span')).toHaveLength(0)
      selectFilterChange(wrapper, 0, 'R2VucmVOb2RlOjQ=')
      expect(wrapper.find('ActiveFilters').at(0).find('span')).toHaveLength(1)
    })
  })

  describe('GraphQL', () => {
    const mockMovies = { request: { query: MoviesQuery, variables: { first: 100, after: '' } }, result: response }
    const mockCountries = { request: { query: CountryQuery }, result: countries }
    const mockGenres = { request: { query: GenresQuery }, result: genres }

    it('should render movies', async () => {
      wrapper = await mountGraphql(<MoviesPage {...i18nProps}/>, [mockMovies, mockCountries, mockGenres])
      expect(wrapper.find('MovieShort').length).toBeGreaterThan(0)
      expect(wrapper.find('SelectFilter[code="genres"]').find('option').length).toBeGreaterThan(1)
      expect(wrapper.find('SelectFilter[code="countries"]').find('option').length).toBeGreaterThan(1)
    })

    it('should send filter params in request', async () => {
      wrapper = await mountGraphql(
        <MoviesPage {...i18nProps}/>,
        [
          mockMovies, mockCountries, mockGenres,
          {
            ...mockMovies,
            request: {
              ...mockMovies.request,
              variables: {
                ...mockMovies.request.variables,
                genres: ['R2VucmVOb2RlOjQ='],
                countries: [],
              },
            },
          },
          {
            ...mockMovies,
            request: {
              ...mockMovies.request,
              variables: {
                ...mockMovies.request.variables,
                genres: ['R2VucmVOb2RlOjQ='],
                countries: ['Q291bnRyeU5vZGU6MTE='],
              },
            },
          },
        ])
      selectFilterChange(wrapper, 0, 'R2VucmVOb2RlOjQ=')
      selectFilterChange(wrapper, 1, 'Q291bnRyeU5vZGU6MTE=')
    })

    it('should change relation', async () => {
      wrapper = await mountGraphql(
        <MoviesPage {...i18nProps}/>,
        [
          mockMovies, mockCountries, mockGenres,
          {
            request: {
              query: MovieRelations.fragments.relate,
              variables: { id: response.data.list.edges[0].movie.id, code: 'fav' }
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
      wrapper = await mountGraphql(<MoviesPage {...i18nProps}/>, [{ ...mockMovies, result: emptyResponse }])
      expect(wrapper.find('MovieShort')).toHaveLength(0)
      expect(wrapper.text()).toContain('There is no such movies.')
    })
  })
})

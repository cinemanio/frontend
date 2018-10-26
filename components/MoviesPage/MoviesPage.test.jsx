import React from 'react'
import Helmet from 'react-helmet'
import { translate } from 'react-i18next'

import { mountGraphql, mockAutoSizer, selectFilterChange, paginate, itShouldTestObjectsRelations } from 'tests/helpers'
import MovieRelations from 'components/MoviePage/MovieRelations/MovieRelations'
import i18nClient from 'libs/i18nClient'
import User from 'stores/User'

import MoviesPage from './MoviesPage'
import { mockMovies, mockGenres, mockCountries, mockWithParams } from './mocks'
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
      const data = { ...response.data, fetchMore: jest.fn(), loadNextPage: () => jest.fn() }
      const MoviesPagePure = translate()(MoviesPage.WrappedComponent)
      element = <MoviesPagePure data={data} genreData={genres.data} countryData={countries.data} />
      wrapper = await mountGraphql(element)
    })

    it('should render movies', () => {
      expect(wrapper.find('MovieShort').length).toBeGreaterThan(0)
    })

    it('should render select filters', () => {
      expect(wrapper.find('SelectGeneric')).toHaveLength(2)
      expect(wrapper.find('SelectGeneric[code="view"]').prop('list')).toHaveLength(2)
      expect(wrapper.find('SelectGeneric[code="orderBy"]').prop('list')).toHaveLength(4)
      expect(wrapper.find('SelectFilter')).toHaveLength(3)
      expect(wrapper.find('SelectFilter[code="relation"]').prop('list')).toHaveLength(MovieRelations.codes.length)
      expect(wrapper.find('SelectFilter[code="genres"]').prop('list')).toHaveLength(genres.data.list.length)
      expect(wrapper.find('SelectFilter[code="countries"]').prop('list')).toHaveLength(countries.data.list.length)
    })

    it('should render active filter, when filter selected', () => {
      expect(wrapper.find('ActiveFilters')).toHaveLength(4)
      expect(wrapper.find('ActiveFilters[code="genres"]').find('Tag')).toHaveLength(0)
      selectFilterChange(wrapper, 'SelectFilter[code="genres"]', 'R2VucmVOb2RlOjQ=')
      expect(wrapper.find('ActiveFilters[code="genres"]').find('Tag')).toHaveLength(1)
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
    const mocks = [mockMovies, mockCountries, mockGenres]
    const filters = { relation: null, genres: [], countries: [], yearMin: 1900, yearMax: 2028 }
    const getActiveFilter = (code, index) =>
      wrapper
        .find(`ActiveFilters[code="${code}"]`)
        .find('Tag')
        .at(index)
    const getActiveFilters = () =>
      wrapper
        .find(`ActiveFilters`)
        .find('Tag')
        .map(tag => tag.text())
        .join(' ')

    beforeAll(() => i18nClient.changeLanguage('en'))

    it('should render movies', async () => {
      wrapper = await mountGraphql(<MoviesPage />, mocks)
      expect(wrapper.find('MovieShort').length).toBeGreaterThan(0)
      expect(wrapper.find('SelectFilter[code="genres"]').prop('list').length).toBeGreaterThan(1)
      expect(wrapper.find('SelectFilter[code="countries"]').prop('list').length).toBeGreaterThan(1)
    })

    it('should render movies posters', async done => {
      wrapper = await mountGraphql(<MoviesPage />, mocks.concat([mockWithParams(filters)]))
      selectFilterChange(wrapper, 'SelectGeneric[code="view"]', 'image')
      expect(wrapper.find('MovieIcon').length).toBeGreaterThan(0)
      setTimeout(() => done())
    })

    it('should render message if no results in response', async () => {
      wrapper = await mountGraphql(<MoviesPage />, [{ ...mockMovies, result: emptyResponse }])
      expect(wrapper.find('MovieShort')).toHaveLength(0)
      expect(wrapper.text()).toContain('There is no such movies.')
    })

    itShouldTestObjectsRelations(MoviesPage, MovieRelations.fragments.relate, mocks, response.data.list.edges[0].movie)

    it('should send filter params in request', async done => {
      User.login('user')
      global.console.warn = jest.fn()
      wrapper = await mountGraphql(
        <MoviesPage />,
        mocks.concat([
          mockWithParams({
            ...filters,
            genres: ['R2VucmVOb2RlOjQ='],
          }),
          mockWithParams({
            ...filters,
            genres: ['R2VucmVOb2RlOjQ='],
            countries: ['Q291bnRyeU5vZGU6MTE='],
          }),
          mockWithParams({
            ...filters,
            relation: 'fav',
            genres: ['R2VucmVOb2RlOjQ='],
            countries: ['Q291bnRyeU5vZGU6MTE='],
          }),
          mockWithParams({
            ...filters,
            relation: 'fav',
            genres: ['R2VucmVOb2RlOjQ='],
            countries: ['Q291bnRyeU5vZGU6MTE='],
            orderBy: 'year',
          }),
        ])
      )
      // TODO: change amount of items on every filtration
      // expect(wrapper.find('ObjectList').prop('data').list.edges).toHaveLength(100)
      selectFilterChange(wrapper, 'SelectFilter[code="genres"]', 'R2VucmVOb2RlOjQ=')
      // expect(wrapper.find('ObjectList').prop('data').list.edges).toHaveLength(90)
      selectFilterChange(wrapper, 'SelectFilter[code="countries"]', 'Q291bnRyeU5vZGU6MTE=')
      selectFilterChange(wrapper, 'SelectFilter[code="relation"]', 'fav')
      selectFilterChange(wrapper, 'SelectGeneric[code="orderBy"]', 'year')
      // expect(wrapper.find('ObjectList').prop('data').list.edges).toHaveLength(90)
      expect(getActiveFilters()).toBe('Fav Western Benin')
      setTimeout(() => done())
    })

    it('should paginate during scrolling keeping selected filters', async done => {
      wrapper = await mountGraphql(
        <MoviesPage />,
        mocks.concat([
          mockWithParams({ orderBy: 'year', ...filters }),
          mockWithParams({ orderBy: 'year', ...filters, after: response.data.list.pageInfo.endCursor }),
        ])
      )
      selectFilterChange(wrapper, 'SelectGeneric[code="orderBy"]', 'year')
      expect(wrapper.find('ObjectList').prop('data').list.edges).toHaveLength(100)
      paginate(wrapper)
      // TODO: test amount of items after loading second page
      setTimeout(() => done())
    })

    it('should filter by years range', async () => {
      const getRange = () => {
        const props = wrapper
          .find('YearsFilter')
          .find('Slider')
          .find('Steps')
          .props()
        return [props.lowerBound, props.upperBound]
      }
      const setRange = value => {
        wrapper
          .find('YearsFilter')
          .instance()
          .onChange(value)
        wrapper
          .find('YearsFilter')
          .instance()
          .onAfterChange(value)
      }
      wrapper = await mountGraphql(
        <MoviesPage />,
        mocks.concat([
          mockWithParams({ ...filters, yearMin: 2000, yearMax: 2028 }),
          mockWithParams({ ...filters, yearMin: 2000, yearMax: 2010 }),
          mockWithParams({ ...filters, yearMin: 1900, yearMax: 2010 }),
          mockWithParams({ ...filters, yearMin: 1900, yearMax: 2028 }),
        ])
      )
      expect(getRange()).toEqual([1900, 2028])
      // select min
      setRange([2000, 2028])
      wrapper.update()
      expect(getRange()).toEqual([2000, 2028])
      expect(getActiveFilters()).toBe('2000…')
      // select max
      setRange([2000, 2010])
      wrapper.update()
      expect(getRange()).toEqual([2000, 2010])
      expect(getActiveFilters()).toBe('2000… …2010')
      // unselect min
      getActiveFilter('yearsRange', 0).simulate('click')
      expect(getRange()).toEqual([1900, 2010])
      expect(getActiveFilters()).toBe('…2010')
      // unselect max
      getActiveFilter('yearsRange', 0).simulate('click')
      expect(getRange()).toEqual([1900, 2028])
      expect(getActiveFilters()).toBe('')
    })
  })
})

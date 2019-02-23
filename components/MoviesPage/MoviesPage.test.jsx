import React from 'react'
import Helmet from 'react-helmet'
import { withTranslation } from 'react-i18next'

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
      const MoviesPagePure = withTranslation()(MoviesPage.WrappedComponent)
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
      it('should render filter title', () => expect(wrapper.text()).toContain('Filter by'))
      it('should render page title', () => expect(Helmet.peek().title).toBe('Movies'))
    })

    describe('i18n. ru', () => {
      beforeAll(() => i18nClient.changeLanguage('ru'))
      it('should render filter title', () => expect(wrapper.text()).toContain('Фильтровать по'))
      it('should render page title', () => expect(Helmet.peek().title).toBe('Фильмы'))
    })

    it('should change language on the fly', () => {
      i18nClient.changeLanguage('ru')
      wrapper.update()
      expect(wrapper.text()).toContain('The Game')
      expect(wrapper.text()).toContain('Игра')
      i18nClient.changeLanguage('en')
      wrapper.update()
      expect(wrapper.text()).toContain('The Game')
      expect(wrapper.text()).not.toContain('Игра')
    })
  })

  describe('GraphQL', () => {
    const mocks = [mockMovies, mockCountries, mockGenres]
    // TODO: move generation of defaults to MoviesPage
    const filters = { relation: null, genres: [], countries: [], yearMin: 1900, yearMax: new Date().getFullYear() + 10 }
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
          mockWithParams({ ...filters, genres: ['R2VucmVOb2RlOjQ='] }),
          mockWithParams({ ...filters, genres: ['R2VucmVOb2RlOjQ='], countries: ['Q291bnRyeU5vZGU6MTE='] }),
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
          mockWithParams({ ...filters, relation: 'fav', countries: ['Q291bnRyeU5vZGU6MTE='], orderBy: 'year' }),
          mockWithParams({ ...filters, relation: 'fav', orderBy: 'year' }),
          mockWithParams({ ...filters, orderBy: 'year' }),
        ])
      )
      // TODO: change amount of items on every filtration
      // expect(wrapper.find('ObjectList').prop('data').list.edges).toHaveLength(100)
      selectFilterChange(wrapper, 'SelectFilter[code="genres"]', 'R2VucmVOb2RlOjQ=')
      expect(getActiveFilters()).toBe('Western')
      // expect(wrapper.find('ObjectList').prop('data').list.edges).toHaveLength(90)
      selectFilterChange(wrapper, 'SelectFilter[code="countries"]', 'Q291bnRyeU5vZGU6MTE=')
      expect(getActiveFilters()).toBe('Western Benin')
      selectFilterChange(wrapper, 'SelectFilter[code="relation"]', 'fav')
      expect(getActiveFilters()).toBe('Fav Western Benin')
      selectFilterChange(wrapper, 'SelectGeneric[code="orderBy"]', 'year')
      // expect(wrapper.find('ObjectList').prop('data').list.edges).toHaveLength(90)
      getActiveFilter('genres', 0).simulate('click')
      expect(getActiveFilters()).toBe('Fav Benin')
      getActiveFilter('countries', 0).simulate('click')
      expect(getActiveFilters()).toBe('Fav')
      getActiveFilter('relation', 0).simulate('click')
      expect(getActiveFilters()).toBe('')
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
      setTimeout(done)
    })

    describe('Years range filter', () => {
      const defaults = { min: filters.yearMin, max: filters.yearMax }
      const getRange = () => {
        wrapper.update()
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
          .changeRange(value)
        wrapper
          .find('YearsFilter')
          .instance()
          .onAfterChange(value)
      }
      const getMinInput = () =>
        wrapper
          .find('YearsFilter')
          .find('input')
          .first()
      const getMaxInput = () =>
        wrapper
          .find('YearsFilter')
          .find('input')
          .last()
      const setMin = value => {
        const input = getMinInput()
        input.simulate('change', { target: { value } })
        input.simulate('blur')
      }
      const setMax = value => {
        const input = getMaxInput()
        input.simulate('change', { target: { value } })
        input.simulate('blur')
      }

      beforeAll(() => {
        global.console.warn = jest.fn()
      })

      it('should allow to unselect years filters', async done => {
        wrapper = await mountGraphql(
          <MoviesPage />,
          mocks.concat([
            mockWithParams({ ...filters, yearMin: 2000, yearMax: 2010 }),
            mockWithParams({ ...filters, yearMin: defaults.min, yearMax: 2010 }),
            mockWithParams({ ...filters, yearMin: defaults.min, yearMax: defaults.max }),
          ])
        )
        setRange([2000, 2010])
        expect(getRange()).toEqual([2000, 2010])
        // unselect min
        getActiveFilter('yearsRange', 0).simulate('click')
        expect(getRange()).toEqual([defaults.min, 2010])
        expect(getActiveFilters()).toBe('…2010')
        // unselect max
        getActiveFilter('yearsRange', 0).simulate('click')
        expect(getRange()).toEqual([defaults.min, defaults.max])
        expect(getActiveFilters()).toBe('')
        setTimeout(done)
      })

      it('should filter by years range', async () => {
        wrapper = await mountGraphql(
          <MoviesPage />,
          mocks.concat([
            mockWithParams({ ...filters, yearMin: 2000, yearMax: defaults.max }),
            mockWithParams({ ...filters, yearMin: 2000, yearMax: 2010 }),
          ])
        )
        expect(getRange()).toEqual([defaults.min, defaults.max])
        // set min
        setRange([2000, defaults.max])
        expect(getRange()).toEqual([2000, defaults.max])
        expect(getActiveFilters()).toBe('2000…')
        // set max
        setRange([2000, 2010])
        expect(getRange()).toEqual([2000, 2010])
        expect(getActiveFilters()).toBe('2000… …2010')
      })

      it('should filter by years input', async () => {
        wrapper = await mountGraphql(
          <MoviesPage />,
          mocks.concat([
            mockWithParams({ ...filters, yearMin: 2000, yearMax: defaults.max }),
            mockWithParams({ ...filters, yearMin: 2000, yearMax: 2010 }),
          ])
        )
        expect(getRange()).toEqual([defaults.min, defaults.max])
        setMin('2000')
        expect(getRange()).toEqual([2000, defaults.max])
        expect(getActiveFilters()).toBe('2000…')
        setMax('2010')
        expect(getRange()).toEqual([2000, 2010])
        expect(getActiveFilters()).toBe('2000… …2010')
      })

      it('should not let min value set higher, than max', async () => {
        wrapper = await mountGraphql(
          <MoviesPage />,
          mocks.concat([
            mockWithParams({ ...filters, yearMin: defaults.min, yearMax: 1950 }),
            mockWithParams({ ...filters, yearMin: 1950, yearMax: 1950 }),
          ])
        )
        expect(getMinInput().prop('value')).toBe(String(defaults.min))
        setMax('1950')
        setMin('2000')
        expect(getRange()).toEqual([1950, 1950])
        expect(getMinInput().prop('value')).toBe('1950')
      })

      describe('wrong values', () => {
        beforeEach(async () => {
          wrapper = await mountGraphql(
            <MoviesPage />,
            mocks.concat([mockWithParams({ ...filters, yearMin: defaults.min, yearMax: defaults.max })])
          )
        })

        it('should not let enter out of range values', async () => {
          setMin('1')
          setMax('3000')
          expect(getRange()).toEqual([defaults.min, defaults.max])
          expect(getActiveFilters()).toBe('')
          expect(getMinInput().prop('value')).toBe(String(defaults.min))
          expect(getMaxInput().prop('value')).toBe(String(defaults.max))
        })

        it('should not let enter non integer value', async () => {
          setMin('qwer')
          setMax('qwer')
          expect(getMinInput().prop('value')).toBe(String(defaults.min))
          expect(getMaxInput().prop('value')).toBe(String(defaults.max))
        })
      })
    })
  })
})

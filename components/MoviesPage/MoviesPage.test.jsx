import React from 'react'

import i18n from 'libs/i18nClient'
import { mountGraphql, populated, mockAutoSizer, selectFilterChange } from 'tests/helpers'

import MoviesPage from './MoviesPage'
import response from './fixtures/response.json'
import genres from './fixtures/genres.json'
import countries from './fixtures/countries.json'
import emptyResponse from './fixtures/empty_response.json'

describe('Movies Page Component', () => {
  let element
  let wrapper
  let requestsLog

  beforeAll(() => {
    global.console.warn = jest.fn()
    mockAutoSizer()
    element = <MoviesPage t={i => i18n.t(i)} i18n={i18n}/>
  })

  describe('Populated with response', () => {
    beforeEach(() => {
      requestsLog = []
      wrapper = mountGraphql(
        [response, countries, genres, response, response, response, response, response],
        element, requestsLog)
    })

    it('should render movies', done => populated(done, wrapper, () => {
      expect(wrapper.find('MovieShort').length).toBeGreaterThan(0)
    }))

    it('should render select filters', done => populated(done, wrapper, () => {
      expect(wrapper.find('SelectFilter')).toHaveLength(2)
      expect(wrapper.find('SelectFilter').at(0).find('option')).toHaveLength(genres.data.list.length + 1)
      expect(wrapper.find('SelectFilter').at(1).find('option')).toHaveLength(countries.data.list.length + 1)
    }))

    it('should render active filter, when filter selected', done => populated(done, wrapper, () => {
      expect(wrapper.find('ActiveFilters')).toHaveLength(2)
      expect(wrapper.find('ActiveFilters').at(0).find('span')).toHaveLength(0)
      selectFilterChange(wrapper, 0, 'R2VucmVOb2RlOjQ=')
      expect(wrapper.find('ActiveFilters').at(0).find('span')).toHaveLength(1)
    }))

    it('should send filter params in request', done => populated(done, wrapper, async () => {
      expect(requestsLog).toHaveLength(3)
      expect(requestsLog[0].variables).toEqual({ first: 100, after: '' })
      expect(requestsLog[1].operationName).toBe('Countries')
      expect(requestsLog[2].operationName).toBe('Genres')
      selectFilterChange(wrapper, 0, 'R2VucmVOb2RlOjQ=')
      await wrapper.find('ObjectListPage').instance().refreshList()
      expect(requestsLog).toHaveLength(4)
      expect(requestsLog[3].variables).toEqual({
        first: 100, after: '', genres: ['R2VucmVOb2RlOjQ='], countries: []
      })
      selectFilterChange(wrapper, 1, 'Q291bnRyeU5vZGU6MTE=')
      await wrapper.find('ObjectListPage').instance().refreshList()
      expect(requestsLog).toHaveLength(5)
      expect(requestsLog[4].variables).toEqual({
        first: 100, after: '', genres: ['R2VucmVOb2RlOjQ='], countries: ['Q291bnRyeU5vZGU6MTE=']
      })
    }))
  })

  describe('Populated with empty response', () => {
    beforeEach(() => {
      wrapper = mountGraphql([emptyResponse, countries, genres], element)
    })

    it('should render message if no results in response', done => populated(done, wrapper, () => {
      expect(wrapper.find('MovieLink')).toHaveLength(0)
      expect(wrapper.text()).toContain('There is no such movies.')
    }))
  })
})

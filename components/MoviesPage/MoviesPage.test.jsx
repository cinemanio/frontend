import React from 'react'

import MoviesPage from './MoviesPage'
import response from './fixtures/response.json'
import genres from './fixtures/genres.json'
import countries from './fixtures/countries.json'
import emptyResponse from './fixtures/empty_response.json'
import { mountGraphql, populated, mockAutoSizer, selectFilterChange } from '../../tests/helpers'

describe('Movies Page Component', () => {
  let element
  let wrapper
  let requestsLog

  beforeAll(() => {
    global.console.warn = jest.fn()
    mockAutoSizer()
  })

  beforeEach(() => {
    element = <MoviesPage/>
  })

  describe('Populated with response', () => {
    beforeEach(() => {
      requestsLog = []
      wrapper = mountGraphql(
        [response, countries, genres, response, response, response, response, response],
        element, requestsLog)
    })

    it('should render movies', done => populated(done, wrapper, () => {
      // expect(wrapper.find('MovieLink').length).toBeGreaterThan(response.data.list.edges.length)
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
      selectFilterChange(wrapper, 0, '3')
      expect(wrapper.find('ActiveFilters').at(0).find('span')).toHaveLength(1)
    }))

    it('should send filter params in request', done => populated(done, wrapper, async () => {
      expect(requestsLog).toHaveLength(3)
      expect(requestsLog[0].variables).toEqual({ first: 100, after: '' })
      expect(requestsLog[1].operationName).toBe('Countries')
      expect(requestsLog[2].operationName).toBe('Genres')
      selectFilterChange(wrapper, 0, '3')
      await wrapper.find('ObjectListPage').instance().refreshList()
      expect(requestsLog).toHaveLength(4)
      expect(requestsLog[3].variables).toEqual({ first: 100, after: '', genres: ['3'], countries: [] })
      selectFilterChange(wrapper, 1, '4')
      await wrapper.find('ObjectListPage').instance().refreshList()
      expect(requestsLog).toHaveLength(5)
      expect(requestsLog[4].variables).toEqual({ first: 100, after: '', genres: ['3'], countries: ['4'] })
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

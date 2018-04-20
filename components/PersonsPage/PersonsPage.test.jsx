import React from 'react'

import PersonsPage from './PersonsPage'
import response from './fixtures/response.json'
import roles from './fixtures/roles.json'
import countries from './fixtures/countries.json'
import emptyResponse from './fixtures/empty_response.json'
import { mountGraphql, populated, mockAutoSizer, selectFilterChange } from '../../tests/helpers'

describe('Persons Page Component', () => {
  let element
  let wrapper
  let requestsLog

  beforeAll(() => {
    global.console.warn = jest.fn()
    mockAutoSizer()
  })

  beforeEach(() => {
    element = <PersonsPage/>
  })

  describe('Populated with response', () => {
    beforeEach(() => {
      requestsLog = []
      wrapper = mountGraphql(
        [response, countries, roles, response, response],
        element, requestsLog)
    })

    it('should render persons', done => populated(done, wrapper, () => {
      expect(wrapper.find('PersonLink').length).toBeGreaterThan(0)
    }))

    it('should render select filters', done => populated(done, wrapper, () => {
      expect(wrapper.find('SelectFilter')).toHaveLength(2)
      expect(wrapper.find('SelectFilter').at(0).find('option')).toHaveLength(roles.data.list.length + 1)
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
      expect(requestsLog[2].operationName).toBe('Roles')
      selectFilterChange(wrapper, 0, '3')
      await wrapper.find('ObjectListPage').instance().refreshList()
      expect(requestsLog).toHaveLength(4)
      expect(requestsLog[3].variables).toEqual({ first: 100, after: '', roles: ['3'], country: '' })
      selectFilterChange(wrapper, 1, '4')
      await wrapper.find('ObjectListPage').instance().refreshList()
      expect(requestsLog).toHaveLength(5)
      expect(requestsLog[4].variables).toEqual({ first: 100, after: '', roles: ['3'], country: '4' })
    }))
  })

  describe('Populated with empty response', () => {
    beforeEach(() => {
      wrapper = mountGraphql([emptyResponse, countries, roles], element)
    })

    it('should render message if no results in response', done => populated(done, wrapper, () => {
      expect(wrapper.find('PersonLink')).toHaveLength(0)
      expect(wrapper.text()).toContain('There is no such persons.')
    }))
  })
})

import React from 'react'
import _ from 'lodash'

import { mountRouter, mountGraphql, populated, mockAutoSizer, selectFilterChange, i18nProps } from 'tests/helpers'

import PersonsPage from './PersonsPage'
import response from './fixtures/response.json'
import roles from './fixtures/roles.json'
import countries from './fixtures/countries.json'
import emptyResponse from './fixtures/empty_response.json'

describe('Persons Page Component', () => {
  let element
  let wrapper

  describe('Unit', () => {
    beforeEach(() => {
      const data = _.clone(response.data)
      data.fetchMore = jest.fn()
      data.loadNextPage = jest.fn()
      element = (<PersonsPage.WrappedComponent
        data={data} roleData={roles.data} countryData={countries.data} {...i18nProps}/>)
      wrapper = mountRouter(element)
    })

    it('should render select filters', () => {
      expect(wrapper.find('SelectFilter')).toHaveLength(2)
      expect(wrapper.find('SelectFilter').at(0).find('option')).toHaveLength(roles.data.list.length + 1)
      expect(wrapper.find('SelectFilter').at(1).find('option')).toHaveLength(countries.data.list.length + 1)
    })

    it('should render active filter, when filter selected', () => {
      expect(wrapper.find('ActiveFilters')).toHaveLength(2)
      expect(wrapper.find('ActiveFilters').at(0).find('span')).toHaveLength(0)
      selectFilterChange(wrapper, 0, 'Um9sZU5vZGU6MTE=')
      expect(wrapper.find('ActiveFilters').at(0).find('span')).toHaveLength(1)
    })
  })

  describe('GraphQL', () => {
    let requestsLog

    beforeAll(() => {
      global.console.warn = jest.fn()
      mockAutoSizer()
      element = <PersonsPage {...i18nProps}/>
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

      it('should send filter params in request', done => populated(done, wrapper, async () => {
        expect(requestsLog).toHaveLength(3)
        expect(requestsLog[0].variables).toEqual({ first: 100, after: '' })
        expect(requestsLog[1].operationName).toBe('Countries')
        expect(requestsLog[2].operationName).toBe('Roles')
        selectFilterChange(wrapper, 0, 'Um9sZU5vZGU6MTE=')
        await wrapper.find('ObjectListPage').instance().refreshList()
        expect(requestsLog).toHaveLength(4)
        expect(requestsLog[3].variables).toEqual({
          first: 100, after: '', roles: ['Um9sZU5vZGU6MTE='], country: ''
        })
        selectFilterChange(wrapper, 1, 'Q291bnRyeU5vZGU6MTE=')
        await wrapper.find('ObjectListPage').instance().refreshList()
        expect(requestsLog).toHaveLength(5)
        expect(requestsLog[4].variables).toEqual({
          first: 100, after: '', roles: ['Um9sZU5vZGU6MTE='], country: 'Q291bnRyeU5vZGU6MTE='
        })
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
})

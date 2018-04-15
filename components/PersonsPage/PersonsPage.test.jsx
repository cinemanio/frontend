import React from 'react'

import PersonsPage from './PersonsPage'
import response from './fixtures/response.json'
import roles from './fixtures/roles.json'
import countries from './fixtures/countries.json'
import emptyResponse from './fixtures/empty_response.json'
import { mountGraphql, populated, mockAutoSizer } from '../../tests/helpers'

describe('Persons Page Component', () => {
  let element
  let wrapper

  beforeAll(() => {
    global.console.warn = jest.fn()
    mockAutoSizer()
  })

  beforeEach(() => {
    element = <PersonsPage/>
  })

  describe('Populated with response', () => {
    beforeEach(() => {
      wrapper = mountGraphql([response, countries, roles, response, response], element)
    })

    it('should render persons', done => populated(done, wrapper, () => {
      expect(wrapper.find('PersonLink').length).toBeGreaterThan(0)
    }))

    it('should render select filters', done => populated(done, wrapper, () => {
      expect(wrapper.find('SelectFilter')).toHaveLength(2)
      expect(wrapper.find('SelectFilter').at(0).find('option')).toHaveLength(roles.data.list.length + 1)
      expect(wrapper.find('SelectFilter').at(1).find('option')).toHaveLength(countries.data.list.length + 1)
    }))
  })

  describe('Populated with empty response', () => {
    beforeEach(() => {
      wrapper = mountGraphql(emptyResponse, element)
    })

    it('should render message if no results in response', done => populated(done, wrapper, () => {
      expect(wrapper.find('PersonLink')).toHaveLength(0)
      expect(wrapper.text()).toContain('There is no such persons.')
    }))
  })
})

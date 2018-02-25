import React from 'react'

import PersonsPage from './PersonsPage'
import { mountGraphql, populated } from '../../tests/helpers'
import response from './fixtures/response.json'
import emptyResponse from './fixtures/empty_response.json'

describe('Persons Page Component', () => {
  let element
  let wrapper

  beforeEach(() => {
    element = <PersonsPage/>
  })

  describe('Populated with response', () => {
    beforeEach(() => {
      wrapper = mountGraphql(response, element)
    })

    it('should render persons from the intitial response', done => populated(done, wrapper, () => {
      wrapper.update()
      expect(wrapper.find('PersonLink').length).toBeGreaterThan(response.data.list.edges.length)
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

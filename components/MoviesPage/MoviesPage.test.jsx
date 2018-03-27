import React from 'react'

import MoviesPage from './MoviesPage'
import response from './fixtures/response.json'
import emptyResponse from './fixtures/empty_response.json'
import { mountGraphql, populated } from '../../tests/helpers'

describe('Movies Page Component', () => {
  let element
  let wrapper

  beforeAll(() => {
    global.console.warn = jest.fn()
  })

  beforeEach(() => {
    element = <MoviesPage/>
  })

  describe('Populated with response', () => {
    beforeEach(() => {
      wrapper = mountGraphql(response, element)
    })

    it('should render movies from the intitial response', done => populated(done, wrapper, () => {
      wrapper.update()
      expect(wrapper.find('MovieLink').length).toBeGreaterThan(response.data.list.edges.length)
    }))
  })

  describe('Populated with empty response', () => {
    beforeEach(() => {
      wrapper = mountGraphql(emptyResponse, element)
    })

    it('should render message if no results in response', done => populated(done, wrapper, () => {
      expect(wrapper.find('MovieLink')).toHaveLength(0)
      expect(wrapper.text()).toContain('There is no such movies.')
    }))
  })
})

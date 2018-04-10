import React from 'react'

import MoviesPage from './MoviesPage'
import response from './fixtures/response.json'
import genres from './fixtures/genres.json'
import countries from './fixtures/countries.json'
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
      wrapper = mountGraphql([response, countries, genres, response, response], element)
    })

    it('should render movies', done => populated(done, wrapper, () => {
      // expect(wrapper.find('MovieLink').length).toBeGreaterThan(response.data.list.edges.length)
      expect(wrapper.find('MovieLink').length).toBeGreaterThan(0)
    }))

    it('should render select filters', done => populated(done, wrapper, () => {
      expect(wrapper.find('SelectFilter')).toHaveLength(2)
      expect(wrapper.find('SelectFilter').at(0).find('option')).toHaveLength(genres.data.genres.length + 1)
      expect(wrapper.find('SelectFilter').at(1).find('option')).toHaveLength(countries.data.countries.length + 1)
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

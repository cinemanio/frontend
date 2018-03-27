import React from 'react'

import { PersonPage } from './PersonPage'
import response from './fixtures/response.json'
import { mountRouter } from '../../tests/helpers'
// import emptyResponse from './fixtures/empty_response.json'

describe('Person Page Component', () => {
  let element
  let wrapper

  describe('Populated with response', () => {
    beforeEach(() => {
      element = <PersonPage params={{ personId: '' }} data={response.data}/>
      wrapper = mountRouter(element)
    })

    it('should render person name', () => {
      expect(wrapper.find('h1').text()).toBe('David Fincher')
    })
  })

  // it('should render 404 page if response is empty', () => {
  //   element = <PersonPage params={{ personId: '' }} data={emptyResponse.data}/>
  //   wrapper = mount(element)
  //   expect(wrapper.find('Error404')).toHaveLength(1)
  // })
})

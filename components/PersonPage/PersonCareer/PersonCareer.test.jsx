import React from 'react'

import PersonCareer from './PersonCareer'
import { data } from '../fixtures/response.json'
import { mountRouter } from '../../../tests/helpers'

describe('Person Career Component', () => {
  let element
  let wrapper
  const getRole = (block, position) =>
    wrapper.find('Block').at(block).find('MovieLink').at(position)
      .parents()
      .at(1)
      .children()
      .at(1)
      .text()

  beforeEach(() => {
    element = <PersonCareer person={data.person}/>
    wrapper = mountRouter(element)
  })

  it('should render blocks with roles', () => {
    expect(wrapper.find('Block')).toHaveLength(1)
    expect(wrapper.find('Block').at(0).find('MovieLink')).toHaveLength(15)
  })

  it('should group roles for the same movie', () => {
    expect(getRole(0, 0)).toBe('Bobby, Scenarist, Director')
  })
})

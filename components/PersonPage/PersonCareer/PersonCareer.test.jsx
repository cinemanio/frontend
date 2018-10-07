import React from 'react'

import { mountRouter } from 'tests/helpers'
import i18nClient from 'libs/i18nClient'

import PersonCareer from './PersonCareer'
import { data } from '../fixtures/response.json'

describe('Person Career Component', () => {
  let element
  let wrapper
  const getRole = (block, position) =>
    wrapper
      .find('Block')
      .at(block)
      .find('MovieLink')
      .at(position * 2 + 1)
      .parents()
      .at(1)
      .children()
      .at(1)
      .text()

  beforeEach(() => {
    i18nClient.changeLanguage('en')
    element = <PersonCareer person={data.person} />
    wrapper = mountRouter(element)
  })

  it('should render blocks with roles', () => {
    expect(wrapper.find('Block')).toHaveLength(1)
    expect(
      wrapper
        .find('Block')
        .at(0)
        .find('MovieImage')
    ).toHaveLength(14)
  })

  it('should group roles for the same movie', () => {
    expect(getRole(0, 0)).toBe('Bobby, Scenarist, Director')
    expect(getRole(0, 10)).toBe('Director, Producer')
  })
})

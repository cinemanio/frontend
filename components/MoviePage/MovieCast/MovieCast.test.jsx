import React from 'react'

import { mountRouter } from 'tests/helpers'
import i18nClient from 'libs/i18nClient'

import MovieCast from './MovieCast'
import { data } from '../fixtures/response.json'
import responseOnlyDirector from '../fixtures/response_only_director.json'

describe('Movie Cast Component', () => {
  let element
  let wrapper
  const getRole = (block, position) =>
    wrapper
      .find('Block')
      .at(block)
      .find('PersonLink')
      .at(position * 2 + 1)
      .parents()
      .at(0)
      .children()
      .at(1)
      .text()
  const getImages = block =>
    wrapper
      .find('Block')
      .at(block)
      .find('PersonImage')

  beforeEach(() => {
    i18nClient.changeLanguage('en')
    element = <MovieCast movie={data.movie} />
    wrapper = mountRouter(element)
  })

  it('should render 3 blocks with roles in each', () => {
    expect(wrapper.find('Block')).toHaveLength(3)
    expect(getImages(0)).toHaveLength(5)
    expect(getImages(1)).toHaveLength(6)
    expect(getImages(2)).toHaveLength(1)
  })

  it('should render creators sorted', () => {
    expect(getRole(0, 0)).toBe('Director')
    expect(getRole(0, 1)).toBe('Scenarist')
    expect(getRole(0, 2)).toBe('Writer')
    expect(getRole(0, 3)).toBe('Composer')
    expect(getRole(0, 4)).toBe('Producer')
  })

  it('should render 1 block if only creators in roles', () => {
    element = <MovieCast movie={responseOnlyDirector.data.movie} />
    wrapper = mountRouter(element)
    expect(wrapper.find('Block')).toHaveLength(1)
  })
})

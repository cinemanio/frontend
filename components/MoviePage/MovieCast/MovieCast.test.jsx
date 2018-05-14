import React from 'react'

import { mountRouter } from 'tests/helpers'

import MovieCast from './MovieCast'
import { data } from '../fixtures/response.json'
import responseOnlyDirector from '../fixtures/response_only_director.json'

describe('Movie Cast Component', () => {
  let element
  let wrapper
  const getRole = (block, position) =>
    wrapper.find('Block').at(block).find('PersonLink').at(position)
      .parents()
      .at(0)
      .children()
      .at(1)
      .text()

  beforeEach(() => {
    element = <MovieCast movie={data.movie}/>
    wrapper = mountRouter(element)
  })

  it('should render 3 blocks with roles in each', () => {
    expect(wrapper.find('Block')).toHaveLength(3)
    expect(wrapper.find('Block').at(0).find('PersonLink')).toHaveLength(5)
    expect(wrapper.find('Block').at(1).find('PersonLink')).toHaveLength(6)
    expect(wrapper.find('Block').at(2).find('PersonLink')).toHaveLength(1)
  })

  it('should render creators sorted', () => {
    expect(getRole(0, 0)).toBe('Director')
    expect(getRole(0, 1)).toBe('Scenarist')
    expect(getRole(0, 2)).toBe('Writer')
    expect(getRole(0, 3)).toBe('Composer')
    expect(getRole(0, 4)).toBe('Producer')
  })

  it('should render 1 block if only creators in roles', () => {
    element = <MovieCast movie={responseOnlyDirector.data.movie}/>
    wrapper = mountRouter(element)
    expect(wrapper.find('Block')).toHaveLength(1)
  })
})

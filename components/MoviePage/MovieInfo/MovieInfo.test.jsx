import React from 'react'
import { mount } from 'enzyme'

import { mountOptions } from 'tests/helpers'
import itShouldRenderBlocks from 'tests/objectInfo'

import MovieInfo from './MovieInfo'
import response from '../fixtures/response.json'

describe('Movie Info Component', () => {
  let element
  let wrapper
  const content = {
    year: '1995',
    genres: 'Drama',
    countries: 'USA',
    languages: 'English',
    runtime: '1 hour, 31 minutes',
  }

  describe('flags', () => {
    element = <MovieInfo movie={response.data.movie} />

    describe('blocks', () => {
      ;[
        { all: true },
        { year: true },
        { genres: true },
        { countries: true },
        { languages: true },
        { runtime: true },
        { year: true, genres: true },
      ].forEach(itShouldRenderBlocks(content, element))
    })
  })

  describe('one block only', () => {
    Object.entries(content).map(([type, text]) =>
      it(`should render only ${type} block`, () => {
        const movie = { genres: [], countries: [], languages: [] }
        movie[type] = response.data.movie[type]
        element = <MovieInfo movie={movie} all />
        wrapper = mount(element, mountOptions)
        expect(wrapper.find('div').children()).toHaveLength(1)
        expect(wrapper.text()).toContain(text)
      })
    )
  })
})

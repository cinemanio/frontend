import React from 'react'

import { itShouldRenderBlocks } from 'tests/helpers'

import MovieInfo from './MovieInfo'
import response from '../fixtures/response.json'

describe('Movie Info Component', () => {
  let element
  // let wrapper

  describe('flags', () => {
    element = <MovieInfo movie={response.data.movie}/>
    const content = {
      year: '1995',
      genres: 'Drama',
      countries: 'USA',
      languages: 'English',
      runtime: '1 hour, 31 minutes',
    }

    describe('blocks', () => {
      [
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
})

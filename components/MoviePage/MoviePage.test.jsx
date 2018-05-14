import React from 'react'

import i18n from 'libs/i18nClient'
import { mountRouter } from 'tests/helpers'

import { MoviePage } from './MoviePage'
import { data } from './fixtures/response.json'

describe('Movie Page Component', () => {
  let element
  let wrapper

  beforeEach(() => {
    element = <MoviePage params={{ movieId: '' }} data={data} t={() => ''} i18n={i18n}/>
    wrapper = mountRouter(element)
  })

  it('should render movie title', () => {
    expect(wrapper.find('h1').text()).toBe('Kids')
  })
})

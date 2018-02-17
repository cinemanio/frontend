import React from 'react'
import { mount } from 'enzyme'

import { MoviePage } from './MoviePage'
import movie from './fixtures/movie.json'

describe('Movie Page Component', () => {
  let element
  let wrapper

  beforeEach(() => {
    element = <MoviePage params={{ movieId: '' }} data={movie.data}/>
    wrapper = mount(element)
  })

  it('should render movie title', () => {
    expect(wrapper.find('h1').text()).toBe('Kids')
  })
})

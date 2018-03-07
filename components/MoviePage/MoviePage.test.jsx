import React from 'react'
import { mount } from 'enzyme'

import { MoviePage } from './MoviePage'
import { data } from './fixtures/response.json'

describe('Movie Page Component', () => {
  let element
  let wrapper

  beforeEach(() => {
    element = <MoviePage params={{ movieId: '' }} data={data}/>
    wrapper = mount(element)
  })

  it('should render movie title', () => {
    expect(wrapper.find('h1').text()).toBe('Kids')
  })
})

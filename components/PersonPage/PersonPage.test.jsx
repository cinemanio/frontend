import React from 'react'
import { mount } from 'enzyme'

import { PersonPage } from './PersonPage'
import { data } from './fixtures/person.json'

describe('Person Page Component', () => {
  let element
  let wrapper

  beforeEach(() => {
    element = <PersonPage params={{ personId: '' }} data={data}/>
    wrapper = mount(element)
  })

  it('should render person name', () => {
    expect(wrapper.find('h1').text()).toBe('Harmony Korine')
  })
})

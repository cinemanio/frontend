import React from 'react'
import { mount } from 'enzyme'

import { mountRouter } from 'tests/helpers'
import i18nClient from 'libs/i18nClient'

import response from './fixtures/response.json'
import { SearchFieldRaw } from './SearchField'
import { connectInstantSearch } from '../Search'

describe('Search Field Component', () => {
  let element
  let wrapper
  let dropdownWrapper
  const getSuggestions = sectionIndex =>
    dropdownWrapper
      .find('MenuItemGroup')
      .at(sectionIndex)
      .find('MenuItem')

  beforeAll(() => i18nClient.changeLanguage('en'))

  beforeEach(() => {
    element = connectInstantSearch(
      <SearchFieldRaw hits={response.results} refine={jest.fn()} currentRefinement="query" />
    )
    wrapper = mountRouter(element)
    wrapper.find('input').simulate('change', 'query')
    dropdownWrapper = mount(
      connectInstantSearch(
        wrapper
          .find('Trigger')
          .instance()
          .getComponent()
      )
    )
  })

  it('should render search query in input', () => expect(wrapper.find('input').props().value).toBe('query'))

  it('should render 2 groups of suggestions: movies and persons', () => {
    expect(dropdownWrapper.find('MenuItemGroup')).toHaveLength(2)
    expect(getSuggestions(0)).toHaveLength(5)
    expect(getSuggestions(1)).toHaveLength(4)
  })

  it('should navigate to objects page when click on suggestion and clean search input', () => {
    const { props } = wrapper.find('SearchFieldRaw').instance()
    props.history.push = jest.fn()
    getSuggestions(0)
      .first()
      .simulate('click')
    expect(props.history.push).toHaveBeenCalledWith('/movies/TW92aWVOb2RlOjcwMQ==')
    expect(props.refine).toHaveBeenCalledWith('')
  })
})

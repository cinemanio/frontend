import React from 'react'
import { mount } from 'enzyme'

import ActiveFilters from './ActiveFilters'

describe('Active Filters Component', () => {
  let element
  let wrapper
  const getFilter = index => wrapper.find('Tag').at(index)

  beforeEach(() => {
    element = (
      <ActiveFilters
        code="filter"
        list={[{ id: '1', name: 'Active 1' }, { id: '2', name: 'Active 2' }, { id: '3', name: '' }]}
        filters={{ filter: new Set(['1', '2']) }}
        setFilterState={jest.fn()}
        multiple
      />
    )
    wrapper = mount(element)
  })

  it('should render all active filters', () => {
    expect(wrapper.find('Tag')).toHaveLength(2)
    expect(getFilter(0).text()).toBe('Active 1')
    expect(getFilter(1).text()).toBe('Active 2')
  })

  it('should call setFilterState on change', () => {
    expect(element.props.setFilterState).not.toHaveBeenCalled()
    getFilter(0).simulate('click')
    expect(element.props.setFilterState).toHaveBeenCalledWith({ filter: new Set(['2']) })
  })

  describe('Multiple is off', () => {
    beforeEach(() => {
      wrapper = mount(React.cloneElement(element, { multiple: false, filters: { filter: '2' } }))
    })

    it('should render one active filter', () => {
      expect(wrapper.find('Tag')).toHaveLength(1)
      expect(getFilter(0).text()).toBe('Active 2')
    })

    it('should call setFilterState on change', () => {
      expect(element.props.setFilterState).not.toHaveBeenCalled()
      getFilter(0).simulate('click')
      expect(element.props.setFilterState).toHaveBeenCalledWith({ filter: '' })
    })
  })

  describe('Years Range', () => {
    beforeEach(() => {
      element = (
        <ActiveFilters
          code="yearsRange"
          filters={{ yearsRange: { min: 1950, max: 2000 } }}
          default={{ min: 1900, max: 2018 }}
          setFilterState={jest.fn()}
          range
        />
      )
      wrapper = mount(element)
    })

    it('should render two active year filters', () => {
      expect(wrapper.find('Tag')).toHaveLength(2)
      expect(getFilter(0).text()).toBe('1950…')
      expect(getFilter(1).text()).toBe('…2000')
    })

    it('should call setFilterState on change', () => {
      expect(element.props.setFilterState).not.toHaveBeenCalled()
      getFilter(0).simulate('click')
      expect(element.props.setFilterState).toHaveBeenCalledWith({ yearsRange: { min: 1900, max: 2000 } })
      getFilter(1).simulate('click')
      expect(element.props.setFilterState).toHaveBeenCalledWith({ yearsRange: { min: 1950, max: 2018 } })
    })

    it('should render one active year filter if limit on one side only', () => {
      wrapper = mount(React.cloneElement(element, { filters: { yearsRange: { min: 1900, max: 2000 } } }))
      expect(wrapper.find('Tag')).toHaveLength(1)
      expect(getFilter(0).text()).toBe('…2000')
    })

    it('should render one active year filter borders are equal', () => {
      wrapper = mount(React.cloneElement(element, { filters: { yearsRange: { min: 2000, max: 2000 } } }))
      expect(wrapper.find('Tag')).toHaveLength(1)
      expect(getFilter(0).text()).toBe('2000')
      expect(element.props.setFilterState).not.toHaveBeenCalled()
      getFilter(0).simulate('click')
      expect(element.props.setFilterState).toHaveBeenCalledWith({ yearsRange: { min: 1900, max: 2018 } })
    })
  })
})

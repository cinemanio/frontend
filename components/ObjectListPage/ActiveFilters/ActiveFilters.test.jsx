import React from 'react'
import { mount } from 'enzyme'

import ActiveFilters from './ActiveFilters'

describe('Active Filters Component', () => {
  let element
  let wrapper

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
    expect(wrapper.find('span')).toHaveLength(2)
    expect(wrapper.find('span').at(0).text()).toBe('Active 1')
    expect(wrapper.find('span').at(1).text()).toBe('Active 2')
  })

  it('should call setFilterState on change', () => {
    expect(element.props.setFilterState).not.toHaveBeenCalled()
    wrapper.find('span').at(0).simulate('click')
    expect(element.props.setFilterState).toHaveBeenCalledWith({ filter: new Set(['2']) })
  })

  describe('Multiple is off', () => {
    beforeEach(() => {
      wrapper = mount(React.cloneElement(element, { multiple: false, filters: { filter: '2' } }))
    })

    it('should render one active filter', () => {
      expect(wrapper.find('span')).toHaveLength(1)
      expect(wrapper.find('span').at(0).text()).toBe('Active 2')
    })

    it('should call setFilterState on change', () => {
      expect(element.props.setFilterState).not.toHaveBeenCalled()
      wrapper.find('span').at(0).simulate('click')
      expect(element.props.setFilterState).toHaveBeenCalledWith({ filter: '' })
    })
  })
})

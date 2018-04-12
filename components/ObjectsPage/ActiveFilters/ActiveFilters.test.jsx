import React from 'react'
import { mount } from 'enzyme'

import ActiveFilters from './ActiveFilters'

describe('Active Filters Component', () => {
  let element
  let wrapper

  beforeEach(() => {
    element = (<ActiveFilters
      code="filter"
      list={[{ id: '1', name: 'Active 1' }, { id: '2', name: 'Active 2' }, { id: '3', name: '' }]}
      active={['1', '2']}
      removeFilter={jest.fn()}
    />)
    wrapper = mount(element)
  })

  it('should render all active filters', () => {
    expect(wrapper.find('span')).toHaveLength(2)
    expect(wrapper.find('span').at(0).text()).toBe('Active 1')
    expect(wrapper.find('span').at(1).text()).toBe('Active 2')
  })

  it('should call removeFilter on click', () => {
    expect(element.props.removeFilter).not.toHaveBeenCalled()
    wrapper.find('span').at(1).simulate('click')
    expect(element.props.removeFilter).toHaveBeenCalledWith('filter', '2')
  })
})

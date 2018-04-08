import React from 'react'
import { shallow } from 'enzyme'

import SelectFilter from './SelectFilter'

describe('Select Filter Component', () => {
  let element
  let wrapper

  beforeEach(() => {
    element = (<SelectFilter
      code="filter"
      title="Filter"
      list={[{ id: '1', name: '' }, { id: '2', name: '' }, { id: '3', name: '' }]}
      active={['1', '2']}
      setFilter={jest.fn()}
    />)
    wrapper = shallow(element)
  })

  it('should render all options', () => {
    expect(wrapper.find('select')).toHaveLength(1)
    expect(wrapper.find('option')).toHaveLength(2)
    expect(wrapper.find('option').at(0).text()).toBe('Filter')
  })

  it('should call setFilter on change', () => {
    expect(element.props.setFilter).not.toHaveBeenCalled()
    wrapper.find('select').simulate('change', { currentTarget: { value: '2' } })
    expect(element.props.setFilter).toHaveBeenCalledWith('filter', '2')
  })
})

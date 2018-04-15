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
      multiple
    />)
    wrapper = shallow(element)
  })

  it('should render select and all options', () => {
    expect(wrapper.find('select')).toHaveLength(1)
    expect(wrapper.find('option')).toHaveLength(2)
    expect(wrapper.find('option').at(0).text()).toBe('Filter')
  })

  it('should render select if multiple=False and active is not defined', () => {
    wrapper = shallow(React.cloneElement(element, { multiple: false, active: [] }))
    expect(wrapper.find('select')).toHaveLength(1)
    expect(wrapper.find('option')).toHaveLength(4)
  })

  it('should not render select if multiple=False and active defined', () => {
    wrapper = shallow(React.cloneElement(element, { multiple: false }))
    expect(wrapper.find('select')).toHaveLength(0)
    expect(wrapper.find('option')).toHaveLength(0)
  })

  it('should call setFilter on change', () => {
    expect(element.props.setFilter).not.toHaveBeenCalled()
    wrapper.find('select').simulate('change', { currentTarget: { value: '2' } })
    expect(element.props.setFilter).toHaveBeenCalledWith('filter', '2')
  })
})

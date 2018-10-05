import React from 'react'
import { shallow } from 'enzyme'

import SelectFilter from './SelectFilter'

describe('Select Filter Component', () => {
  let element
  let wrapper

  beforeEach(() => {
    element = (
      <SelectFilter
        code="filter"
        title="Name"
        list={[{ id: '1', name: 'One' }, { id: '2', name: 'Two' }, { id: '3', name: 'Three' }]}
        filters={{ filter: new Set(['1', '2']) }}
        setFilterState={jest.fn()}
        multiple
      />
    )
    wrapper = shallow(element)
  })

  it('should render select and all unselected options', () => {
    expect(wrapper.find('select')).toHaveLength(1)
    expect(wrapper.find('option')).toHaveLength(2)
    expect(wrapper.find('option').at(0).text()).toBe('Name')
    expect(wrapper.find('select').prop('value')).toBe('')
  })

  it('should render select with selected value if multiple=False and filter defined', () => {
    wrapper = shallow(React.cloneElement(element, { multiple: false, filters: { filter: '3' } }))
    expect(wrapper.find('select')).toHaveLength(1)
    expect(wrapper.find('option')).toHaveLength(4)
    expect(wrapper.find('select').prop('value')).toBe('3')
  })

  it('should call setFilterState on change', () => {
    expect(element.props.setFilterState).not.toHaveBeenCalled()
    wrapper.find('select').simulate('change', { currentTarget: { value: '3' } })
    expect(element.props.setFilterState).toHaveBeenCalledWith({ filter: new Set(['1', '2', '3']) })
  })

  describe('Multiple is off', () => {
    beforeEach(() => {
      wrapper = shallow(React.cloneElement(element, { multiple: false, filters: { filter: '' } }))
    })

    it('should render select and all options', () => {
      expect(wrapper.find('select')).toHaveLength(1)
      expect(wrapper.find('option')).toHaveLength(4)
    })

    it('should call setFilterState on change', () => {
      expect(element.props.setFilterState).not.toHaveBeenCalled()
      wrapper.find('select').simulate('change', { currentTarget: { value: '3' } })
      expect(element.props.setFilterState).toHaveBeenCalledWith({ filter: '3' })
    })
  })
})

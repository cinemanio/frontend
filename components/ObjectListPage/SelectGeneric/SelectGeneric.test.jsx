import React from 'react'
import { shallow } from 'enzyme'

import SelectGeneric from './SelectGeneric'

describe('Select Generic Component', () => {
  let element
  let wrapper

  beforeEach(() => {
    element = (
      <SelectGeneric
        list={[{ id: '1', name: '' }, { id: '2', name: '' }, { id: '3', name: '' }]}
        code="view"
        filters={{ view: '1' }}
        setFilterState={jest.fn()}
      />
    )
    wrapper = shallow(element)
  })

  it('should render select and all unselected options', () => {
    expect(wrapper.find('Select')).toHaveLength(1)
    expect(wrapper.find('Option')).toHaveLength(3)
  })

  it('should have default selected option', () => expect(wrapper.find('Select').prop('value')).toBe('1'))

  it('should call setFilterState on change', () => {
    expect(element.props.setFilterState).not.toHaveBeenCalled()
    wrapper.find('Select').simulate('change', '3')
    expect(element.props.setFilterState).toHaveBeenCalledWith({ view: '3' })
  })
})

import React from 'react'
import { shallow } from 'enzyme'

import SelectOrder from './SelectOrder'

describe('Select View Component', () => {
  let element
  let wrapper

  beforeEach(() => {
    element = (<SelectOrder
      list={[{ id: '1', name: '' }, { id: '2', name: '' }, { id: '3', name: '' }]}
      filters={{ view: '1' }}
      setFilterState={jest.fn()}
      t={jest.fn()}
    />)
    wrapper = shallow(element)
  })

  it('should render select and all unselected options', () => {
    expect(wrapper.find('select')).toHaveLength(1)
    expect(wrapper.find('option')).toHaveLength(3)
  })

  it('should call setFilterState on change', () => {
    expect(element.props.setFilterState).not.toHaveBeenCalled()
    wrapper.find('select').simulate('change', { currentTarget: { value: '3' } })
    expect(element.props.setFilterState).toHaveBeenCalledWith({ orderBy: '3' })
  })
})

import React from 'react'
import { mount } from 'enzyme/build'
import _ from 'lodash'

import i18nClient from 'libs/i18nClient'

import { mountOptions } from './helpers'

export default (content, element) => (props) => {
  it(`should render only ${Object.keys(props)} blocks`, () => {
    i18nClient.changeLanguage('en')
    const wrapper = mount(React.cloneElement(element, props), mountOptions)
    _.forEach(content, (value, key) => {
      let expectation = expect(wrapper.text())
      // props does not contain key
      if (Object.keys(props).indexOf(key) === -1 && props.all !== true) {
        expectation = expectation.not
      }
      expectation.toContain(value)
    })
  })
}

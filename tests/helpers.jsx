// @flow
/* eslint-disable promise/avoid-new */
import React from 'react'
import { mount } from 'enzyme'
import { Provider } from 'mobx-react'
import { MemoryRouter } from 'react-router-dom'
import { MockedProvider } from 'react-apollo/test-utils'
import { AutoSizer } from 'react-virtualized'
import _ from 'lodash'

import i18nClient from 'libs/i18nClient'
import { stores } from 'components/App/App'

export const mountOptions = {}

export const getMockedNetworkFetch = (response: Object | Array<Object>, requestsLog: ?Array<Object>) => {
  let i = 0
  return (uri: string, data: Object) => {
    const request = JSON.parse(data.body)
    // console.debug(request)
    if (requestsLog) {
      requestsLog.push(request)
    }
    let resp
    if (_.isArray(response)) {
      resp = response[i]
      i += 1
    } else {
      resp = response
    }
    const getText = () => new Promise(resolve => resolve(JSON.stringify(resp)))
    return new Promise(resolve => resolve({ text: getText }))
  }
}

export const mountRouter = (element: Object) => mount(
  <MemoryRouter><Provider {...stores}>{element}</Provider></MemoryRouter>, mountOptions)

export const mountGraphql = async (element: React.Fragment, mocks: Array<Object>) => {
  const wrapper = mountRouter(<MockedProvider mocks={mocks}>{element}</MockedProvider>)
  await new Promise(resolve => setTimeout(resolve))
  wrapper.update()
  return wrapper
}

export const mockAutoSizer = () => {
  // $FlowFixMe
  spyOn(AutoSizer.prototype, 'render').and.callFake(function render() {
    return (
      <div ref={this._setRef}>
        {this.props.children({ width: 200, height: 100 })}
      </div>
    )
  })
}

export const selectFilterChange = (wrapper: Object, selector: string, value: string) => {
  // wrapper.find('SelectFilter').at(number).find('select').simulate('change', { currentTarget: { value } })
  // workaround instead of .simulate https://github.com/airbnb/enzyme/issues/218#issuecomment-332975628
  wrapper.find(selector).find('select').props()
    .onChange({ currentTarget: { value } })
  wrapper.update()
}

export const itShouldRenderBlocks = (content: Object, element: Object) => (props: Object) => {
  // $FlowFixMe
  it(`should render only ${Object.keys(props)} blocks`, () => {
    i18nClient.changeLanguage('en')
    const wrapper = mount(React.cloneElement(element, props), mountOptions)
    _.forEach(content, (value, key) => {
      // $FlowFixMe
      let expectation = expect(wrapper.text())
      // props does not contain key
      if (Object.keys(props).indexOf(key) === -1 && props.all !== true) {
        expectation = expectation.not
      }
      expectation.toContain(value)
    })
  })
}

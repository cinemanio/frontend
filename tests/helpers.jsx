// @flow
/* eslint-disable promise/avoid-new */
import React from 'react'
import { mount } from 'enzyme'
import { Provider } from 'mobx-react'
import { MemoryRouter } from 'react-router-dom'
import { MockedProvider } from 'react-apollo/test-utils'
import { AutoSizer } from 'react-virtualized'
import { Provider as AlertProvider } from 'react-alert'
import { I18nextProvider } from 'react-i18next'
import _ from 'lodash'

import i18nClient from 'libs/i18nClient'
import { stores, alertOptions } from 'components/App/App'
import AlertTemplate from 'components/App/AlertTemplate/AlertTemplate'

import objectRelations from './objectRelations'
import objectsRelations from './objectsRelations'
import objectInfo from './objectInfo'

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

export const mountRouter = (element: Object, initialEntries: Array<string>) => mount(
  <MemoryRouter initialEntries={initialEntries}>
    <Provider {...stores}>
      <AlertProvider template={AlertTemplate} {...alertOptions}>
        <I18nextProvider i18n={i18nClient}>
          {element}
        </I18nextProvider>
      </AlertProvider>
    </Provider>
  </MemoryRouter>,
  mountOptions)

export const mountGraphql = async (element: React.Fragment, mocks: Array<Object>, initialEntries: Array<string>) => {
  const wrapper = mountRouter(<MockedProvider mocks={mocks}>{element}</MockedProvider>, initialEntries)
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
  wrapper.find(selector).find('Select').first().props().onChange(value)
  wrapper.update()
}

export const paginate = (wrapper: Object) => {
  const scrollContainer = wrapper.find('Grid').find('div').first()
  const target = scrollContainer.instance()
  target.scrollTop = 8100
  scrollContainer.prop('onScroll')({ target })
}

export const getAlerts = (wrapper: Object) => wrapper.find('Relation').first().prop('alert').alerts

export const itShouldTestObjectRelations = objectRelations

export const itShouldTestObjectsRelations = objectsRelations

export const itShouldRenderBlocks = objectInfo

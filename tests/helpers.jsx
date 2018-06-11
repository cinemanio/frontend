// @flow
import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'
import { ApolloProvider } from 'react-apollo'
import { AutoSizer } from 'react-virtualized'
import createMockedNetworkFetch from 'apollo-mocknetworkinterface'
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-client-preset'
import _ from 'lodash'

import i18nClient from 'libs/i18nClient'
// import fragmentMatcher from 'libs/fragments/matcher'

export const getMockedNetworkFetch = (response: Object | Array<Object>, requestsLog: ?Array<Object>) => {
  let i = 0
  return createMockedNetworkFetch((request: Object) => {
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
    return resp
  }, { timeout: 0 })
}

export const mountGraphql = (response: Object | Array<Object>, element: Object, requestsLog: ?Array<Object>) => {
  const mockedNetworkFetch = getMockedNetworkFetch(response, requestsLog)
  const client = new ApolloClient({
    link: new HttpLink({ fetch: mockedNetworkFetch }),
    cache: new InMemoryCache()
  })
  return mount(
    <ApolloProvider client={client}>
      <MemoryRouter>
        {element}
      </MemoryRouter>
    </ApolloProvider>
  )
}

export const mountRouter = (element: Object) => mount(<MemoryRouter>{element}</MemoryRouter>)

export const populated = (done: Function, wrapper: Object, callback: Function) =>
  setTimeout(async () => {
    wrapper.update()
    await callback()
    done()
  }, 0)


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

export const selectFilterChange = (wrapper: Object, number: number, value: string) => {
  // workaround instead of .simulate https://github.com/airbnb/enzyme/issues/218#issuecomment-332975628
  wrapper.find('SelectFilter').at(number).find('select').props()
    .onChange({ currentTarget: { value } })
  wrapper.update()
}

export const i18nProps = {
  t: (i: string) => i18nClient.t(i),
  i18n: i18nClient,
}


export const itShouldRenderBlocks = (content: Object, element: Object) => (props: Object) => {
  // $FlowFixMe
  it(`should render only ${Object.keys(props)} blocks`, () => {
    element.props.i18n.changeLanguage('en')
    const wrapper = mount(React.cloneElement(element, props))
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

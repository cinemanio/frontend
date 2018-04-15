// @flow
import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'
import { ApolloProvider } from 'react-apollo'
import { AutoSizer } from 'react-virtualized';
import createMockedNetworkFetch from 'apollo-mocknetworkinterface'
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-client-preset'
import _ from 'lodash'

export const mountGraphql = (response: Object | Array<Object>, element: Object, requestsLog: ?Array<Object>) => {
  let i = 0
  const mockedNetworkFetch = createMockedNetworkFetch((request: Object) => {
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
  setTimeout(() => {
    wrapper.update()
    callback()
    done()
  }, 0)


export const mockAutoSizer = () => {
  spyOn(AutoSizer.prototype, 'render').and.callFake(function render() {
    return (
      <div ref={this._setRef}>
        {this.props.children({ width: 200, height: 100 })}
      </div>
    )
  })
}

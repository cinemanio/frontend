// @flow
import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'
import { ApolloProvider } from 'react-apollo'
import createMockedNetworkFetch from 'apollo-mocknetworkinterface'
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-client-preset'
import _ from 'lodash'

export const mountGraphql = (response: Object | Array<Object>, element: Object) => {
  let i = 0
  const mockedNetworkFetch = createMockedNetworkFetch(() => {
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


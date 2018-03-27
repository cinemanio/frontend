// @flow
import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'
import { ApolloProvider } from 'react-apollo'
import createMockedNetworkFetch from 'apollo-mocknetworkinterface'
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-client-preset'

export const mountGraphql = (response: Object, element: Object) => {
  const mockedNetworkFetch = createMockedNetworkFetch(() => response, { timeout: 0 })
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


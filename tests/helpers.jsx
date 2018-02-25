import React from 'react'
import { mount } from 'enzyme'
import createMockedNetworkFetch from 'apollo-mocknetworkinterface'
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-client-preset'
import { ApolloProvider } from 'react-apollo'

export const mountGraphql = (response, element) => {
  const mockedNetworkFetch = createMockedNetworkFetch(() => response, { timeout: 0 })
  const client = new ApolloClient({
    link: new HttpLink({ fetch: mockedNetworkFetch }),
    cache: new InMemoryCache()
  })
  return mount(
    <ApolloProvider client={client}>
      <div>
        {element}
      </div>
    </ApolloProvider>
  )
}

export const populated = (done, wrapper, callback) =>
  setTimeout(() => {
    wrapper.update()
    callback()
    done()
  }, 0)


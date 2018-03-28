// @flow
import React from 'react'
import { hot } from 'react-hot-loader'
import { ApolloProvider } from 'react-apollo'
import { BrowserRouter } from 'react-router-dom'
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-client-preset'
import fetch from 'unfetch'

import App from 'components/App/App'

const client = new ApolloClient({
  ssrForceFetchDelay: 100,
  link: new HttpLink({ uri: window.API_URL, fetch }),
  cache: new InMemoryCache().restore(window.INITIAL_STATE)
})

const ClientApp = () => (
  <ApolloProvider client={client}>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </ApolloProvider>
)

export default hot(module)(ClientApp)

// @flow
import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { Router, browserHistory } from 'react-router'
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-client-preset'

import routes from '../routes'

const client = new ApolloClient({
  ssrForceFetchDelay: 100,
  link: new HttpLink({ uri: window.API_URL }),
  cache: new InMemoryCache().restore(window.INITIAL_STATE)
})

export default () => (
  <ApolloProvider client={client}>
    <Router history={browserHistory} routes={routes}/>
  </ApolloProvider>
)

// @flow
import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-client-preset'

import ClientApp from './ClientApp'
import routes from '../routes'

const client = new ApolloClient({
  ssrForceFetchDelay: 100,
  link: new HttpLink({ uri: 'http://127.0.0.1:8000/graphql/' }),
  cache: new InMemoryCache().restore(window.__INITIAL_STATE__),
})

// TODO: use a constant, reference in renderHtmlPage
const target = document.getElementById('react-container')
ReactDOM.render(<ClientApp client={client} routes={routes}/>, target)
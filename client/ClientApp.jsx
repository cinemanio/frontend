// @flow
import React from 'react'
import { hot } from 'react-hot-loader'
import { ApolloProvider } from 'react-apollo'
import { BrowserRouter } from 'react-router-dom'
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-client-preset'
import { configure } from 'mobx'
import fetch from 'unfetch'

import 'libs/i18nClient'
import App from 'components/App/App'
import stores from 'components/App/stores'
import graphqlAuth from 'libs/graphqlAuth'

const { lang } = document.getElementsByTagName('html')[0]
const client = new ApolloClient({
  ssrForceFetchDelay: 100,
  link: graphqlAuth.concat(new HttpLink({ uri: window.API_URL, fetch })),
  cache: new InMemoryCache().restore(window.INITIAL_STATE),
})

// For easier debugging
window.APP_STATE = stores

configure({
  enforceActions: 'observed',
})

const ClientApp = () => (
  <ApolloProvider client={client}>
    <BrowserRouter>
      <App lang={lang} />
    </BrowserRouter>
  </ApolloProvider>
)

export default hot(module)(ClientApp)

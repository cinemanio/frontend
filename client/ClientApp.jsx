// @flow
import React from 'react'
import { hot } from 'react-hot-loader'
import { ApolloProvider } from 'react-apollo'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-client-preset'
import { useStrict } from 'mobx'
import { Provider } from 'mobx-react'
import fetch from 'unfetch'

import App from 'components/App/App'
import i18nClient from 'libs/i18nClient'
import graphqlAuth from 'libs/graphqlAuth'
import auth from 'stores/Auth'
import token from 'stores/Token'
import user from 'stores/User'

const { lang } = document.getElementsByTagName('html')[0]
const client = new ApolloClient({
  ssrForceFetchDelay: 100,
  link: graphqlAuth.concat(new HttpLink({ uri: window.API_URL, fetch })),
  cache: new InMemoryCache().restore(window.INITIAL_STATE),
})
const stores = { auth, token, user }

// For easier debugging
window.APP_STATE = stores;

useStrict(true);

const ClientApp = () => (
  <ApolloProvider client={client}>
    <Provider {...stores}>
      <BrowserRouter>
        <I18nextProvider i18n={i18nClient}>
          <App lang={lang}/>
        </I18nextProvider>
      </BrowserRouter>
    </Provider>
  </ApolloProvider>
)

export default hot(module)(ClientApp)

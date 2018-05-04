// @flow
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import Helmet from 'react-helmet'
import RedBox from 'redbox-react'
import { StaticRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-client-preset'
import { ApolloProvider, renderToStringWithData } from 'react-apollo'

import App from 'components/App/App'
import i18nServer from 'libs/i18nServer'
import i18nStore from 'locales/ru/translation.json'

import renderHtmlPage from './renderHtmlPage'
import settings from '../settings'

function ApolloReduxReactSSR(apolloHttpConf: Object) {
  const fetchDataAndRenderBody = async (client: Object, app: Object) => {
    let markup = ''
    let initialState
    let head = null
    try {
      markup = await renderToStringWithData(app)
      initialState = client.extract()
    } finally {
      head = Helmet.renderStatic()
    }
    return { markup, head, initialState }
  }

  const renderErrorPage = (error: Object) => {
    const initialState = { error: true } // TODO: think of something better...
    let markup = null
    let head = null
    try {
      markup = ReactDOMServer.renderToString(<RedBox error={error}/>)
    } finally {
      head = Helmet.rewind()
    }
    return { markup, head, initialState }
  }

  return async function apolloReduxReactSSR(ctx: Object) {
    const client = new ApolloClient({
      ssrMode: true,
      link: new HttpLink(apolloHttpConf),
      cache: new InMemoryCache()
    })

    const context = {}
    const app = (
      <ApolloProvider client={client}>
        <StaticRouter location={ctx.request.url} context={context}>
          <I18nextProvider i18n={i18nServer}>
            <App/>
          </I18nextProvider>
        </StaticRouter>
      </ApolloProvider>
    )

    let status = null
    let renderResult = null
    try {
      renderResult = await fetchDataAndRenderBody(client, app)
      status = context.status || 200
    } catch (error) {
      console.error(error)
      renderResult = renderErrorPage(error)
      status = 500
    }
    const { markup, head, initialState } = renderResult

    if (context.url) {
      ctx.redirect(context.url)
      return
    }

    ctx.status = status
    ctx.body = renderHtmlPage(markup, head, initialState, settings.backendApiUrl)
  }
}

export default ApolloReduxReactSSR

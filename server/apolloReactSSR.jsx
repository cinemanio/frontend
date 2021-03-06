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
import graphqlAuth from 'libs/graphqlAuth'
import Token from 'stores/Token'
import settings from 'settings'

import renderHtmlPage from './renderHtmlPage'
import bundle from './bundle'

Helmet.canUseDOM = false

export default (apolloHttpConf: Object) => {
  const fetchDataAndRenderBody = async (client: Object, app: Object) => {
    let markup = ''
    let initialState
    let head = null
    try {
      markup = await renderToStringWithData(app)
      initialState = client.extract()
    } finally {
      head = Helmet.rewind()
    }
    return { markup, head, initialState }
  }

  const renderErrorPage = (error: Object) => {
    const initialState = { error: true } // TODO: think of something better...
    let markup = null
    let head = null
    try {
      markup = ReactDOMServer.renderToString(<RedBox error={error} />)
    } finally {
      head = Helmet.rewind()
    }
    return { markup, head, initialState }
  }

  return async (ctx: Object) => {
    Token.init(ctx.req.headers.cookie, true)

    const client = new ApolloClient({
      ssrMode: true,
      link: graphqlAuth.concat(new HttpLink(apolloHttpConf)),
      cache: new InMemoryCache(),
    })

    const lang = i18nServer.services.languageDetector.detect(ctx).slice(0, 2)
    i18nServer.changeLanguage(lang)

    const context = {}
    const app = (
      <ApolloProvider client={client}>
        <StaticRouter location={ctx.request.url} context={context}>
          <I18nextProvider i18n={i18nServer}>
            <App lang={lang} />
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
    ctx.body = renderHtmlPage(markup, head, initialState, settings.backendApiUrl, bundle)
  }
}

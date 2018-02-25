// @flow
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import Helmet from 'react-helmet'
import RedBox from 'redbox-react'
import { toInteger } from 'lodash'
import { match, RouterContext } from 'react-router'
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-client-preset'
import { ApolloProvider, renderToStringWithData } from 'react-apollo'

import Layout from '../components/Layout/Layout'
import settings from '../settings'
import renderHtmlPage from './renderHtmlPage'

const matchRoute = async (...args) => new Promise((resolve, reject) => {
  match(...args, (error, redirectLocation, renderProps) => {
    if (error) {
      reject(error)
    } else {
      resolve({ redirectLocation, renderProps })
    }
  })
})

async function fetchDataAndRenderBody(client: Object, app: Object) {
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

function renderErrorPage(error: Object) {
  const initialState = { error: true } // TODO: think of something better...
  let markup = null
  let head = null
  try {
    markup = ReactDOMServer.renderToString(<Layout><RedBox error={error}/></Layout>)
  } finally {
    head = Helmet.rewind()
  }
  return { markup, head, initialState }
}

function ApolloReduxReactSSR(routes: Object) {
  return async function apolloReduxReactSSR(ctx: Object) {
    const { redirectLocation, renderProps } = await matchRoute({
      routes,
      location: ctx.request.url
    })

    if (redirectLocation) {
      ctx.redirect(redirectLocation.pathname + redirectLocation.search)
      return
    }

    const client = new ApolloClient({
      ssrMode: true,
      link: new HttpLink({ uri: settings.backendApiUrl }),
      cache: new InMemoryCache()
    })

    const app = (
      <ApolloProvider client={client}>
        <RouterContext {...renderProps} />
      </ApolloProvider>
    )

    let status = null
    let renderResult = null
    try {
      renderResult = await fetchDataAndRenderBody(client, app)
      status = renderProps.routes.reduce((prev, route) => Math.max(toInteger(route.status), prev), 200)
      status = 200
    } catch (error) {
      status = 500
      renderResult = renderErrorPage(error)
    }
    const { markup, head, initialState } = renderResult

    ctx.status = status
    ctx.body = renderHtmlPage(markup, head, initialState, settings.backendApiUrl)
  }
}

export default ApolloReduxReactSSR

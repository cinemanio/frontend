// @flow
import React from 'react'
import ReactDOM from 'react-dom/server'
import Helmet from 'react-helmet'
import { toInteger } from 'lodash'
import { match, RouterContext } from 'react-router'
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-client-preset'
import { ApolloProvider, renderToStringWithData } from 'react-apollo'

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

function renderErrorPage(errorPage: Object) {
  const initialState = { error: true } // TODO: think of something better...
  let markup = null
  let head = null
  try {
    markup = ReactDOM.renderToString(errorPage)
  } finally {
    head = Helmet.rewind()
  }
  return { markup, head, initialState }
}

function ApolloReduxReactSSR({ routes, Error500Page }: Object) {
  // generate this on boot, b/c it really sucks when your error pages crash
  const errorPage = renderErrorPage(Error500Page)

  return async function apolloReduxReactSSR(ctx: Object) {
    const { redirectLocation, renderProps } = await matchRoute({
      routes,
      location: ctx.request.url
    })

    if (redirectLocation) {
      ctx.redirect(redirectLocation.pathname + redirectLocation.search)
      return
    }

    const apiUrl = 'http://127.0.0.1:8000/graphql/'
    const client = new ApolloClient({
      ssrMode: true,
      link: new HttpLink({
        uri: apiUrl
        // headers: ctx.request.headers,
      }),
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
      renderResult = errorPage
    }
    const { markup, head, initialState } = renderResult

    ctx.status = status
    ctx.body = renderHtmlPage(markup, head, initialState, apiUrl)
  }
}

export default ApolloReduxReactSSR

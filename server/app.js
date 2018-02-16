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

async function fetchDataAndRenderBody(client, app) {
  let markup = ''
  let initialState = undefined
  let head = null
  try {
    markup = await renderToStringWithData(app)
    initialState = client.extract()
  } finally {
    head = Helmet.rewind()
  }
  return { markup, head, initialState }
}

function renderErrorPage(errorPage) {
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

function ApolloReduxReactSSR({ reducers, routes, Error500Page }) {
  // generate this on boot, b/c it really sucks when your error pages crsash
  const errorPage = renderErrorPage(Error500Page)

  return async function apolloReduxReactSSR(ctx: Ctx) {

    const { redirectLocation, renderProps } = await matchRoute({
      routes,
      location: ctx.request.url,
    })

    if (redirectLocation) {
      ctx.redirect(redirectLocation.pathname + redirectLocation.search)
      return
    }

    const client = new ApolloClient({
      ssrMode: true,
      link: new HttpLink({
        uri: 'http://127.0.0.1:8000/graphql/',
        // headers: ctx.request.headers,
      }),
      cache: new InMemoryCache(),
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
    ctx.body = renderHtmlPage(markup, head, initialState)
  }
}

export default ApolloReduxReactSSR
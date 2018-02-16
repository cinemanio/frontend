// @flow
import React from 'react'
import ReactDOM from 'react-dom/server'
import Helmet from 'react-helmet'
import { toInteger } from 'lodash'
// import { createStore, combineReducers } from 'redux'
import { StaticRouter } from 'react-router'
// import { routerReducer } from 'react-router-redux'
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-client-preset'
import { ApolloProvider, renderToStringWithData, getDataFromTree } from 'react-apollo'
import { createLocation } from 'history'
// var renderToStringWithData = require("react-apollo").renderToStringWithData;

import renderHtmlPage from './renderHtmlPage'

// const matchRoute = async (url) => new Promise((resolve, reject) => {
//   match(url, (error, redirectLocation, renderProps) => {
//     // console.log(error)
//     // console.log(redirectLocation)
//     // console.log(renderProps)
//     if (error) {
//       reject(error)
//     } else {
//       resolve({ redirectLocation, renderProps })
//     }
//   })
// })

async function fetchDataAndRenderBody(client, app) {
  let markup = ''
  let initialState = undefined
  let head = null
  try {
    // console.log(app);
    markup = await renderToStringWithData(app)
    // console.log(client.extract())
    initialState = client.extract()
  } finally {
    head = Helmet.rewind()
  }
  // const { markup, initialState } = renderResult
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

    // const { redirectLocation, renderProps } = await matchRoute(ctx.request.url)

    // if (redirectLocation) {
    //   ctx.redirect(redirectLocation.pathname + redirectLocation.search)
    //   return
    // }

    const client = new ApolloClient({
      ssrMode: true,
      link: new HttpLink({ uri: 'http://127.0.0.1:8000/graphql/' }),
      cache: new InMemoryCache(),
      // networkInterface: createNetworkInterface(Object.assign({}, networkInterfaceOptions, {
      //     headers: ctx.request.headers,
      //   },
      // )),
    })

    // const store = createStore(combineReducers(Object.assign({}, reducers, {
    //   apollo: client.reducer(),
    //   routing: routerReducer,
    // })))

    const app = (
      <ApolloProvider client={client}>
        <StaticRouter  />
      </ApolloProvider>
    )
    // console.log({ app, client, renderProps })

    let status = null
    let renderResult = null
    try {
      renderResult = await fetchDataAndRenderBody(client, app)
      // status = renderProps.routes.reduce((prev, route) => Math.max(toInteger(route.status), prev), 200)
      status = 200
      // console.log(renderResult)
    } catch (error) {
      // console.log(error)
      status = 500
      renderResult = errorPage
    }
    const { markup, head, initialState } = renderResult

    ctx.status = status
    ctx.body = renderHtmlPage(markup, head, initialState)
  }
}

export default ApolloReduxReactSSR

// @flow
import Koa from 'koa'
import logger from 'koa-logger'
import serve from 'koa-static'
import mount from 'koa-mount'
import favicon from 'koa-favicon'
import proxy from 'koa-proxies'

import ApolloReduxReactSSR from './middleware'
import settings from '../settings'

const getApp = (apolloHttpConf: Object) => {
  const app = new Koa()

  app.use(favicon('public/favicon.ico'))
  app.use(logger())
  app.use(async (ctx, next) => {
    try {
      await next()
    } catch (err) {
      ctx.body = { message: err.message, stack: err.stack }
      ctx.status = err.status || 500
    }
  })

  if (settings.env === 'development') {
    // in development env use proxy to webpack dev server
    const proxySettings = {
      target: `http://${settings.webpackServerHost}`,
      logs: true
    }
    app
      .use(proxy('/public', proxySettings))
      .use(proxy('/locales', proxySettings))
  } else {
    // in production env use mounted directory
    app
      .use(mount('/public', serve('public')))
      .use(mount('/locales', serve('locales')))
  }

  app.use(ApolloReduxReactSSR(apolloHttpConf))
  return app
}

export default getApp

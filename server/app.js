// @flow
import Koa from 'koa'
import logger from 'koa-logger'
import serve from 'koa-static'
import mount from 'koa-mount'
import favicon from 'koa-favicon'
import proxy from 'koa-proxies'
import Router from 'koa-router'

import apolloReactSSR from './apolloReactSSR'
import image from './image'
import settings from '../settings'

const getApp = (apolloHttpConf: Object) => {
  const app = new Koa()
  const router = new Router()

  router.get('/images/:type/:image/:size/:id.jpg', image(apolloHttpConf))

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

  if (settings.dev) {
    // in development env use proxy to webpack dev server
    const proxySettings = {
      target: `http://${settings.webpackServerHost}`,
      logs: true,
    }
    app.use(proxy('/public', proxySettings)).use(proxy('/locales', proxySettings))
  } else {
    // in production env use mounted directory
    app.use(mount('/public', serve('public'))).use(mount('/locales', serve('locales')))
  }

  app.use(router.routes())
  app.use(router.allowedMethods())
  app.use(apolloReactSSR(apolloHttpConf))

  return app
}

export default getApp

// @flow
import Koa from 'koa'
import logger from 'koa-logger'
import serve from 'koa-static'
import mount from 'koa-mount'
import favicon from 'koa-favicon'
import proxy from 'koa-proxies'
import register from 'ignore-styles'

import ApolloReduxReactSSR from './app'
import routes from '../routes'
import settings from '../settings'

register(['.scss'])

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
  app.use(proxy('/public', {
    target: `http://${settings.webpackServerHost}`,
    logs: true
  }))
} else {
  app.use(mount('/public', serve('public')))
}

app.use(ApolloReduxReactSSR(routes))

app.listen(settings.koaServerPort, () => {
  console.log('Server listening at %s', settings.koaServerPort) // eslint-disable-line no-console
})

// @flow
import Koa from 'koa'
import logger from 'koa-logger'
import serve from 'koa-static'
import mount from 'koa-mount'
import favicon from 'koa-favicon'

import ApolloReduxReactSSR from './app'
import routes from '../routes'

const port = process.env.PORT || 3000
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

app.use(mount('/public', serve('public')))

app.use(ApolloReduxReactSSR(routes))

app.listen(port, () => {
  console.log('Listening to %s', port) // eslint-disable-line no-console
})

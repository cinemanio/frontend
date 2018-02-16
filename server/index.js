// @flow
import Koa from 'koa'
import logger from 'koa-logger'
import serve from 'koa-static'
import mount from 'koa-mount'
import favicon from 'koa-favicon'

import ApolloReduxReactSSR from './app'
import routes, { Error500Page } from '../routes'
import * as reducers from '../flux/reducers'

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

app.use(ApolloReduxReactSSR({
  reducers,
  routes,
  Error500Page,
  networkInterfaceOptions: {
    uri: 'http://127.0.0.1:8000/graphql/',
    credentials: 'same-origin',
  },
}))

app.listen(3000, () => {
  console.log('serving...')  // eslint-disable-line no-console
})

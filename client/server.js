// @flow
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'

import settings from '../settings'

const config = require('../webpack.dev.config')

config.entry.app = [`webpack-dev-server/client?http://${settings.webpackServerHost}`].concat(config.entry.app)
config.output.publicPath = `http://${settings.webpackServerHost}/public/`
config.output.devtoolModuleFilenameTemplate = '/home'

const port = settings.webpackServerHost.split(':')[1]
const host = settings.webpackServerHost.split(':')[0]

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  inline: true,
  historyApiFallback: true,
  stats: {
    colors: true
  },
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers':
      'Content-Type, Authorization, x-id, Content-Length, X-Requested-With',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  }
}).listen(port, host, (err) => {
  if (err) {
    console.log(err)
  }
  console.log(`Dev server listening at ${settings.webpackServerHost}`)
})

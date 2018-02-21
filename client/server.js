// @flow
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'

const config = require('../webpack.dev.config')

const hostDev = process.env.WEBPACK_SERVER_HOST || '0.0.0.0:3001'

config.entry.app = [`webpack-dev-server/client?http://${hostDev}`].concat(config.entry.app)
config.output.publicPath = `http://${hostDev}/public/`
config.output.devtoolModuleFilenameTemplate = '/home'

const port = hostDev.split(':')[1]
const host = hostDev.split(':')[0]

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
  console.log(`Listening at ${hostDev}`)
})

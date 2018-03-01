// eslint-disable no-param-reassign
const webpack = require('webpack')
const BundleTracker = require('webpack-bundle-tracker')

const settings = require('./settings')

const config = require('./webpack.base.config.js')

// Use webpack dev server
config.entry.app = [
  'babel-polyfill',
  'react-hot-loader/patch',
  './client/index'
]

config.output.publicPath = `http://${settings.webpackServerHost}/public/`
config.output.devtoolModuleFilenameTemplate = '/home'

// Use webpack dev server
config.devServer = {
  compress: true,
  publicPath: config.output.publicPath,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers':
      'Content-Type, Authorization, x-id, Content-Length, X-Requested-With',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  },
  hot: true,
  inline: true,
  historyApiFallback: true,
  stats: {
    colors: true
  },
  host: settings.webpackServerHost.split(':')[0],
  port: settings.webpackServerHost.split(':')[1]
}

// Add HotModuleReplacementPlugin and BundleTracker plugins
config.plugins.push(
  new BundleTracker({ filename: './webpack-stats.json' }),
  new webpack.NamedModulesPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin() // don't reload if there is an error
)

// Configure SCSS: add sourceMap to all loaders
// const extractSass = config.plugins[0]
// const extractSassConfig = config.module.rules[1].use
// extractSassConfig.use.forEach((loader) => {
//   if (!loader.options) {
//     loader.options = {}
//   }
//   loader.options.sourceMap = true
// })
// config.module.rules[1].use = extractSass.extract(extractSassConfig)
config.devtool = 'cheap-module-source-map'

module.exports = config

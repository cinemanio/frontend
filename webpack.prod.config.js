/* eslint-disable no-param-reassign */
const webpack = require('webpack')
// const BundleTracker = require('webpack-bundle-tracker')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const config = require('./webpack.base.config.js')

// path is relative to make it working with URLs like https://www.nihms.nih.gov/ms/submission/create/
config.output.publicPath = '../../static/bundles/'

config.plugins.push(
  // new BundleTracker({ filename: './webpack-stats.json' }),
  // removes a lot of debugging code in React
  new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('production') }),
  // minifies your code
  new UglifyJSPlugin(),
)

// Configure SCSS: add minimize to css-loader
const extractSass = config.plugins[0]
const extractSassConfig = config.module.rules[1].use
extractSassConfig.use[0].options.minimize = true
config.module.rules[1].use = extractSass.extract(extractSassConfig)
config.devtool = 'source-map'

module.exports = config

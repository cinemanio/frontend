// eslint-disable no-param-reassign
const webpack = require('webpack')
const BundleTracker = require('webpack-bundle-tracker')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const config = require('./webpack.base.config.js')

// path is relative to make it working with URLs like https://www.nihms.nih.gov/ms/submission/create/
config.output.publicPath = '/public/'

config.plugins.push(
  new BundleTracker({ filename: './webpack-stats.json' }),
  // removes a lot of debugging code in React
  new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('production') }),
  // minifies your code
  new UglifyJSPlugin({
    cache: true,
    parallel: true,
    sourceMap: false // set to true if you want JS source maps
  }),
  new OptimizeCSSAssetsPlugin({}),
)

module.exports = config

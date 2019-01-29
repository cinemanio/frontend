// eslint-disable no-param-reassign
const webpack = require('webpack')
const BundleTracker = require('webpack-bundle-tracker')
const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const config = require('./webpack.base.config.js')

// path is relative to make it working with URLs like https://www.nihms.nih.gov/ms/submission/create/
config.output.publicPath = '/public/'

config.devtool = false

config.plugins.push(
  new BundleTracker({ filename: './webpack-stats.json' }),
  // removes a lot of debugging code in React
  new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('production') }),
  new OptimizeCSSAssetsPlugin({})
)

config.optimization = {
  minimizer: [
    // minifies your code
    new TerserPlugin({
      parallel: true,
      cache: true,
      extractComments: true,
      terserOptions: {
        ecma: 6,
      },
    }),
  ],
}

module.exports = config

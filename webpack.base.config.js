const path = require('path')
const webpack = require('webpack')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const settings = require('./settings')

// hide webpack2 deprecation warnings
process.noDeprecation = true

module.exports = {
  context: __dirname,
  entry: {
    app: [
      // the order is important for IE
      // https://github.com/facebook/react/issues/8379#issuecomment-264858787
      // 'babel-polyfill',
      path.resolve('client/index'),
    ],
  },
  mode: settings.env,
  // performance: {
  //   hints: !settings.dev ? 'error' : 'warning',
  // },
  output: {
    path: path.resolve('public'),
    filename: settings.dev ? '[name].js' : '[name].[hash].js',
  },
  devtool: false,
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'app',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: settings.dev ? '[name].css' : '[name].[hash].css',
      // chunkFilename: settings.dev ? '[id].css' : '[id].[hash].css',
    }),
    // plugin helps to reduce js bundle up to 5Kb
    new LodashModuleReplacementPlugin({
      // shorthands: true,
      cloning: true,
      // currying: true,
      caching: true,
      // collections: true,
      // exotics: true,
      // guards: true,
      // metadata: true,
      // deburring: true,
      // unicode: true,
      // chaining: true,
      // memoizing: true,
      // coercions: true,
      flattening: true,
      // paths: true,
      // placeholders: true,
    }),
    new webpack.EnvironmentPlugin(Object.keys(process.env)),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules\/(?!(pretty-bytes))/,
        use: [{ loader: 'babel-loader' }],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: settings.dev ? 'style-loader' : MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              modules: false,
              // this value should be equal to value in .babelrc
              localIdentName: '[name]__[local]__[hash:base64:5]',
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: settings.dev ? 'style-loader' : MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              modules: true,
              // this value should be equal to value in .babelrc
              localIdentName: '[name]__[local]__[hash:base64:5]',
            },
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'sass-loader',
            options: {
              includePaths: [path.resolve('styles')],
              data: '@import "styles/variables";',
            },
          },
        ],
      },
      {
        test: /\.(map|png)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
            },
          },
        ],
      },
      {
        test: /\.woff(2)?(\?\S*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'application/font-woff',
            },
          },
        ],
      },
      {
        test: /\.(ttf|eot|svg|ico)(\?\S*)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    modules: ['node_modules', 'bower_components'],
    descriptionFiles: ['package.json'],
    extensions: ['.js', '.jsx'],
    alias: {
      libs: path.resolve('libs'),
      locales: path.resolve('locales'),
      tests: path.resolve('tests'),
      stores: path.resolve('stores'),
      components: path.resolve('components'),
      settings: path.resolve('settings.js'),
    },
  },
}

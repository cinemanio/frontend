const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

// hide webpack2 deprecation warnings
process.noDeprecation = true

module.exports = {
  context: __dirname,
  entry: {
    app: [
      // the order is important for IE
      // https://github.com/facebook/react/issues/8379#issuecomment-264858787
      // 'babel-polyfill',
      path.resolve('client/index')
    ]
  },
  mode: process.env.NODE_ENV || 'development',
  performance: {
    hints: process.env.NODE_ENV === 'production' ? 'warning' : false
  },
  output: {
    path: path.resolve('public'),
    // filename: '[name]-[hash].js',
    filename: '[name].js'
  },
  plugins: [
    new ExtractTextPlugin({
      // filename: '[name]-[hash].css',
      filename: '[name].css',
      disable: process.env.NODE_ENV === 'development',
      allChunks: true
    }),
    new webpack.EnvironmentPlugin(Object.keys(process.env))
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules\/(?!(pretty-bytes))/,
        use: [{ loader: 'babel-loader' }]
      },
      {
        test: /\.scss$/,
        // use value here is just configuration for ExtractTextPlugin.extract() method,
        // which get modificated and applied later in webpack.(dev|prod).config files.
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              modules: true,
              // this value should be equal to value in .babelrc
              localIdentName: '[name]__[local]__[hash:base64:5]'
            }
          },
          {
            loader: 'postcss-loader'
          },
          {
            loader: 'sass-loader',
            options: {
              includePaths: [path.resolve('styles')],
              data: '@import "styles/variables";'
            }
          }
        ]
      },
      {
        test: /\.css$/,
        // use value here is just configuration for ExtractTextPlugin.extract() method,
        // which get modificated and applied later in webpack.(dev|prod).config files.
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              modules: false,
              // this value should be equal to value in .babelrc
              localIdentName: '[name]__[local]__[hash:base64:5]'
            }
          }
        ]
      },
      {
        test: /\.(map|png)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000
          }
        }]
      },
      {
        test: /\.woff(2)?(\?\S*)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/font-woff'
          }
        }]
      },
      {
        test: /\.(ttf|eot|svg|ico)(\?\S*)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]'
          }
        }]
      }
    ]
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
      components: path.resolve('components')
    }
  }
}

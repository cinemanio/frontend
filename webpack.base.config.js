const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path')
const webpack = require('webpack')

// hide webpack2 deprecation warnings
process.noDeprecation = true

module.exports = {
  context: __dirname,
  entry: {
    app: [
      // the order is important for IE
      // https://github.com/facebook/react/issues/8379#issuecomment-264858787
      // 'babel-polyfill',
      path.resolve('client/index.jsx'),
    ],
  },
  output: {
    // path: path.resolve('public'),
    // filename: '[name]-[hash].js',
    filename: '[name].bundle.js',
  },
  plugins: [
    new ExtractTextPlugin({
      // filename: '[name]-[hash].css',
      filename: '[name].bundle.css',
      disable: process.env.NODE_ENV === 'development',
      allChunks: true,
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
        test: /\.s?css$/,
        // use value here is just configuration for ExtractTextPlugin.extract() method,
        // which get modificated and applied later in webpack.(dev|prod).config files.
        use: {
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2,
                modules: true,
                localIdentName: '[name]__[local]__[hash:base64:5]',
              },
            },
            {
              loader: 'postcss-loader',
            },
            {
              loader: 'sass-loader',
              options: {
                includePaths: [path.join(__dirname, 'styles/')],
                // data: '@import "assets/styles/variables";',
              },
            },
          ],
        },
      },
      {
        test: /\.(map|png)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000,
          },
        }],
      },
      {
        test: /\.woff(2)?(\?\S*)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/font-woff',
          },
        }],
      },
      {
        test: /\.(ttf|eot|svg|ico)(\?\S*)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
          },
        }],
      },
    ],
  },
  resolve: {
    modules: ['node_modules', 'bower_components'],
    descriptionFiles: ['package.json'],
    extensions: ['.js', '.jsx'],
    alias: {
      libs: path.join(__dirname, 'libs'),
      tests: path.join(__dirname, 'tests'),
      stores: path.join(__dirname, 'stores'),
      components: path.join(__dirname, 'components'),
    },
  },
}

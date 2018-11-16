import settings from 'settings'

const extract = (regexp) => {
  // eslint-disable-next-line global-require
  const webpackStates = require('../../webpack-stats.json')
  // eslint-disable-next-line
  console.log(webpackStates)
  return webpackStates.status === 'done'
    ? webpackStates.chunks.app.map(chunk => chunk.publicPath).filter(path => path.match(regexp))
    : []
}

export default {
  js: settings.dev ? ['/public/app.js'] : extract(/\.js$/),
  css: settings.dev ? [] : extract(/\.css$/),
}

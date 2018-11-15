import webpackStates from 'webpack-stats'
import settings from 'settings'

const extract = (regexp) =>
  webpackStates.status === 'done'
    ? webpackStates.chunks.app.map(chunk => chunk.publicPath).filter(path => path.match(regexp))
    : []

export default {
  js: settings.dev ? ['/public/app.js'] : extract(/\.js$/),
  css: settings.dev ? [] : extract(/\.css$/),
}

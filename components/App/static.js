import webpackStates from 'webpack-stats'
import settings from 'settings'

const extract = (section) =>
  (webpackStates.status === 'done' && webpackStates.chunks[section])
    ? webpackStates.chunks[section].map(chunk => chunk.publicPath) : []

export default {
  js: settings.dev ? ['/public/app.js'] : extract('app'),
  css: settings.dev ? [] : extract('styles'),
}

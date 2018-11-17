// @flow
import register from 'ignore-styles'

import settings from 'settings'

import app from './app'

register(['.scss'])

app({ uri: settings.backendApiUrl }).listen(settings.koaServerPort, () => {
  console.log('Server listening at %s', settings.koaServerPort) // eslint-disable-line no-console
})

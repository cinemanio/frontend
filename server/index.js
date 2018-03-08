// @flow
import register from 'ignore-styles'

import app from './app'
import settings from '../settings'

register(['.scss'])

app({ uri: settings.backendApiUrl }).listen(settings.koaServerPort, () => {
  console.log('Server listening at %s', settings.koaServerPort) // eslint-disable-line no-console
})

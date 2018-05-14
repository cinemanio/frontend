// @flow
import i18n from 'i18next'
import _ from 'lodash'

import settings from '../settings'

const getField = (field: string, lang: string) => `${field}${_.capitalize(lang)}`

export default {
  f: (field: string) => getField(field, i18n.language),
  gql: (field: string) => settings.languages.map(lang => getField(field, lang)).join(', ')
}

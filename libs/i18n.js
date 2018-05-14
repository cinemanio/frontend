// @flow
import i18n from 'i18next'
import _ from 'lodash'

const getField = (field: string, lang: string) => `${field}${_.capitalize(lang)}`

export const i18nField = (field: string) => getField(field, i18n.language)

export const i18nFields = (field: string) => ['en', 'ru'].map(lang => getField(field, lang)).join(', ')

// @flow
import React from 'react'
import { translate } from 'react-i18next'
import type { Translator } from 'react-i18next'
import { PropTypes } from 'prop-types'
import { InstantSearch, Index } from 'react-instantsearch/dom';

import i18nClient from 'libs/i18nClient'
import settings from '../../../settings'

import './Search.scss'
import AutoComplete from './AutoComplete/AutoComplete'

type Props = { i18n: Translator }

@translate()
export default class Search extends React.Component<Props> {
  static defaultProps = {
    i18n: i18nClient,
  }

  static propTypes = {
    i18n: PropTypes.object,
  }

  render() {
    return (
      <InstantSearch
        appId={settings.searchAppId}
        apiKey={settings.searchApiKey}
        indexName="movie"
      >
        <AutoComplete />
        <Index indexName="person" />
      </InstantSearch>
    )
  }
}

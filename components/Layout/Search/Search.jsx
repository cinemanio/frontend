// @flow
import React from 'react'
import { InstantSearch, Index } from 'react-instantsearch/dom'

import settings from 'settings'

import SearchField from './SearchField/SearchField'

export default class Search extends React.PureComponent<{}> {
  render() {
    return (
      <InstantSearch appId={settings.searchAppId} apiKey={settings.searchApiKey} indexName="movie">
        <SearchField />
        <Index indexName="person" />
      </InstantSearch>
    )
  }
}

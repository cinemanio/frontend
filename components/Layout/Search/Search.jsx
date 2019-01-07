// @flow
import React from 'react'
import { InstantSearch, Index } from 'react-instantsearch/dom'

import settings from 'settings'

import SearchField from './SearchField/SearchField'

export const connectInstantSearch = element => (
  <InstantSearch appId={settings.searchAppId} apiKey={settings.searchApiKey} indexName="movie">
    {element}
    <Index indexName="person" />
  </InstantSearch>
)

export default class Search extends React.PureComponent<{}> {
  render() {
    return connectInstantSearch(<SearchField />)
  }
}

// @flow
import React from 'react'
import type { Translator } from 'react-i18next'
import { PropTypes } from 'prop-types'
import { connectAutoComplete } from 'react-instantsearch/connectors'
import { Highlight } from 'react-instantsearch/dom'
import Autosuggest from 'react-autosuggest'
import { translate } from 'react-i18next'
import { Input, Icon } from 'antd'

import i18nClient from 'libs/i18nClient'
import routes from 'components/App/routes'

import './AutoComplete.scss'
import { withRouter } from 'react-router-dom'

type Props = { i18n: Translator, history: Object }

@translate()
@connectAutoComplete
@withRouter
export default class AutoComplete extends React.Component<Props> {
  static defaultProps = {
    i18n: i18nClient,
  }

  static propTypes = {
    i18n: PropTypes.object,
    hits: PropTypes.arrayOf(PropTypes.object).isRequired,
    currentRefinement: PropTypes.string.isRequired,
    refine: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
  }

  state = {
    value: this.props.currentRefinement,
  }

  onChange = (event: Event, { newValue }: Object) => {
    this.setState({
      value: newValue,
    })
  }

  onSuggestionsFetchRequested = ({ value }: Object) => {
    this.props.refine(value)
  }

  onSuggestionsClearRequested = () => {
    this.props.refine()
  }

  /**
   * Value, which should be inserted, after click on suggestion
   */
  getSuggestionValue = () => ''

  /**
   * Callback after click on suggestion
   */
  onSuggestionSelected = (event: Event, { suggestion }: Object) => {
    // TODO: support for persons
    this.props.history.push(routes.movie.detail.replace(':slug', suggestion.objectID))
  }

  // TODO: support for persons
  renderSuggestion = (hit: Object) => <Highlight attribute="title_en" hit={hit} tagName="mark"/>

  renderSectionTitle(section: Object) {
    return section.index
  }

  getSectionSuggestions(section: Object) {
    return section.hits
  }

  renderInputComponent(inputProps: Object) {
    return <Input suffix={<Icon type="search" styleName="icon"/>} {...inputProps}/>
  }

  render() {
    const inputProps = {
      placeholder: this.props.i18n.t('search.placeholder'),
      onChange: this.onChange,
      value: this.state.value,
    }

    return (
      <Autosuggest
        suggestions={this.props.hits}
        inputProps={inputProps}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        onSuggestionSelected={this.onSuggestionSelected}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        renderInputComponent={this.renderInputComponent}
        renderSectionTitle={this.renderSectionTitle}
        getSectionSuggestions={this.getSectionSuggestions}
        multiSection
      />
    )
  }
}

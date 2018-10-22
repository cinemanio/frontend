// @flow
import React from 'react'
import type { Translator } from 'react-i18next'
import { PropTypes } from 'prop-types'
import { connectAutoComplete } from 'react-instantsearch/connectors'
import { Highlight } from 'react-instantsearch/dom'
import Autosuggest from 'react-autosuggest'
import { Input, Icon } from 'antd'

import './AutoComplete.scss'

class Example extends React.Component<> {
  static propTypes = {
    hits: PropTypes.arrayOf(PropTypes.object).isRequired,
    currentRefinement: PropTypes.string.isRequired,
    refine: PropTypes.func.isRequired,
  }

  state = {
    value: this.props.currentRefinement,
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
    })
  }

  onSuggestionsFetchRequested = ({ value }) => {
    this.props.refine(value)
  }

  onSuggestionsClearRequested = () => {
    this.props.refine()
  }

  getSuggestionValue(hit) {
    return hit.title_en
  }

  renderSuggestion(hit) {
    return <Highlight attribute="title_en" hit={hit} tagName="mark"/>
  }

  renderSectionTitle(section) {
    return section.index
  }

  getSectionSuggestions(section) {
    return section.hits
  }

  renderInputComponent(inputProps: Object) {
    return <Input suffix={<Icon type="search" className="certain-category-icon"/>} {...inputProps}/>
  }

  render() {
    const inputProps = {
      placeholder: 'Search for a product...',
      onChange: this.onChange,
      value: this.state.value,
    }

    return (
      <Autosuggest
        suggestions={this.props.hits}
        multiSection={true}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        renderInputComponent={this.renderInputComponent}
        inputProps={inputProps}
        renderSectionTitle={this.renderSectionTitle}
        getSectionSuggestions={this.getSectionSuggestions}
      />
    )
  }
}

export default connectAutoComplete(Example)

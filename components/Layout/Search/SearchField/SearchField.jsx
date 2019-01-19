// @flow
import * as React from 'react'
import type { Translator } from 'react-i18next'
import { PropTypes } from 'prop-types'
import { connectAutoComplete } from 'react-instantsearch/connectors'
import { Highlight } from 'react-instantsearch/dom'
import { translate } from 'react-i18next'
import { withRouter } from 'react-router-dom'
import { Icon, Input, AutoComplete } from 'antd'
import { throttle, debounce } from 'throttle-debounce'
import _ from 'lodash'

import i18nClient from 'libs/i18nClient'
import routes from 'components/App/routes'

import './SearchField.scss'

// for some reason destructuring doesn't work in jest: ReferenceError: AutoComplete is not defined
const Option = AutoComplete.Option // eslint-disable-line prefer-destructuring
const OptGroup = AutoComplete.OptGroup // eslint-disable-line prefer-destructuring

type Props = { i18n: Translator, history: Object, hits: Array<Object>, currentRefinement: string, refine: Function }
type State = { value: string }

@translate()
@withRouter
export class SearchFieldRaw extends React.Component<Props, State> {
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

  searchDebounced: Function

  searchThrottled: Function

  constructor(props: Object) {
    super(props)
    this.state = { value: this.props.currentRefinement }

    this.searchDebounced = debounce(500, this.search)
    this.searchThrottled = throttle(500, this.search)
  }

  /**
   * Callback after click on suggestion
   */
  onSelect = (value: string) => {
    const [index, id] = value.split('-')
    this.props.history.push(routes[index].detail.replace(':slug', id))
    this.props.refine('')
    this.setState({ value: '' })
  }

  search = (value: string) => this.props.refine(value)

  onSearch = (value: string) => {
    this.setState({ value })
    // If the query term is short or ends with a
    // space, trigger the more impatient version.
    if (value.length < 5 || value.endsWith(' ')) {
      this.searchThrottled(value)
    } else {
      this.searchDebounced(value)
    }
  }

  renderTitle(index: string) {
    // TODO: make link to list with filtration by search
    return _.capitalize(`${index}s`)
  }

  renderOption(index: string, hit: Object) {
    const indexToOption = {
      movie: 'title',
      person: 'name',
    }
    const attribute = `${indexToOption[index]}_${this.props.i18n.language}`
    // let option = hit.title
    let option = <Highlight attribute={attribute} hit={hit} tagName="mark" highlight={[]} />
    if (index === 'movie') {
      option = (
        <div>
          {option} ({hit.year})
        </div>
      )
    }
    return option
  }

  renderOptions(): ?Array<React.Node> {
    return !this.state.value
      ? null
      : this.props.hits.map(group => (
          <OptGroup key={group.index} label={this.renderTitle(group.index)}>
            {group.hits.map(hit => (
              <Option key={hit.objectID} value={`${group.index}-${hit.objectID}`} object={hit}>
                {this.renderOption(group.index, hit)}
              </Option>
            ))}
          </OptGroup>
        ))
  }

  render() {
    return (
      <AutoComplete
        className="search"
        dropdownClassName="search-dropdown"
        dropdownMatchSelectWidth={false}
        dropdownStyle={{ width: 300 }}
        styleName="box"
        dataSource={this.renderOptions()}
        onSelect={this.onSelect}
        onSearch={this.onSearch}
        placeholder=""
        optionLabelProp="object"
        defaultActiveFirstOption={false}
        autoClearSearchValue={false}
        value={this.state.value}
      >
        <Input suffix={<Icon type="search" styleName="icon" />} placeholder={this.props.i18n.t('search.placeholder')} />
      </AutoComplete>
    )
  }
}

export default connectAutoComplete(SearchFieldRaw)

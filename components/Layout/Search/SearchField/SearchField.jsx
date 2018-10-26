// @flow
import React from 'react'
import type { Translator } from 'react-i18next'
import { PropTypes } from 'prop-types'
import { connectAutoComplete } from 'react-instantsearch/connectors'
import { Highlight } from 'react-instantsearch/dom'
import { translate } from 'react-i18next'
import { Icon, Input, AutoComplete } from 'antd'
import _ from 'lodash'

const { Option } = AutoComplete
const { OptGroup } = AutoComplete

import i18nClient from 'libs/i18nClient'
import routes from 'components/App/routes'

import './SearchField.scss'
import { withRouter } from 'react-router-dom'

type Props = { i18n: Translator, history: Object }

@translate()
@connectAutoComplete
@withRouter
export default class SearchField extends React.Component<Props> {
  static defaultProps = {
    i18n: i18nClient,
  }

  static propTypes = {
    i18n: PropTypes.object,
    hits: PropTypes.arrayOf(PropTypes.object).isRequired,
    // currentRefinement: PropTypes.string.isRequired,
    refine: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
  }

  /**
   * Callback after click on suggestion
   */
  onSelect = (value: string) => {
    // TODO: support for persons
    this.props.history.push(routes.movie.detail.replace(':slug', value))
  }

  onSearch = value => this.props.refine(value)

  renderTitle(index: string) {
    // TODO: make link to list with filtration by search
    return _.capitalize(`${index}s`)
  }

  renderOption(index: string, hit: Object) {
    const attribute = index === 'movie' ? 'title_en' : 'first_name_en'
    return <Highlight attribute={attribute} hit={hit} tagName="mark" />
  }

  render() {
    const options = this.props.hits.map(group => (
      <OptGroup key={group.index} label={this.renderTitle(group.index)}>
        {group.hits.map(hit => (
          <Option key={hit.objectID} value={hit.objectID} object={hit}>
            {this.renderOption(group.index, hit)}
          </Option>
        ))}
      </OptGroup>
    ))

    return (
      <AutoComplete
        className="search"
        dropdownClassName="search-dropdown"
        dropdownMatchSelectWidth={false}
        dropdownStyle={{ width: 300 }}
        styleName="box"
        dataSource={options}
        onSelect={this.onSelect}
        onSearch={this.onSearch}
        placeholder=""
        optionLabelProp="object"
        defaultActiveFirstOption={false}
        autoClearSearchValue={false}
      >
        <Input
          suffix={<Icon type="search" styleName="icon" />}
          onChange={this.onChange}
          placeholder={this.props.i18n.t('search.placeholder')}
        />
      </AutoComplete>
    )
  }
}

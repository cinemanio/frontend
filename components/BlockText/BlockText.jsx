// @flow
import * as React from 'react'
import { PropTypes } from 'prop-types'
import { translate } from 'react-i18next'
import type { Translator } from 'react-i18next'

import Block from 'components/Block/Block'
import i18nClient from 'libs/i18nClient'

import './BlockText.scss'

type Props = { title: string | React.Node, children?: React.Node | Function, i18n: Translator, content: string }
type State = { full: boolean }

@translate()
export default class BlockText extends React.PureComponent<Props, State> {
  static defaultProps = {
    i18n: i18nClient,
    children: null,
  }

  static propTypes = {
    i18n: PropTypes.object,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    content: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  }

  static symbolsLimit: number = 500

  state = { full: false }

  get content(): string {
    if (this.props.content && !this.state.full) {
      return `${this.props.content.substring(0, BlockText.symbolsLimit)}…`
    } else {
      return this.props.content
    }
  }

  display = (full: boolean) => (e: Event) => {
    e.preventDefault()
    this.setState({ full })
  }

  renderMore() {
    return this.state.full || this.content.length < BlockText.symbolsLimit ? null : (
      <button type="button" styleName="more" onClick={this.display(true)}>
        {this.props.i18n.t('block.displayMore')}
      </button>
    )
  }

  renderTitle() {
    const { title } = this.props
    return !this.state.full ? (
      title
    ) : (
      <div>
        {title}
        <button type="button" styleName="hide" onClick={this.display(false)}>
          {this.props.i18n.t('block.displayLess')}
        </button>
      </div>
    )
  }

  renderContent() {
    if (typeof this.props.children === 'function') {
      return this.props.children(this.content)
    } else {
      return this.content
    }
  }

  render() {
    return (
      <Block title={this.renderTitle()}>
        {this.renderContent()}
        {this.renderMore()}
      </Block>
    )
  }
}

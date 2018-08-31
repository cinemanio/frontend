// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'
import wtf from 'wtf_wikipedia'

import Block from 'components/Block/Block'

import WikiSection from './WikiSection/WikiSection'
import './ObjectWikipedia.scss'

type Props = { object: Object }
type State = { full: boolean }

export default class ObjectWikipedia extends React.PureComponent<Props, State> {
  static propTypes = {
    object: PropTypes.object.isRequired,
  }

  static contextTypes = {
    i18n: PropTypes.object.isRequired,
  }

  static fragments = {
    movie: gql`
      fragment MovieWikipedia on MovieNode {
        wikipedia {
          edges {
            node {
              content
              lang
            }
          }
        }
      }
    `,
    person: gql`
      fragment PersonWikipedia on PersonNode {
        wikipedia {
          edges {
            node {
              content
              lang
            }
          }
        }
      }
    `,
  }

  constructor(props: Object) {
    super(props)
    this.state = { full: false }
  }

  symbolsLimit: number = 500

  get content(): ?string {
    const edges = this.props.object.wikipedia.edges.filter(edge => edge.node.lang === this.context.i18n.language)
    let content = edges.length > 0 ? edges[0].node.content : null
    if (content && !this.state.full) {
      content = `${content.substring(0, this.symbolsLimit)}…`
    }
    return content
  }

  display = (full: boolean) => (e: Event) => {
    e.preventDefault()
    this.setState({ full })
  }

  renderMore() {
    return this.state.full ? ''
      : <button href="#" onClick={this.display(true)}>{this.context.i18n.t('wikipedia.displayMore')}</button>
  }

  renderTitle() {
    const title = this.context.i18n.t('wikipedia.title')
    return this.state.full
      ? (
        <div>
          {title}
          <button onClick={this.display(false)} styleName="hide">{this.context.i18n.t('wikipedia.displayLess')}</button>
        </div>
      ) : title
  }

  render() {
    const { content } = this
    return !content ? '' : (
      <div styleName="wikipedia">
        <Block title={this.renderTitle()}>
          { // eslint-disable-next-line react/no-array-index-key
            wtf(content).data.sections.map((section, i) => <WikiSection key={i} section={section}/>)}
          {this.renderMore()}
        </Block>
      </div>
    )
  }
}

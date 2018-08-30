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

  get content(): string {
    const edges = this.props.object.wikipedia.edges.filter(edge => edge.node.lang === this.context.i18n.language)
    let content = edges.length > 0 ? edges[0].node.content : null
    if (content && !this.state.full) {
      content = `${content.substring(0, 500)}…`
    }
    return content
  }

  displayFull = (e: Event) => {
    e.preventDefault()
    this.setState({ full: true })
  }

  renderLink() {
    return this.state.full ? ''
      : <a href="#" onClick={this.displayFull}>{this.context.i18n.t('wikipedia.displayFull')}</a>
  }

  render() {
    const { content } = this
    return !content ? '' : (
      <div styleName="wikipedia">
        <Block title={this.context.i18n.t('wikipedia.title')}>
          {wtf(content).data.sections.map(section => <WikiSection key={section} section={section}/>)}
          {this.renderLink()}
        </Block>
      </div>
    )
  }
}

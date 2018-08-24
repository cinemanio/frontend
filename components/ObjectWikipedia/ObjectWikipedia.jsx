// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'

import Block from 'components/Block/Block'

type Props = { object: Object }

export default class ObjectWikipedia extends React.PureComponent<Props> {
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

  getContent() {
    const edges = this.props.object.wikipedia.edges.filter(edge => edge.node.lang === this.context.i18n.language)
    return edges ? edges[0].node.content : null
  }

  render() {
    const content = this.getContent()
    return !content ? '' : (
      <Block title={this.context.i18n.t('wikipedia.title')}>
        {content}
      </Block>
    )
  }
}

// @flow
import * as React from 'react'
import { PropTypes } from 'prop-types'
import { withTranslation } from 'react-i18next'
import type { Translator } from 'react-i18next'
import gql from 'graphql-tag'
import wtf from 'wtf_wikipedia'

import BlockText from 'components/BlockText/BlockText'
import i18nClient from 'libs/i18nClient'

import WikiSection from './WikiSection/WikiSection'
import './ObjectWikipedia.scss'

type Props = { object: Object, i18n: Translator }

@withTranslation()
export default class ObjectWikipedia extends React.PureComponent<Props> {
  static defaultProps = {
    i18n: i18nClient,
  }

  static propTypes = {
    i18n: PropTypes.object,
    object: PropTypes.object.isRequired,
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

  get content(): ?string {
    const edges = this.props.object.wikipedia.edges.filter(edge => edge.node.lang === this.props.i18n.language)
    return edges.length > 0 ? edges[0].node.content : null
  }

  renderContent(text: string): React.Node {
    const wikiText = text.replace(/\n/g, '\n\n')
    // eslint-disable-next-line react/no-array-index-key
    return wtf(wikiText).data.sections.map((section, i) => <WikiSection key={i} section={section} />)
  }

  render() {
    const { content } = this
    return !content ? null : (
      <div styleName="box">
        <BlockText title={this.props.i18n.t('wikipedia.title')} content={content}>
          {this.renderContent}
        </BlockText>
      </div>
    )
  }
}

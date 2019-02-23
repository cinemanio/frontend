// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import { translate } from 'react-i18next'
import type { Translator } from 'react-i18next'
import gql from 'graphql-tag'

import BlockText from 'components/BlockText/BlockText'

import './ObjectKinopoiskInfo.scss'
import i18nClient from '../../libs/i18nClient'

type Props = { object: Object, i18n: Translator }

@translate()
export default class ObjectKinopoiskInfo extends React.PureComponent<Props> {
  static defaultProps = {
    i18n: i18nClient,
  }

  static propTypes = {
    i18n: PropTypes.object,
    object: PropTypes.object.isRequired,
  }

  static fragments = {
    movie: gql`
      fragment MovieKinopoiskInfo on MovieNode {
        kinopoisk {
          info
        }
      }
    `,
    person: gql`
      fragment PersonKinopoiskInfo on PersonNode {
        kinopoisk {
          info
        }
      }
    `,
  }

  get display(): boolean {
    return !!this.content && this.props.i18n.language === 'ru'
  }

  get content(): string {
    return this.props.object.kinopoisk && this.props.object.kinopoisk.info
  }

  render() {
    return !this.display ? (
      ''
    ) : (
      <div styleName="box">
        <BlockText title={this.props.i18n.t('kinopoisk.title')} content={this.content} />
      </div>
    )
  }
}

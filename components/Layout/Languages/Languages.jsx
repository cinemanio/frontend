// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import { translate } from 'react-i18next'
import type { Translator } from 'react-i18next'
import Cookies from 'js-cookie'

import i18nClient from 'libs/i18nClient'

import './Languages.scss'
import settings from '../../../settings'

type Props = { i18n: Translator }

@translate()
export default class Languages extends React.Component<Props> {
  static defaultProps = {
    i18n: i18nClient,
  }

  static propTypes = {
    i18n: PropTypes.object,
  }

  changeLanguage = (lang: string) => (e: Event) => {
    e.preventDefault()
    this.props.i18n.changeLanguage(lang)
    Cookies.set(settings.i18nCookieName, lang)
  }

  render() {
    return (
      <div styleName="box">
        {settings.languages.map(([lang, title]) => (this.props.i18n.language === lang
          ? <strong key={lang}>{title}</strong>
          : <a key={lang} href={`#${lang}`} onClick={this.changeLanguage(lang)}>{title}</a>))}
      </div>
    )
  }
}

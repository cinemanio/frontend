// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import Cookies from 'js-cookie'

import './Languages.scss'
import settings from '../../../settings'

export default class Languages extends React.Component<{}> {
  static contextTypes = {
    i18n: PropTypes.object.isRequired,
  }

  changeLanguage = (lang: string) => (e: Event) => {
    e.preventDefault()
    this.context.i18n.changeLanguage(lang)
    Cookies.set(settings.i18nCookieName, lang)
  }

  render() {
    return (
      <div styleName="box">
        {settings.languages.map(([lang, title]) => (this.context.i18n.language === lang
          ? <strong key={lang}>{title}</strong>
          : <a key={lang} href={`#${lang}`} onClick={this.changeLanguage(lang)}>{title}</a>))}
      </div>
    )
  }
}

// @flow
import React from 'react'
import i18n from 'i18next'
import Cookies from 'js-cookie'

import './Languages.scss'
import settings from '../../../settings'

type Props = {}

export default class Languages extends React.Component<Props> {
  languages = [
    ['en', 'English'],
    ['ru', 'Русский']
  ]

  changeLanguage = (lang: string) => (e: Event) => {
    e.preventDefault()
    i18n.changeLanguage(lang)
    Cookies.set(settings.i18nCookieName, lang)
  }

  render() {
    return (
      <div styleName="box">
        {this.languages.map(([lang, title]) => (i18n.language === lang
          ? <strong key={lang}>{title}</strong>
          : <a key={lang} href={`#${lang}`} onClick={this.changeLanguage(lang)}>{title}</a>))}
      </div>
    )
  }
}

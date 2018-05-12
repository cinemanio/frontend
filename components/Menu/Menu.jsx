// @flow
import React from 'react'
import { Link } from 'react-router-dom'
import { formatRoute } from 'react-router-named-routes'
import { PropTypes } from 'prop-types'
import i18n from 'i18next'
import Cookies from 'js-cookie'

import routes from 'components/App/routes'

import './Menu.scss'
import settings from '../../settings'

type Props = { active?: string }

export default class Menu extends React.PureComponent<Props> {
  static defaultProps = {
    active: undefined
  }

  static propTypes = {
    active: PropTypes.string,
    t: PropTypes.func.isRequired
  }

  get menu() {
    return [
      ['movie', this.props.t('menu.movies')],
      ['person', this.props.t('menu.persons')]
    ]
  }

  getClass(type: string) {
    const classes = ['nav-link']
    if (type === this.props.active) {
      classes.push('active')
    }
    return classes.join(' ')
  }

  changeLang = (e, lang: string) => {
    e.preventDefault()
    i18n.changeLanguage(lang)
    Cookies.set(settings.i18nCookieName, lang)
  }

  renderMenu() {
    return this.menu.map(([type, title]) => (
      <li className="nav-item" key={type}>
        <Link to={routes[type].list} className={this.getClass(type)}>{title}</Link>
      </li>
    ))
  }

  render() {
    return (
      <ul className="nav nav-tabs">
        {this.renderMenu()}
        <Link to={formatRoute(routes.person.detail, { slug: '404' })} className="nav-link">404</Link>
        <Link to="/500" className="nav-link">500</Link>
        <a href="#ru" onClick={e => this.changeLang(e, 'ru')} className="nav-link">ru</a>
        <a href="#en" onClick={e => this.changeLang(e, 'en')} className="nav-link">en</a>
      </ul>
    )
  }
}

// @flow
import React from 'react'
import { Link } from 'react-router-dom'
import { translate } from 'react-i18next'
import type { Translator } from 'react-i18next'
import { PropTypes } from 'prop-types'

import i18nClient from 'libs/i18nClient'
import routes from 'components/App/routes'

import './Menu.scss'

type Props = { active?: string, i18n: Translator }

@translate()
export default class Menu extends React.Component<Props> {
  static defaultProps = {
    active: undefined,
    i18n: i18nClient,
  }

  static propTypes = {
    i18n: PropTypes.object,
    active: PropTypes.string,
  }

  get menu(): Array<Array<string>> {
    return [['movie', this.props.i18n.t('menu.movies')], ['person', this.props.i18n.t('menu.persons')]]
  }

  getClass(type: string) {
    const classes = ['nav-link']
    if (type === this.props.active) {
      classes.push('active')
    }
    return classes.join(' ')
  }

  renderMenu(): Array<React.Fragment> {
    return this.menu.map(([type, title]) => (
      <li className="nav-item" key={type}>
        <Link to={routes[type].list} className={this.getClass(type)}>
          {title}
        </Link>
      </li>
    ))
  }

  render() {
    return <ul className="nav nav-tabs">{this.renderMenu()}</ul>
  }
}

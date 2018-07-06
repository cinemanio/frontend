// @flow
import React from 'react'
import { Link } from 'react-router-dom'
import { PropTypes } from 'prop-types'

import routes from 'components/App/routes'

import './Menu.scss'

type Props = { active?: string }

export default class Menu extends React.Component<Props> {
  static defaultProps = {
    active: undefined
  }

  static propTypes = {
    active: PropTypes.string,
  }

  static contextTypes = {
    i18n: PropTypes.object.isRequired,
  }

  get menu(): Array<Array<string>> {
    return [
      ['movie', this.context.i18n.t('menu.movies')],
      ['person', this.context.i18n.t('menu.persons')]
    ]
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
        <Link to={routes[type].list} className={this.getClass(type)}>{title}</Link>
      </li>
    ))
  }

  render() {
    return (
      <ul className="nav nav-tabs">
        {this.renderMenu()}
      </ul>
    )
  }
}

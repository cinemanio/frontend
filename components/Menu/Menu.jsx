// @flow
import React from 'react'
import { Link } from 'react-router-dom'
import { formatRoute } from 'react-router-named-routes'
import { PropTypes } from 'prop-types'

import routes from 'components/App/routes'

import './Menu.scss'

type Props = { active?: string }

export default class Menu extends React.PureComponent<Props> {
  static defaultProps = {
    active: undefined
  }

  static propTypes = {
    active: PropTypes.string
  }

  menu = [
    ['movie', 'Movies'],
    ['person', 'Persons']
  ]

  getClass(type: string) {
    const classes = ['nav-link']
    if (type === this.props.active) {
      classes.push('active')
    }
    return classes.join(' ')
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
      </ul>
    )
  }
}

// @flow
import React from 'react'
import { Link } from 'react-router-named-routes'
import { PropTypes } from 'prop-types'

import './Menu.scss'

type Props = { active: string }

export default class Menu extends React.PureComponent<Props> {
  static defaultProps = {
    active: ''
  }

  static propTypes = {
    active: PropTypes.string
    // link: PropTypes.bool
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
        <Link to={`${type}.list`} className={this.getClass(type)}>{title}</Link>
      </li>
    ))
  }

  render() {
    return (
      <ul className="nav nav-tabs">
        {this.renderMenu()}
        <Link to="person.detail" className="nav-link" params={{ slug: '404' }}>404</Link>
        <Link to="/500" className="nav-link">500</Link>
      </ul>
    )
  }
}

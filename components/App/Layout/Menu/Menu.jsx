// @flow
import * as React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { translate } from 'react-i18next'
import type { Translator } from 'react-i18next'
import { PropTypes } from 'prop-types'
import { Tabs } from 'antd'

import i18nClient from 'libs/i18nClient'
import routes from 'components/App/routes'

import './Menu.scss'

type Props = { active?: string, i18n: Translator, history: Object }

@withRouter
@translate()
export default class Menu extends React.PureComponent<Props> {
  static defaultProps = {
    active: undefined,
    i18n: i18nClient,
    history: {},
  }

  static propTypes = {
    i18n: PropTypes.object,
    active: PropTypes.string,
    history: PropTypes.object,
  }

  get menu(): Array<Array<string>> {
    return [
      [routes.movie.list, this.props.i18n.t('menu.movies')],
      [routes.person.list, this.props.i18n.t('menu.persons')],
    ]
  }

  navigate = (route: string) => {
    this.props.history.push(route)
  }

  renderMenu(): React.Node {
    return this.menu.map(([route, title]) => <Tabs.TabPane tab={<Link to={route}>{title}</Link>} key={route} />)
  }

  render() {
    return (
      <Tabs activeKey={this.props.active} type="card" onTabClick={this.navigate}>
        {this.renderMenu()}
      </Tabs>
    )
  }
}

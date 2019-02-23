// @flow
import * as React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { withTranslation } from 'react-i18next'
import type { Translator } from 'react-i18next'
import { PropTypes } from 'prop-types'
import { Tabs } from 'antd'

import i18nClient from 'libs/i18nClient'
import routes from 'components/App/routes'

import './Menu.scss'

type Props = { active?: string, i18n: Translator, history: Object }

@withRouter
@withTranslation()
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
    return [['movie', this.props.i18n.t('menu.movies')], ['person', this.props.i18n.t('menu.persons')]]
  }

  navigate = (key: string) => {
    this.props.history.push(routes[key].list)
  }

  renderMenu(): React.Node {
    return this.menu.map(([type, title]) => (
      <Tabs.TabPane tab={<Link to={routes[type].list}>{title}</Link>} key={type} />
    ))
  }

  render() {
    return (
      <Tabs activeKey={this.props.active} type="card" onTabClick={this.navigate}>
        {this.renderMenu()}
      </Tabs>
    )
  }
}

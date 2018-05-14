// @flow
import React from 'react'
import RedBox from 'redbox-react'
import { Route, Link } from 'react-router-dom'
import { PropTypes } from 'prop-types'
import { translate } from 'react-i18next'

import Menu from 'components/Menu/Menu'

import './Layout.scss'
import Languages from './Languages/Languages'

type Props = { component: Function, menuActive?: string, t?: Function, i18n?: Object }
type State = { error: ?Error }

@translate()
export default class Layout extends React.Component<Props, State> {
  static defaultProps = {
    menuActive: undefined
  }

  static propTypes = {
    component: PropTypes.func.isRequired,
    menuActive: PropTypes.string,
    t: PropTypes.func.isRequired,
    i18n: PropTypes.object.isRequired
  }

  constructor(props: Object) {
    super(props)
    this.state = { error: null }
  }

  componentDidCatch(error: Error) {
    this.setState({ error })
  }

  renderMenu(menuActive?: string) {
    // fix flow issue, prop t comes from translate decorator
    return this.props.t ? <Menu active={menuActive} t={this.props.t}/> : '';
  }

  render() {
    const { component: Component, menuActive, ...rest } = this.props
    return (
      <Route {...rest} render={matchProps => (
        <div className="container" styleName="box">
          <header><Link to="/">cineman.io</Link></header>
          <div styleName="container">
            {this.renderMenu(menuActive)}
            {this.state.error
              ? <RedBox error={this.state.error}/>
              : <Component {...matchProps} t={this.props.t} i18n={this.props.i18n}/>}
          </div>
          <footer>
            <div styleName="languages">
              {this.props.i18n ? <Languages i18n={this.props.i18n}/> : ''}
            </div>
          </footer>
        </div>
      )}/>
    )
  }
}

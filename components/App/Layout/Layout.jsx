// @flow
import React from 'react'
import RedBox from 'redbox-react'
import { Route, Link } from 'react-router-dom'
import { PropTypes } from 'prop-types'
import { Row } from 'antd'

import './Layout.scss'
import Languages from './Languages/Languages'
import Auth from './Auth/Auth'
import Menu from './Menu/Menu'
import Search from './Search/Search'

export type Props = { component: Function, menuActive?: string }
type State = { error: ?Error }

export default class Layout extends React.Component<Props, State> {
  static defaultProps = {
    menuActive: undefined,
  }

  static propTypes = {
    component: PropTypes.func.isRequired,
    menuActive: PropTypes.string,
  }

  state = { error: null }

  componentDidCatch(error: Error) {
    this.setState({ error })
  }

  render() {
    const { component: Component, menuActive, ...rest } = this.props
    return (
      <Route
        {...rest}
        render={matchProps => (
          <Row type="flex" justify="center">
            {/* if use Col component here, SSR fails for some reason */}
            <div className="ant-col-14" styleName="box">
              <header>
                <div className="ant-col-6" styleName="logo">
                  <Link to="/">cineman.io</Link>
                </div>
                <div className="ant-col-12" styleName="search" />
                <div className="ant-col-6" styleName="auth">
                  <Auth />
                </div>
              </header>
              <main>
                <Menu active={menuActive} />
                <div styleName="content">
                  {this.state.error ? <RedBox error={this.state.error} /> : <Component {...matchProps} />}
                </div>
              </main>
              <footer>
                <div styleName="languages">
                  <Languages />
                </div>
              </footer>
            </div>
          </Row>
        )}
      />
    )
  }
}

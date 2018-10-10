// @flow
import React from 'react'
import RedBox from 'redbox-react'
import { Route, Link } from 'react-router-dom'
import { PropTypes } from 'prop-types'

import './Layout.scss'
import Languages from './Languages/Languages'
import Auth from './Auth/Auth'
import Menu from './Menu/Menu'
import Search from './Search/Search'

type Props = { component: Function, menuActive?: string }
type State = { error: ?Error }

export default class Layout extends React.Component<Props, State> {
  static defaultProps = {
    menuActive: undefined,
  }

  static propTypes = {
    component: PropTypes.func.isRequired,
    menuActive: PropTypes.string,
  }

  constructor(props: Object) {
    super(props)
    this.state = { error: null }
  }

  componentDidCatch(error: Error) {
    this.setState({ error })
  }

  render() {
    const { component: Component, menuActive, ...rest } = this.props
    return (
      <Route
        {...rest}
        render={matchProps => (
          <div className="container" styleName="box">
            <header>
              <Link to="/">cineman.io</Link>
              <div styleName="search">
                <Search />
              </div>
              <div styleName="auth">
                <Auth />
              </div>
            </header>
            <div styleName="container">
              <Menu active={menuActive} />
              {this.state.error ? <RedBox error={this.state.error} /> : <Component {...matchProps} />}
            </div>
            <footer>
              <div styleName="languages">
                <Languages />
              </div>
            </footer>
          </div>
        )}
      />
    )
  }
}

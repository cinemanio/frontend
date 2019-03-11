// @flow
import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Helmet from 'react-helmet'
import PropTypes from 'prop-types'
import { Provider as MobxProvider } from 'mobx-react'
import { Provider as AlertProvider } from 'react-alert'

import SignIn from 'components/SignIn/SignIn'
import SignUp from 'components/SignUp/SignUp'
import Settings from 'components/Settings/Settings'
import PasswordForgot from 'components/PasswordForgot/PasswordForgot'
import PasswordReset from 'components/PasswordReset/PasswordReset'
import PasswordChange from 'components/PasswordChange/PasswordChange'
import MoviesPage from 'components/MoviesPage/MoviesPage'
import MoviePage from 'components/MoviePage/MoviePage'
import PersonsPage from 'components/PersonsPage/PersonsPage'
import PersonPage from 'components/PersonPage/PersonPage'
import Error404 from 'components/errors/Error404'
import token from 'stores/Token'
import user from 'stores/User'

import routes from './routes'
import AlertTemplate from './AlertTemplate/AlertTemplate'
import Layout from './Layout/Layout'
import LayoutAuth from './LayoutAuth/LayoutAuth'

export const stores = { token, user }

export const alertOptions = {
  position: 'top center',
  timeout: 5000,
}

const Error500 = () => {
  throw Error()
}

const App = ({ lang }: Object) => (
  <MobxProvider {...stores}>
    <AlertProvider template={AlertTemplate} {...alertOptions}>
      <div>
        <Helmet htmlAttributes={{ lang }} defaultTitle="cineman.io" titleTemplate="%s · cineman.io" />
        <Switch>
          <Route exact path="/" render={() => <Redirect to={routes.movie.list} />} />
          <Layout path={routes.movie.detail} component={MoviePage} menuActive={routes.movie.list} />
          <Layout path={routes.movie.list} component={MoviesPage} menuActive={routes.movie.list} />
          <Layout path={routes.person.detail} component={PersonPage} menuActive={routes.person.list} />
          <Layout path={routes.person.list} component={PersonsPage} menuActive={routes.person.list} />
          <Layout path={routes.signin} component={SignIn} />
          <Layout path={routes.signup} component={SignUp} />
          <Layout path={routes.password.forgot} component={PasswordForgot} />
          <Layout path={routes.password.reset} component={PasswordReset} />
          <LayoutAuth path={routes.password.change} component={PasswordChange} />
          <LayoutAuth path={routes.settings} component={Settings} />
          <Layout path="/500" component={Error500} />
          <Layout path="*" component={Error404} />
        </Switch>
      </div>
    </AlertProvider>
  </MobxProvider>
)

App.propTypes = {
  lang: PropTypes.string.isRequired,
}

export default App

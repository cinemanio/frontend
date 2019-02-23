// @flow
import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Helmet from 'react-helmet'
import PropTypes from 'prop-types'
import { Provider as MobxProvider } from 'mobx-react'
import { Provider as AlertProvider } from 'react-alert'

import Layout from 'components/Layout/Layout'
import SignIn from 'components/SignIn/SignIn'
import SignUp from 'components/SignUp/SignUp'
import MoviesPage from 'components/MoviesPage/MoviesPage'
import MoviePage from 'components/MoviePage/MoviePage'
import PersonsPage from 'components/PersonsPage/PersonsPage'
import PersonPage from 'components/PersonPage/PersonPage'
import Error404 from 'components/errors/Error404'

import routes from './routes'
import stores from './stores'
import alertOptions from './alertOptions'
import AlertTemplate from './AlertTemplate/AlertTemplate'

const Error500 = () => {
  throw Error()
}

const App = ({ lang }: Object) => (
  <MobxProvider {...stores}>
    <AlertProvider template={AlertTemplate} {...alertOptions}>
      <div>
        <Helmet htmlAttributes={{ lang }} defaultTitle="cineman.io" titleTemplate="%s · cineman.io" />
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/movies" />} />
          <Layout path={routes.movie.detail} component={MoviePage} menuActive="movie" />
          <Layout path={routes.movie.list} component={MoviesPage} menuActive="movie" />
          <Layout path={routes.person.detail} component={PersonPage} menuActive="person" />
          <Layout path={routes.person.list} component={PersonsPage} menuActive="person" />
          <Layout path={routes.signin} component={SignIn} />
          <Layout path={routes.signup} component={SignUp} />
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

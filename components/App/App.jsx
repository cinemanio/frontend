// @flow
import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Helmet from 'react-helmet'

import Layout from 'components/Layout/Layout'
import MoviesPage from 'components/MoviesPage/MoviesPage'
import MoviePage from 'components/MoviePage/MoviePage'
import PersonsPage from 'components/PersonsPage/PersonsPage'
import PersonPage from 'components/PersonPage/PersonPage'
import Error404 from 'components/errors/Error404'

import routes from './routes'

const Error500 = () => {
  throw Error()
}

const App = () => (
  <div>
    <Helmet htmlAttributes={{ lang: 'en' }} defaultTitle="cineman.io">
      <script type="text/javascript" src="/public/app.js" async crossOrigin/>
      <link rel="stylesheet" type="text/css" href="/public/app.css"/>
      <link rel="icon" type="image/ico" href="/public/favicon.ico"/>
    </Helmet>
    <Switch>
      <Route exact path="/" render={() => <Redirect to="/movies"/>}/>
      <Layout path={routes.movie.detail} component={MoviePage} menuActive="movie"/>
      <Layout path={routes.movie.list} component={MoviesPage} menuActive="movie"/>
      <Layout path={routes.person.detail} component={PersonPage} menuActive="person"/>
      <Layout path={routes.person.list} component={PersonsPage} menuActive="person"/>
      <Layout path="/500" component={Error500}/>
      <Layout path="*" component={Error404}/>
    </Switch>
  </div>
)

export default App

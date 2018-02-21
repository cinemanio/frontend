// @flow
// TODO: move this file to somewhere
import React from 'react'
import { IndexRedirect, Route } from 'react-router'
import { NamedURLResolver } from 'react-router-named-routes'

import Layout from './components/Layout/Layout'
import MoviesPage from './components/MoviesPage/MoviesPage'
import MoviePage from './components/MoviePage/MoviePage'
import PersonsPage from './components/PersonsPage/PersonsPage'
import PersonPage from './components/PersonPage/PersonPage'
import Error500 from './components/errors/Error500'
import Error404 from './components/errors/Error404'

const routes = (
  <Route path="/" component={Layout}>
    <IndexRedirect name="index" to="/movies"/>
    <Route name="movie.list" path="movies" component={MoviesPage}/>
    <Route name="movie.detail" path="movies/:slug" component={MoviePage}/>
    <Route name="person.list" path="persons" component={PersonsPage}/>
    <Route name="person.detail" path="persons/:slug" component={PersonPage}/>
    <Route path="*" status={404} component={Error404}/>
  </Route>
)

NamedURLResolver.mergeRouteTree(routes, '/')

export default routes

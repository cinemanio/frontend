// @flow
import React from 'react'
import { IndexRedirect, Route } from 'react-router'

import Layout from './components/Layout/Layout'
import MoviesPage from './components/MoviesPage/MoviesPage'
import MoviePage from './components/MoviePage/MoviePage'
import Error500 from './components/pages/Error500'
import Error404 from './components/pages/Error404'


export default (
  <Route path="/" component={Layout}>
    <IndexRedirect to="/movies"/>

    <Route path="movies" component={MoviesPage}/>
    <Route path="movies/:movieId" component={MoviePage}/>

    <Route path="*" status={404} component={Error404}/>
  </Route>
)

export const Error500Page = (
  <Layout>
    <Error500/>
  </Layout>
)

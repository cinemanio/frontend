import _ from 'lodash'

import MoviesPage from './MoviesPage'
import response from './fixtures/response.json'
import countries from './fixtures/countries.json'
import genres from './fixtures/genres.json'

export const mockMovies = {
  request: { query: MoviesPage.queries.movies, variables: MoviesPage.variables.movies },
  result: response,
}
export const mockCountries = { request: { query: MoviesPage.queries.countries }, result: countries }
export const mockGenres = { request: { query: MoviesPage.queries.genres }, result: genres }
export const mockWithParams = params => ({
  ...mockMovies,
  request: {
    ...mockMovies.request,
    variables: {
      ...mockMovies.request.variables,
      ...params,
    },
  },
})

export const sliceResult = (mock, limit) => {
  const newMock = _.cloneDeep(mock)
  newMock.result.data.list.edges = newMock.result.data.list.edges.slice(0, limit)
  return newMock
}

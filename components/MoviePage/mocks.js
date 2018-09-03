// @flow
import _ from 'lodash'

import MoviePage from './MoviePage'
import response from './fixtures/response.json'

export const getMockMovie = (movieId: string) => {
  const newResponse = _.cloneDeep(response)
  newResponse.data.movie.id = movieId
  return {
    request: { query: MoviePage.queries.movie, variables: { movieId } },
    result: newResponse,
  }
}

export const mockMovie = getMockMovie(response.data.movie.id)

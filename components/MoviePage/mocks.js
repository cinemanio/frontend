// @flow
import MoviePage from './MoviePage'
import response from './fixtures/response.json'

export const getMockMovie = (movieId: string) => ({
  request: { query: MoviePage.queries.movie, variables: { movieId } },
  result: response,
})

export const mockMovie = getMockMovie(response.data.movie.id)

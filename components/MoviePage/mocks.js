import MoviePage from './MoviePage'

import response from './fixtures/response.json'

export const mockMovie = {
  request: { query: MoviePage.queries.movie, variables: { movieId: response.data.movie.id } },
  result: response,
}

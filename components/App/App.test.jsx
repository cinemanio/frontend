import React from 'react'
import { ApolloConsumer } from 'react-apollo'
import Loader from 'react-loader'

import { mountGraphql, mockAutoSizer } from 'tests/helpers'
import i18nClient from 'libs/i18nClient'
import Auth from 'stores/Auth'
import Token from 'stores/Token'
import routes from 'components/App/routes'
import { mockMovies, mockGenres, mockCountries } from 'components/MoviesPage/mocks'
import { mockMovie, getMockMovie } from 'components/MoviePage/mocks'
import { getMockPerson } from 'components/PersonPage/mocks'
import { mockSignIn, signIn } from 'components/SignIn/mocks'
import { mockAuthToken } from 'components/Layout/Auth/mocks'
import moviesResponse from 'components/MoviesPage/fixtures/response.json'

import App from './App'

describe('App Component', () => {
  const element = <App lang="en"/>
  let wrapper

  beforeAll(mockAutoSizer)

  describe('GraphQL', () => {
    beforeEach(() => {
      i18nClient.changeLanguage('en')
      global.console.warn = jest.fn()
      Auth.reset()
      Token.set()
    })

    it('should navigate from movies to movie page, then to person page', async () => {
      const mockFirstMovie = getMockMovie(moviesResponse.data.list.edges[0].movie.id)
      // mockFirstMovie.request.variables.movieId = moviesResponse.data.list.edges[0].movie.id
      // mockFirstMovie.result.data.movie.id = moviesResponse.data.list.edges[0].movie.id
      wrapper = await mountGraphql(element, [mockMovies, mockCountries, mockGenres, mockFirstMovie],
        [routes.movie.list])
      expect(wrapper.find('MoviesPage')).toHaveLength(1)
      wrapper.find('MovieLink').find('a').first().simulate('click', { button: 0 })
      expect(wrapper.find('MoviePage')).toHaveLength(1)
      // TODO: fix rendering movie content
      // console.log(wrapper.debug())
      // wrapper.find('PersonLink').find('a').first().simulate('click', { button: 0 })
      // expect(wrapper.find('PersonPage')).toHaveLength(1)
    })

    it('should navigate from movie page to person page and back to movie', async () => {
      const mockMoviePerson = getMockPerson('UGVyc29uTm9kZTozMTMy')
      wrapper = await mountGraphql(element, [mockMovie, mockMoviePerson],
        [routes.movie.getDetail(mockMovie.result.data.movie.id)])
      expect(wrapper.find('MoviePage')).toHaveLength(1)
      wrapper.find('PersonLink').find('a').first().simulate('click', { button: 0 })
      expect(wrapper.find('PersonPage')).toHaveLength(1)
      // TODO: fix rendering person content
      // wrapper.find('MovieLink').find('a').first().simulate('click', { button: 0 })
    })

    it('should render default page, sign in, show loader, redirect back and check signed username', async (done) => {
      const element1 = (
        <ApolloConsumer>
          {(client) => {
            // eslint-disable-next-line no-param-reassign
            client.resetStore = jest.fn()
            return element
          }}
        </ApolloConsumer>
      )
      wrapper = await mountGraphql(element1, [mockSignIn, mockMovies, mockCountries, mockGenres, mockAuthToken])
      expect(wrapper.find('Auth').find('a').text()).toContain('sign in')
      expect(wrapper.find('SignIn')).toHaveLength(0)
      wrapper.find('Auth').find('a').simulate('click', { button: 0 })
      expect(wrapper.find('SignIn')).toHaveLength(1)
      expect(wrapper.find(Loader)).toHaveLength(0)
      signIn(wrapper)
      expect(wrapper.find(Loader)).toHaveLength(1)
      setTimeout(() => {
        wrapper.update()
        expect(wrapper.find('SignIn')).toHaveLength(0)
        expect(wrapper.find(Loader)).toHaveLength(0)
        setTimeout(() => {
          wrapper.update()
          expect(wrapper.find('Auth').find('a').text()).toContain('logout')
          done()
        }, 10)
      }, 10)
    })
  })
})

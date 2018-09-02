import React from 'react'
import { ApolloConsumer } from 'react-apollo'
import _ from 'lodash'

import { mountGraphql, mockAutoSizer } from 'tests/helpers'
import i18nClient from 'libs/i18nClient'
import Auth from 'stores/Auth'
import Token from 'stores/Token'
import { mockMovies, mockGenres, mockCountries } from 'components/MoviesPage/mocks'
import { mockMovie } from 'components/MoviePage/mocks'
import { mockSignIn, signIn } from 'components/SignIn/mocks'
import { mockAuthToken } from 'components/Layout/Auth/mocks'
import moviesResponse from 'components/MoviesPage/fixtures/response.json'

import App from './App'

describe('App Component', () => {
  const element = <App lang="en"/>
  let wrapper
  // const username = 'username'
  // const password = 'password'
  // const mock = {
  //   request: { query: App.fragments.signin, variables: { username, password } },
  //   result: response,
  // }
  // const setUsername = value => wrapper.find('input[type="text"]').props().onChange({ currentTarget: { value } })
  // const setPassword = value => wrapper.find('input[type="password"]').props().onChange({ currentTarget: { value } })

  beforeAll(mockAutoSizer)

  describe('GraphQL', () => {
    beforeEach(() => {
      i18nClient.changeLanguage('en')
      global.console.warn = jest.fn()
      Auth.reset()
      Token.set()
    })

    it('should render movies page by default', async () => {
      wrapper = await mountGraphql(element)
      expect(wrapper.find('MoviesPage')).toHaveLength(1)
    })

    it('should navigate from movies to movie page, then to person page', async () => {
      const mockFirstMovie = _.clone(mockMovie)
      mockFirstMovie.request.variables.movieId = moviesResponse.data.list.edges[0].movie.id
      mockFirstMovie.result.data.movie.id = moviesResponse.data.list.edges[0].movie.id
      wrapper = await mountGraphql(element, [mockMovies, mockCountries, mockGenres, mockFirstMovie])
      expect(wrapper.find('MoviesPage')).toHaveLength(1)
      wrapper.find('MovieLink').find('a').first().simulate('click', { button: 0 })
      expect(wrapper.find('MoviePage')).toHaveLength(1)
      // TODO: fix rendering movie content
      // console.log(wrapper.debug())
      // wrapper.find('PersonLink').find('a').first().simulate('click', { button: 0 })
      // expect(wrapper.find('PersonPage')).toHaveLength(1)
    })

    it('should render default page, sign in and check signed username', async (done) => {
      const element1 = (<ApolloConsumer>
        {(client) => {
          // eslint-disable-next-line no-param-reassign
          client.resetStore = jest.fn()
          return element
        }}
      </ApolloConsumer>)
      wrapper = await mountGraphql(element1, [mockSignIn, mockMovies, mockCountries, mockGenres, mockAuthToken])
      expect(wrapper.find('Auth').find('a').text()).toContain('sign in')
      expect(wrapper.find('SignIn')).toHaveLength(0)
      wrapper.find('Auth').find('a').simulate('click', { button: 0 })
      expect(wrapper.find('SignIn')).toHaveLength(1)
      signIn(wrapper)
      setTimeout(() => {
        wrapper.update()
        expect(wrapper.find('SignIn')).toHaveLength(0)
        setTimeout(() => {
          wrapper.update()
          expect(wrapper.find('Auth').find('a').text()).toContain('john_lennon')
          done()
        }, 10)
      }, 10)
    })
  })
})

import React from 'react'
import { ApolloConsumer } from 'react-apollo'

import { mountGraphql, mockAutoSizer } from 'tests/helpers'
import i18nClient from 'libs/i18nClient'
import Token from 'stores/Token'
import User from 'stores/User'
import routes from 'components/App/routes'
import { mockMovies, mockGenres, mockCountries } from 'components/MoviesPage/mocks'
import { mockMovie, getMockMovie } from 'components/MoviePage/mocks'
import { getMockPerson } from 'components/PersonPage/mocks'
import { mockAuthToken } from 'components/App/Layout/Auth/mocks'
import signin from 'components/SignIn/mocks'
import signup from 'components/SignUp/mocks'
import moviesResponse from 'components/MoviesPage/fixtures/response.json'

import App from './App'

const {
  mocks: [mockSignIn],
  submit: signIn,
} = signin
const {
  mocks: [mockSignUp],
  submit: signUp,
} = signup

describe('App Component', () => {
  const element = <App lang="en" />
  const elementApollo = (
    <ApolloConsumer>
      {client => {
        // eslint-disable-next-line no-param-reassign
        client.resetStore = jest.fn()
        return element
      }}
    </ApolloConsumer>
  )
  let wrapper

  beforeAll(mockAutoSizer)

  describe('GraphQL', () => {
    const getAuthLink = () =>
      wrapper
        .find('Auth')
        .find('a')
        .last()

    beforeEach(() => {
      i18nClient.changeLanguage('en')
      global.console.warn = jest.fn()
      Token.set()
      User.logout()
    })

    it('should navigate from movies to movie page, then to person page', async () => {
      const mockFirstMovie = getMockMovie(moviesResponse.data.list.edges[0].movie.id)
      // mockFirstMovie.request.variables.movieId = moviesResponse.data.list.edges[0].movie.id
      // mockFirstMovie.result.data.movie.id = moviesResponse.data.list.edges[0].movie.id
      wrapper = await mountGraphql(element, [mockMovies, mockCountries, mockGenres, mockFirstMovie], [routes.movie.list])
      expect(wrapper.find('MoviesPage')).toHaveLength(1)
      wrapper
        .find('MovieLink')
        .find('a')
        .first()
        .simulate('click', { button: 0 })
      expect(wrapper.find('MoviePage')).toHaveLength(1)
      // TODO: fix rendering movie content
      // console.log(wrapper.debug())
      // wrapper.find('PersonLink').find('a').first().simulate('click', { button: 0 })
      // expect(wrapper.find('PersonPage')).toHaveLength(1)
    })

    it('should navigate from movie page to person page and back to movie', async () => {
      const mockMoviePerson = getMockPerson('UGVyc29uTm9kZTozMTMy')
      wrapper = await mountGraphql(
        element,
        [mockMovie, mockMoviePerson],
        [routes.movie.getDetail(mockMovie.result.data.movie.id)]
      )
      expect(wrapper.find('MoviePage')).toHaveLength(1)
      wrapper
        .find('PersonLink')
        .find('a')
        .first()
        .simulate('click', { button: 0 })
      expect(wrapper.find('PersonPage')).toHaveLength(1)
      // TODO: fix rendering person content
      // wrapper.find('MovieLink').find('a').first().simulate('click', { button: 0 })
    })

    it('should render default page, go to sign in and all menu items should not be active', async () => {
      wrapper = await mountGraphql(element, [mockSignIn, mockMovies, mockCountries, mockGenres, mockAuthToken])
      expect(getAuthLink().text()).toContain('sign in')
      expect(wrapper.find('SignIn')).toHaveLength(0)
      expect(wrapper.find('Tabs').find('div[role="tab"][aria-selected="true"]')).toHaveLength(1)
      getAuthLink().simulate('click', { button: 0 })
      expect(wrapper.find('SignIn')).toHaveLength(1)
      expect(wrapper.find('Tabs').find('div[role="tab"][aria-selected="true"]')).toHaveLength(0)
    })

    it('should render default page, sign in, redirect back and check user signed', async done => {
      wrapper = await mountGraphql(elementApollo, [mockSignIn, mockMovies, mockCountries, mockGenres, mockAuthToken])
      expect(getAuthLink().text()).toContain('sign in')
      expect(wrapper.find('SignIn')).toHaveLength(0)
      getAuthLink().simulate('click', { button: 0 })
      expect(wrapper.find('SignIn')).toHaveLength(1)
      signIn(wrapper)
      setTimeout(() => {
        wrapper.update()
        expect(wrapper.find('MoviesPage')).toHaveLength(1)
        setTimeout(() => {
          wrapper.update()
          expect(getAuthLink().text()).toContain('logout')
          done()
        })
      })
    })

    it('should render default page, sign in, sign up and display message', async () => {
      wrapper = await mountGraphql(elementApollo, [mockSignUp])
      expect(getAuthLink().text()).toContain('sign in')
      expect(wrapper.find('SignIn')).toHaveLength(0)
      getAuthLink().simulate('click', { button: 0 })
      expect(wrapper.find('SignIn')).toHaveLength(1)
      wrapper
        .find('SignIn')
        .find('a')
        .first()
        .simulate('click', { button: 0 })
      expect(wrapper.find('SignUp')).toHaveLength(1)
      signUp(wrapper)
      setTimeout(() => {
        wrapper.update()
        expect(wrapper.text()).toContain('We sent message')
      })
    })
  })
})

import React from 'react'
import Helmet from 'react-helmet'

import { mountGraphql } from 'tests/helpers'
import i18nClient from 'libs/i18nClient'
import Auth from 'stores/Auth'
import Token from 'stores/Token'

import SignIn from './SignIn'
import { mockSignIn, setUsername, setPassword, signIn } from './mocks'
import response from './fixtures/response.json'
import invalidCredentials from './fixtures/invalid_credentials.json'

describe('SignIn Component', () => {
  const element = <SignIn />
  let wrapper

  describe('Unit', () => {
    beforeEach(async () => {
      wrapper = await mountGraphql(element)
    })

    describe('i18n. en', () => {
      beforeAll(() => i18nClient.changeLanguage('en'))

      it('should render button name', () => expect(wrapper.find('button').text()).toBe('Sign in'))
      it('should render page title', () => expect(Helmet.peek().title).toBe('Sign In'))
    })

    describe('i18n. ru', () => {
      beforeAll(() => i18nClient.changeLanguage('ru'))

      it('should render button name', () => expect(wrapper.find('button').text()).toBe('Войти'))
      it('should render page title', () => expect(Helmet.peek().title).toBe('Войти'))
    })

    // it('should change language on the fly', async () => {
    //   i18nClient.changeLanguage('en')
    //   wrapper = await mountGraphql(element)
    //   expect(wrapper.find('button').text()).toBe('Sign in')
    //   i18nClient.changeLanguage('ru')
    //   console.log(wrapper.text())
    //   wrapper.update()
    //   console.log(wrapper.text())
    //   expect(wrapper.find('button').text()).toBe('Войти')
    // })
  })

  describe('GraphQL', () => {
    beforeEach(() => {
      i18nClient.changeLanguage('en')
      global.console.warn = jest.fn()
      Auth.reset()
      Token.set()
    })

    it('should render signin page, fill form and enable button', async () => {
      wrapper = await mountGraphql(element, [mockSignIn])
      const auth = wrapper.find('SignIn').prop('auth').values

      expect(wrapper.find('button').prop('disabled')).toBe(true)

      expect(auth.username).toBe('')
      setUsername(wrapper, 'username')
      expect(auth.username).toBe('username')

      expect(auth.password).toBe('')
      setPassword(wrapper, 'password')
      expect(auth.password).toBe('password')

      // expect(wrapper.find('button').prop('disabled')).toBe(false)
    })

    it('should submit form with mutation and populate token store', async done => {
      wrapper = await mountGraphql(element, [mockSignIn])
      setUsername(wrapper)
      setPassword(wrapper)

      expect(wrapper.find('SignIn').prop('token').token).toBeUndefined()

      wrapper.find('form').simulate('submit')

      setTimeout(() => {
        expect(wrapper.find('SignIn').prop('token').token).toBe(response.data.tokenAuth.token)
        done()
      })
    })

    xit('should clear apollo cache after successful signin', async done => {
      const client = { resetStore: jest.fn() }
      wrapper = await mountGraphql(element, [mockSignIn])

      setUsername(wrapper)
      setPassword(wrapper)

      expect(client.resetStore).not.toHaveBeenCalled()
      wrapper.find('form').simulate('submit')

      setTimeout(() => {
        expect(client.resetStore).toHaveBeenCalled()
        done()
      })
    })

    it('should render display error when mutation failed', async done => {
      wrapper = await mountGraphql(element, [
        {
          ...mockSignIn,
          result: invalidCredentials,
        },
      ])
      signIn(wrapper)
      setTimeout(() => {
        expect(wrapper.text()).toContain('Please, enter valid credentials')
        done()
      }, 10)
    })
  })
})

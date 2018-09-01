import React from 'react'
import Helmet from 'react-helmet'

import { mountGraphql } from 'tests/helpers'
import i18nClient from 'libs/i18nClient'
import Auth from 'stores/Auth'
import Token from 'stores/Token'

import SignIn from './SignIn'
import response from './fixtures/response.json'
import invalidCredentials from './fixtures/invalid_credentials.json'

describe('SignIn Component', () => {
  const element = <SignIn/>
  let wrapper
  const username = 'username'
  const password = 'password'
  const mock = {
    request: { query: SignIn.fragments.signin, variables: { username, password } },
    result: response,
  }
  const setUsername = value => wrapper.find('input[type="text"]').props().onChange({ currentTarget: { value } })
  const setPassword = value => wrapper.find('input[type="password"]').props().onChange({ currentTarget: { value } })

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
      wrapper = await mountGraphql(element, [mock])
      const signIn = wrapper.find('SignIn')

      expect(wrapper.find('button').prop('disabled')).toBe(true)

      expect(signIn.prop('auth').values.username).toBe('')
      setUsername(username)
      expect(signIn.prop('auth').values.username).toBe(username)

      expect(signIn.prop('auth').values.password).toBe('')
      setPassword(password)
      expect(signIn.prop('auth').values.password).toBe(password)

      // expect(wrapper.find('button').prop('disabled')).toBe(false)
    })

    it('should submit form with mutation and populate token store', async (done) => {
      wrapper = await mountGraphql(element, [mock])
      setUsername(username)
      setPassword(password)

      const signIn = wrapper.find('SignIn')
      expect(signIn.prop('token').token).toBeUndefined()

      wrapper.find('form').simulate('submit')

      setTimeout(() => {
        expect(signIn.prop('token').token).toBe(response.data.tokenAuth.token)
        done()
      })
    })

    it('should render display error when mutation failed', async (done) => {
      wrapper = await mountGraphql(element, [{
        ...mock,
        result: invalidCredentials,
      }])
      setUsername(username)
      setPassword(password)

      wrapper.find('form').simulate('submit')
      setTimeout(() => {
        expect(wrapper.text()).toContain('Please, enter valid credentials')
        done()
      })
    })
  })
})

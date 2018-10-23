import React from 'react'
import Helmet from 'react-helmet'

import { mountGraphql } from 'tests/helpers'
import i18nClient from 'libs/i18nClient'
import Token from 'stores/Token'

import SignUp from './SignUp'
import { mockSignUp, setUsername, setEmail, setPassword, setPasswordConfirm, signUp } from './mocks'
import response from './fixtures/response.json'
import invalidCredentials from './fixtures/invalid_credentials.json'

describe('SignUp Component', () => {
  const element = <SignUp />
  let wrapper
  const getField = name => {
    const form = wrapper.find('SignUpForm').prop('form')
    return form.getFieldsValue()[name]
  }

  describe('Unit', () => {
    beforeEach(async () => {
      wrapper = await mountGraphql(element)
    })

    describe('i18n. en', () => {
      beforeAll(() => i18nClient.changeLanguage('en'))

      it('should render button name', () => expect(wrapper.find('button').text()).toBe('Sign up'))
      it('should render page title', () => expect(Helmet.peek().title).toBe('Sign Up'))
    })

    describe('i18n. ru', () => {
      beforeAll(() => i18nClient.changeLanguage('ru'))

      it('should render button name', () => expect(wrapper.find('button').text()).toBe('Зарегистрироваться'))
      it('should render page title', () => expect(Helmet.peek().title).toBe('Зарегистрироваться'))
    })

    describe('Form input', () => {
      beforeAll(() => {
        global.console.warn = jest.fn()
        i18nClient.changeLanguage('en')
      })

      it('should render signup page and fill the form', () => {
        expect(getField('username')).toBe(undefined)
        setUsername(wrapper, 'username')
        expect(getField('username')).toBe('username')

        expect(getField('email')).toBe(undefined)
        setEmail(wrapper, 'email@gmail.com')
        expect(getField('email')).toBe('email@gmail.com')

        expect(getField('password')).toBe(undefined)
        setPassword(wrapper, 'password')
        expect(getField('password')).toBe('password')

        expect(getField('confirm')).toBe(undefined)
        setPasswordConfirm(wrapper, 'password')
        expect(getField('confirm')).toBe('password')
      })

      it('should render error of invalid email', () => {
        setEmail(wrapper, 'bad email')
        expect(wrapper.text()).toContain('not valid email')
      })

      it('should render error of not matched passwords', () => {
        setPassword(wrapper, 'password')
        setPasswordConfirm(wrapper, 'not a password')
        expect(wrapper.text()).toContain('are not match')
      })
    })
  })

  describe('GraphQL', () => {
    beforeEach(() => {
      i18nClient.changeLanguage('en')
      global.console.warn = jest.fn()
      Token.set()
    })

    it('should submit form with mutation and populate token store', async done => {
      wrapper = await mountGraphql(element, [mockSignUp])

      expect(wrapper.find('SignUp').prop('token').token).toBeUndefined()
      signUp(wrapper)

      setTimeout(() => {
        expect(wrapper.find('SignUp').prop('token').token).toBe(response.data.tokenAuth.token)
        done()
      })
    })

    xit('should clear apollo cache after successful signup', async done => {
      const client = { resetStore: jest.fn() }
      wrapper = await mountGraphql(element, [mockSignUp])

      expect(client.resetStore).not.toHaveBeenCalled()
      signUp(wrapper)

      setTimeout(() => {
        expect(client.resetStore).toHaveBeenCalled()
        done()
      })
    })

    it('should render display error when mutation failed, disable/enable button and keep username value', async done => {
      wrapper = await mountGraphql(element, [
        {
          ...mockSignUp,
          result: invalidCredentials,
        },
      ])
      expect(wrapper.find('Button').prop('disabled')).toBe(false)
      signUp(wrapper)
      expect(wrapper.find('Button').prop('disabled')).toBe(true)
      setTimeout(() => {
        wrapper.update()
        expect(wrapper.find('Button').prop('disabled')).toBe(false)
        expect(wrapper.text()).toContain('Please, enter valid credentials')
        expect(getField('username')).toBe('username')
        done()
      })
    })
  })
})

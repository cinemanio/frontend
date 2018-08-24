import React from 'react'
import { Provider } from 'mobx-react'

import { mountGraphql } from 'tests/helpers'
import i18nClient from 'libs/i18nClient'
import auth from 'stores/Auth'
import token from 'stores/Token'

import SignIn from './SignIn'
import response from './fixtures/response.json'

describe('SignIn Component', () => {
  let element
  let wrapper

  beforeAll(() => i18nClient.changeLanguage('en'))

  describe('GraphQL', () => {
    const username = 'username'
    const password = 'password'
    const mock = {
      request: { query: SignIn.fragments.signin, variables: { username, password } },
      result: response,
    }
    element = (
      <Provider auth={auth} token={token}>
        <SignIn/>
      </Provider>
    )

    it('should render signin page and submit form with mutation', async (done) => {
      global.console.warn = jest.fn()
      wrapper = await mountGraphql(element, [mock])

      expect(wrapper.find('button').prop('disabled')).toBe(true)

      wrapper.find('input[type="text"]').props().onChange({ currentTarget: { value: username } })
      expect(auth.values.username).toBe(username)
      wrapper.find('input[type="password"]').props().onChange({ currentTarget: { value: password } })
      expect(auth.values.password).toBe(password)

      // expect(wrapper.find('button').prop('disabled')).toBe(false)
      expect(token.token).toBeUndefined()

      wrapper.find('form').simulate('submit')

      setTimeout(() => {
        expect(token.token).toBe(response.data.tokenAuth.token)
        done()
      });
    })
  })
})

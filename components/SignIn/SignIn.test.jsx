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

    it('should render signin page and submit form', async () => {
      wrapper = await mountGraphql(element, [mock])

      expect(wrapper.find('button').prop('disabled')).toBe(true)

      wrapper.find('input[type="text"]').props().onChange({ target: { value: username } })
      expect(auth.values.username).toBe(username)
      wrapper.find('input[type="password"]').props().onChange({ target: { value: password } })
      expect(auth.values.password).toBe(password)

      // expect(wrapper.find('button').prop('disabled')).toBe(false)
      expect(token.token).toBeUndefined()

      wrapper.find('form').simulate('submit')

      // TODO: update doesn't get invoked without optimisticResponse
      // expect(token.token).toBe(response.data.tokenAuth.token)
    })
  })
})

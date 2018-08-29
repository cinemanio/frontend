import React from 'react'

import { mountGraphql } from 'tests/helpers'
import i18nClient from 'libs/i18nClient'
import user from 'stores/User'
import token from 'stores/Token'

import Auth from './Auth'
import responseAuth from './fixtures/responseAuth.json'
import responseNonAuth from './fixtures/responseNonAuth.json'

describe('Auth Component', () => {
  let element
  let wrapper

  beforeAll(() => i18nClient.changeLanguage('en'))

  describe('GraphQL', () => {
    element = <Auth/>

    beforeEach(() => {
      global.console.warn = jest.fn()
      user.logout()
    })

    it('should render username if verify successful', async () => {
      token.set('123')
      const mock = {
        request: { query: Auth.fragments.verify, variables: { token: '123' } },
        result: responseAuth,
      }
      wrapper = await mountGraphql(element, [mock])
      expect(wrapper.text()).toContain(responseAuth.data.verifyToken.payload.username)
    })

    it('should render signin if verify unsuccessful', async () => {
      token.set(undefined)
      const mock = {
        request: { query: Auth.fragments.verify, variables: {} },
        result: responseNonAuth,
      }
      wrapper = await mountGraphql(element, [mock])
      expect(wrapper.text()).toContain('signin')
    })
  })
})

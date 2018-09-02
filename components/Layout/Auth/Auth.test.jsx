import React from 'react'

import { mountGraphql } from 'tests/helpers'
import i18nClient from 'libs/i18nClient'
import user from 'stores/User'
import token from 'stores/Token'

import Auth from './Auth'
import { mockAuthToken, mockAuthNoToken } from './mocks'

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
      token.set(mockAuthToken.request.variables.token)
      wrapper = await mountGraphql(element, [mockAuthToken])
      expect(wrapper.text()).toContain(mockAuthToken.result.data.verifyToken.payload.username)
    })

    it('should render signin if verify unsuccessful', async () => {
      token.set(undefined)
      wrapper = await mountGraphql(element, [mockAuthNoToken])
      expect(wrapper.text()).toContain('sign in')
    })
  })
})

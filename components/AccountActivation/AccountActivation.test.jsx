import React from 'react'

import { mountGraphql } from 'tests/helpers'
import i18nClient from 'libs/i18nClient'
import Token from 'stores/Token'
import Layout from 'components/App/Layout/Layout'
import routes from 'components/App/routes'

import AccountActivation from './AccountActivation'
import mock from './mocks'
import response from './fixtures/response.json'
import invalidKey from './fixtures/invalid_key.json'

describe('AccountActivation Component', () => {
  // if render <AccountActivation />, this.props.match are empty and not get passed to apollo request
  const element = <Layout path={routes.activation} component={AccountActivation} />
  let wrapper
  const getToken = () => wrapper.find('AccountActivation').prop('token').token

  beforeEach(() => {
    i18nClient.changeLanguage('en')
    global.console.warn = jest.fn()
    Token.set(undefined)
  })

  it('should perform mutation and populate token and user stores', async () => {
    wrapper = await mountGraphql(element, [mock], [routes.getActivation(mock.request.variables.key)])
    expect(getToken()).toBe(response.data.activateUser.token)
    expect(wrapper.text()).toContain(response.data.activateUser.payload.username)
  })

  it('should perform mutation and display error in activation key is wrong', async () => {
    wrapper = await mountGraphql(
      element,
      [
        {
          ...mock,
          result: invalidKey,
        },
      ],
      [routes.getActivation(mock.request.variables.key)]
    )
    expect(getToken()).toBe(undefined)
    expect(wrapper.text()).not.toContain(response.data.activateUser.payload.username)
    expect(wrapper.text()).toContain(invalidKey.errors[0].message)
  })
})

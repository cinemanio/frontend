import React from 'react'

import { mountGraphql } from 'tests/helpers'
import i18nClient from 'libs/i18nClient'
import Token from 'stores/Token'
import routes from 'components/App/routes'
import Layout from 'components/App/Layout/Layout'

import PasswordReset from './PasswordReset'
import submitter, { varsRequest } from './mocks'
import response from './fixtures/response'

const { mocks, submit, itShould } = submitter

describe('PasswordReset Component', () => {
  let element = <PasswordReset />
  let wrapper

  beforeEach(() => {
    i18nClient.changeLanguage('en')
    global.console.warn = jest.fn()
    // hide "Error: No more mocked responses for the query" in submitFormAndDisableButton
    global.console.error = jest.fn()
    Token.set(undefined)
  })

  itShould.test(element)

  it('should submit form with mutation and populate token store', async done => {
    // if render <PasswordReset />, this.props.match are empty and not get passed to apollo request
    element = <Layout path={routes.password.reset} component={PasswordReset} />
    wrapper = await mountGraphql(element, mocks, [routes.password.getReset(varsRequest.uid, varsRequest.token)])
    const getToken = () => wrapper.find('PasswordReset').prop('token').token

    expect(getToken()).toBeUndefined()
    submit(wrapper)

    setTimeout(() => {
      expect(getToken()).toBe(response.data.resetPassword.token)
      done()
    })
  })
})

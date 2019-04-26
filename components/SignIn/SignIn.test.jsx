import React from 'react'

import { mountGraphql } from 'tests/helpers'
import i18nClient from 'libs/i18nClient'
import Token from 'stores/Token'

import SignIn from './SignIn'
import submitter from './mocks'
import response from './fixtures/response.json'
import invalidCredentials from './fixtures/invalid_credentials.json'

const { variables, mocks, getField, submit, itShould } = submitter

describe('SignIn Component', () => {
  const element = <SignIn />
  let wrapper

  beforeEach(() => {
    i18nClient.changeLanguage('en')
    global.console.warn = jest.fn()
    Token.set(undefined)
  })

  itShould.test(element)

  it('should submit form with mutation and populate token store', async done => {
    wrapper = await mountGraphql(element, mocks)
    const getToken = () => wrapper.find('SignIn').prop('token').token

    expect(getToken()).toBeUndefined()
    submit(wrapper)

    setTimeout(() => {
      expect(getToken()).toBe(response.data.tokenAuth.token)
      done()
    })
  })

  xit('should clear apollo cache after successful signin', async done => {
    const client = { resetStore: jest.fn() }
    wrapper = await mountGraphql(element, mocks)

    expect(client.resetStore).not.toHaveBeenCalled()
    submit(wrapper)

    setTimeout(() => {
      expect(client.resetStore).toHaveBeenCalled()
      done()
    })
  })

  it('should render error when mutation failed and keep username value', async done => {
    wrapper = await mountGraphql(element, [
      {
        ...mocks[0],
        result: invalidCredentials,
      },
    ])
    submit(wrapper)
    setTimeout(() => {
      wrapper.update()
      expect(wrapper.find('Button').prop('disabled')).toBe(false)
      expect(wrapper.text()).toContain('Please, enter valid credentials')
      expect(getField(wrapper, 'username')).toBe(variables.username)
      done()
    })
  })
})

import React from 'react'

import { mountGraphql } from 'tests/helpers'
import i18nClient from 'libs/i18nClient'
import Token from 'stores/Token'

import PasswordChange from './PasswordChange'
import submitter from './mocks'

const { mocks, submit, itShould } = submitter

describe('PasswordChange Component', () => {
  const element = <PasswordChange />
  let wrapper

  beforeEach(() => {
    i18nClient.changeLanguage('en')
    global.console.warn = jest.fn()
    Token.set('token')
  })

  itShould.test(element)

  it('should submit form with mutation and navigate to index', async done => {
    wrapper = await mountGraphql(element, mocks)
    wrapper.find('PasswordChange').prop('history').push = jest.fn()
    const push = () => wrapper.find('PasswordChange').prop('history').push

    expect(push()).not.toHaveBeenCalled()
    submit(wrapper)

    setTimeout(() => {
      expect(push()).toHaveBeenCalled()
      done()
    })
  })
})

import React from 'react'

import i18nClient from 'libs/i18nClient'
import Token from 'stores/Token'

import SignUp from './SignUp'
import submitter from './mocks'

const { itShould } = submitter

describe('SignUp Component', () => {
  const element = <SignUp />

  beforeEach(() => {
    i18nClient.changeLanguage('en')
    global.console.warn = jest.fn()
    Token.set()
  })

  itShould.test(element)
  itShould.testWrongEmail(element)
})

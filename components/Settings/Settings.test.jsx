import React from 'react'

import { mountGraphql } from 'tests/helpers'
import i18nClient from 'libs/i18nClient'
import Token from 'stores/Token'

import Settings from './Settings'
import submitter from './mocks'

const { mocks, submit, itShould } = submitter

describe('Settings Component', () => {
  const element = <Settings />
  let wrapper

  beforeEach(() => {
    i18nClient.changeLanguage('en')
    global.console.warn = jest.fn()
    Token.set('token')
  })

  itShould.test(element)
  itShould.testWrongEmail(element)

  it('should submit form with mutation and navigate back', async done => {
    wrapper = await mountGraphql(element, mocks)
    wrapper.find('Settings').prop('history').goBack = jest.fn()
    const goBack = () => wrapper.find('Settings').prop('history').goBack

    expect(goBack()).not.toHaveBeenCalled()
    submit(wrapper)

    setTimeout(() => {
      expect(goBack()).toHaveBeenCalled()
      done()
    })
  })
})

import React from 'react'

import { mountGraphql } from 'tests/helpers'
import i18nClient from 'libs/i18nClient'

import PasswordChange from './PasswordChange'
import submitter from './mocks'

const { mocks, submit, itShould } = submitter

describe('PasswordChange Component', () => {
  const element = <PasswordChange />
  let wrapper

  beforeEach(() => {
    i18nClient.changeLanguage('en')
    global.console.warn = jest.fn()
  })

  itShould.test(element)

  it('should submit form with mutation and navigate back', async done => {
    wrapper = await mountGraphql(element, mocks)
    wrapper.find('PasswordChange').prop('history').goBack = jest.fn()
    const goBack = () => wrapper.find('PasswordChange').prop('history').goBack

    expect(goBack()).not.toHaveBeenCalled()
    submit(wrapper)

    setTimeout(() => {
      expect(goBack()).toHaveBeenCalled()
      done()
    })
  })
})

import React from 'react'

import { mountGraphql } from 'tests/helpers'
import i18nClient from 'libs/i18nClient'

import PasswordForgot from './PasswordForgot'
import submitter from './mocks'
import invalidEmail from './fixtures/invalid_email'

const { variables, mocks, getField, submit, itShould } = submitter

describe('PasswordForgot Component', () => {
  const element = <PasswordForgot />
  let wrapper

  beforeEach(() => {
    i18nClient.changeLanguage('en')
    global.console.warn = jest.fn()
  })

  itShould.test(element)

  it('should submit form with mutation and display message', async done => {
    wrapper = await mountGraphql(element, mocks)
    submit(wrapper)
    setTimeout(() => {
      wrapper.update()
      expect(wrapper.find('Button')).toHaveLength(0)
      expect(wrapper.text()).toContain('have been sent to your email')
      done()
    })
  })

  it('should render error when mutation failed, disable/enable button and keep username value', async done => {
    wrapper = await mountGraphql(element, [
      {
        ...mocks[0],
        result: invalidEmail,
      },
    ])
    submit(wrapper)
    setTimeout(() => {
      wrapper.update()
      expect(wrapper.find('Button').prop('disabled')).toBe(false)
      expect(wrapper.text()).toContain(invalidEmail.errors[0].message)
      expect(getField(wrapper, 'email')).toBe(variables.email)
      done()
    })
  })
})

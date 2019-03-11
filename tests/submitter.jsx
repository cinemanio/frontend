// @flow
import * as React from 'react'
import Helmet from 'react-helmet'

import i18nClient from 'libs/i18nClient'
import settings from 'settings'

import { mountGraphql } from './helpers'

const languages = settings.languages.map(pair => pair[0])

export default (
  Component: Object,
  ComponentForm: Object,
  variables: Object,
  result: Object,
  resultData: ?Object,
  variablesRequest: ?Object,
  variablesRequestData: ?Object
) => {
  const initialData = !!Component.fragments.data
  const mocks = [
    {
      request: { query: Component.fragments.mutation, variables: variablesRequest || variables },
      result,
    },
  ]

  // if form pre initialized with data, add initial and post-mutation requests
  // TODO: get rid of post-mutation request
  if (initialData && resultData) {
    const mockData = {
      request: { query: Component.fragments.data, variables: variablesRequestData },
      result: resultData,
    }
    mocks.unshift(mockData)
    mocks.push(mockData)
  }

  const getField = (wrapper: Object, name: string) => {
    const form = wrapper.find(ComponentForm).prop('form')
    return form.getFieldsValue()[name]
  }

  const fillField = (wrapper: Object, name: string, value: mixed) =>
    wrapper
      .find(Component)
      .find(`Input[id="${name}"]`)
      .props()
      .onChange(value)

  const fillForm = (wrapper: Object) =>
    Object.entries(variables).forEach(([name, value]) => fillField(wrapper, name, value))

  const submit = (wrapper: Object) => {
    fillForm(wrapper)
    wrapper
      .find(Component)
      .find('form')
      .simulate('submit')
  }

  const testSubmitFormAndDisableButton = (element: React.Node) => {
    it('should submit form with mutation and disable button', async done => {
      const wrapper = await mountGraphql(element, mocks)

      expect(wrapper.find('Button').prop('disabled')).toBe(false)
      submit(wrapper)
      expect(wrapper.find('Button').prop('disabled')).toBe(true)
      setTimeout(done)
    })
  }

  const testI18n = (element: React.Node) => {
    it('should have different translations of the button for all languages', async () => {
      const wrapper = await mountGraphql(element, mocks)
      const translations = languages.map((language: string) => {
        i18nClient.changeLanguage(language)
        wrapper.update()
        return wrapper.find('button').text()
      })
      expect(new Set(translations).size).toBe(languages.length)
    })
  }

  const testI18nAllTranslated = (element: React.Node) => {
    it('should ensure all translatable strings are translated including title', async () => {
      const wrapper = await mountGraphql(element, mocks)
      languages.forEach((language: string) => {
        i18nClient.changeLanguage(language)
        wrapper.update()
        expect(wrapper.text()).not.toContain(`${Component.i18nPrefix}.`)
        expect(Helmet.peek().title).not.toContain(`${Component.i18nPrefix}.`)
      })
    })
  }

  const testFormFilling = (element: React.Node) => {
    it('should render page with initial data and fill the form', async () => {
      const wrapper = await mountGraphql(element, mocks)
      const getInitialValue = name => {
        if (initialData && resultData) {
          const selector = Object.keys(resultData.data)[0]
          return resultData.data[selector][name]
        } else {
          return undefined
        }
      }
      Object.keys(variables).forEach((name: string) => expect(getField(wrapper, name)).toBe(getInitialValue(name)))
      fillForm(wrapper)
      Object.entries(variables).forEach(([name, value]) => expect(getField(wrapper, name)).toBe(value))
    })
  }

  const testWrongEmail = (element: React.Node) => {
    it('should render error of invalid email', async () => {
      const wrapper = await mountGraphql(element, mocks)
      fillField(wrapper, 'email', 'bad email')
      expect(wrapper.text()).toContain('not valid email')
    })
  }

  return {
    mocks,
    getField,
    fillForm,
    fillField,
    submit,
    variables,
    itShould: {
      test: (element: React.Node) => {
        testI18n(element)
        testI18nAllTranslated(element)
        testFormFilling(element)
        testSubmitFormAndDisableButton(element)
      },
      testWrongEmail,
    },
  }
}

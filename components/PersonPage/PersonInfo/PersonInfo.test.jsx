import React from 'react'
import { mount } from 'enzyme'

import { itShouldRenderBlocks, mountOptions } from 'tests/helpers'
import i18nClient from 'libs/i18nClient'

import PersonInfo from './PersonInfo'
import actress from './fixtures/actress.json'

describe('Person Info Component', () => {
  let element
  let wrapper
  const content = {
    roles: 'Actress',
    country: 'USA',
    dates: 'Aug 28, 1962',
  }

  describe('Genderize', () => {
    beforeAll(() => {
      element = <PersonInfo person={actress.data.person} roles />
    })

    it('should render actress instead of actor for en lang', () => {
      i18nClient.changeLanguage('en')
      wrapper = mount(element, mountOptions)
      expect(wrapper.text()).toContain('Actress')
    })

    it('should render actress instead of actor for ru lang', () => {
      i18nClient.changeLanguage('ru')
      wrapper = mount(element, mountOptions)
      expect(wrapper.text()).toContain('Актриса')
    })
  })

  describe('flags', () => {
    element = <PersonInfo person={actress.data.person} />

    describe('blocks', () => {
      ;[{ all: true }, { roles: true }, { dates: true }, { country: true }, { roles: true, country: true }].forEach(
        itShouldRenderBlocks(content, element)
      )
    })
  })

  describe('one block only', () => {
    Object.entries(content).map(([type, text]) =>
      it(`should render only ${type} block`, () => {
        const person = { roles: [] }
        const newType = type.replace('dates', 'dateBirth')
        person[newType] = actress.data.person[newType]
        if (type === 'roles') {
          person.gender = 'FEMALE'
        }
        element = <PersonInfo person={person} all />
        wrapper = mount(element, mountOptions)
        expect(wrapper.find('div').children()).toHaveLength(1)
        expect(wrapper.text()).toContain(text)
      })
    )
  })
})

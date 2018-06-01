import React from 'react'
import { mount } from 'enzyme'

import { i18nProps, itShouldRenderBlocks } from 'tests/helpers'

import PersonInfo from './PersonInfo'
import actress from './fixtures/actress.json'
import _ from 'lodash'

describe('Person Info Component', () => {
  let element
  let wrapper

  describe('Genderize', () => {
    beforeAll(() => {
      element = <PersonInfo person={actress.data.person} {...i18nProps} roles/>
    })

    it('should render actress instead of actor for en lang', () => {
      i18nProps.i18n.changeLanguage('en')
      wrapper = mount(element)
      expect(wrapper.text()).toContain('Actress')
    })

    it('should render actress instead of actor for ru lang', () => {
      i18nProps.i18n.changeLanguage('ru')
      wrapper = mount(element)
      expect(wrapper.text()).toContain('Актриса')
    })
  })

  describe('flags', () => {
    element = <PersonInfo person={actress.data.person} {...i18nProps}/>
    const content = {
      roles: 'Actress',
      country: 'USA',
      dates: 'Aug 28, 1962',
    }

    describe('blocks', () => {
      [
        { all: true },
        { roles: true },
        { dates: true },
        { country: true },
        { roles: true, country: true },
      ].forEach(itShouldRenderBlocks(content, element))
    })
  })
})

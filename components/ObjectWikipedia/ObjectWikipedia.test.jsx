import React from 'react'
import { mount } from 'enzyme'

import { mountOptions } from 'tests/helpers'
import i18nClient from 'libs/i18nClient'
import movieResponse from 'components/MoviePage/fixtures/response.json'

import ObjectWikipedia from './ObjectWikipedia'

describe('ObjectWikipedia Component', () => {
  let element
  let wrapper
  const switchMode = () => wrapper.find('button').simulate('click')
  const expectFullContent = (sections, paragraphs) => () => {
    expect(wrapper.find('WikiSection')).toHaveLength(1)
    switchMode()
    expect(wrapper.find('WikiSection')).toHaveLength(sections)
    expect(
      wrapper
        .find('WikiSection')
        .first()
        .find('p')
    ).toHaveLength(paragraphs)
    switchMode()
    expect(wrapper.find('WikiSection')).toHaveLength(1)
  }

  beforeEach(() => {
    element = <ObjectWikipedia object={movieResponse.data.movie} />
    wrapper = mount(element, mountOptions)
  })

  describe('i18n. en', () => {
    beforeAll(() => i18nClient.changeLanguage('en'))
    it('should render en content', () => expect(wrapper.text()).toContain('1964 American musical film'))
    it('should render button', () => expect(wrapper.find('button').text()).toContain('read more'))
    it('should display full and short version of content', expectFullContent(12, 3))
  })

  describe('i18n. ru', () => {
    beforeAll(() => i18nClient.changeLanguage('ru'))
    it('should render ru content', () => expect(wrapper.text()).toContain('Да здравствует Лас-Вегас'))
    it('should render button', () => expect(wrapper.find('button').text()).toContain('узнать больше'))
    it('should display full and short version of content', expectFullContent(10, 2))
    // TODO: fix wtf_wikipedia cut some paragraphs
    xit('should render all text', () => {
      switchMode()
      expect(wrapper.text()).toContain('Фильмография Элвиса Пресли')
    })
  })
})

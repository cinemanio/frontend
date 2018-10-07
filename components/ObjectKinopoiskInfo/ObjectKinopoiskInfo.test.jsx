import React from 'react'
import { mount } from 'enzyme'

import { mountOptions } from 'tests/helpers'
import i18nClient from 'libs/i18nClient'
import movieResponse from 'components/MoviePage/fixtures/response.json'

import ObjectKinopoiskInfo from './ObjectKinopoiskInfo'

describe('ObjectKinopoiskInfo Component', () => {
  let element
  let wrapper

  beforeEach(() => {
    element = <ObjectKinopoiskInfo object={movieResponse.data.movie} />
    wrapper = mount(element, mountOptions)
  })

  describe('i18n. en', () => {
    beforeAll(() => i18nClient.changeLanguage('en'))
    it('should render en content', () => expect(wrapper.text()).toBe(''))
  })

  describe('i18n. ru', () => {
    beforeAll(() => i18nClient.changeLanguage('ru'))
    it('should render ru content', () => expect(wrapper.text()).toContain('Действие картины разворачивается'))
  })

  it('should render block', () => expect(wrapper.find('Block')).toHaveLength(1))

  it('should not render block if no kinopoisk', () => {
    const movie = { ...movieResponse.data.movie }
    delete movie.kinopoisk
    wrapper = mount(<ObjectKinopoiskInfo object={movie} />, mountOptions)
    expect(wrapper.find('Block')).toHaveLength(0)
  })

  it('should not render block if no kinopoisk info', () => {
    const movie = { ...movieResponse.data.movie }
    movie.kinopoisk.info = ''
    wrapper = mount(<ObjectKinopoiskInfo object={movie} />, mountOptions)
    expect(wrapper.find('Block')).toHaveLength(0)
  })
})

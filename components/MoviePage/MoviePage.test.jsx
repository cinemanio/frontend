import React from 'react'
import Helmet from 'react-helmet'

import i18n from 'libs/i18nClient'
import { mountRouter } from 'tests/helpers'

import { MoviePage } from './MoviePage'
import { data } from './fixtures/response.json'

describe('Movie Page Component', () => {
  let element
  let wrapper

  beforeEach(() => {
    element = <MoviePage params={{ movieId: '' }} data={data} t={i => i18n.t(i)} i18n={i18n}/>
    wrapper = mountRouter(element)
  })

  it('should render movie IMDb rating', () => expect(wrapper.text()).toContain('7'))
  it('should render movie Kinopoisk rating', () => expect(wrapper.text()).toContain('6.336'))

  describe('i18n. en', () => {
    beforeAll(() => i18n.changeLanguage('en'))

    it('should render movie title', () => expect(wrapper.find('h1').text()).toBe('Kids'))
    it('should not render movie original title', () => expect(wrapper.find('h2').text()).toBe(''))
    it('should render movie runtime', () => expect(wrapper.text()).toContain('1 hour, 31 minutes'))
    it('should render movie countries', () => expect(wrapper.text()).toContain('USA'))
    it('should render movie languages', () => expect(wrapper.text()).toContain('English'))
    it('should render word rating', () =>
      expect(wrapper.find('MovieSites').find('span').first().prop('title')).toContain('rating'))
    it('should render kinopoisk', () => expect(wrapper.text()).toContain('kinopoisk.ru'))
    it('should render role name', () => expect(wrapper.text()).toContain('Jennie'))
    it('should render page title', () => expect(Helmet.peek().title).toBe('Kids, 1995'))
  })

  describe('i18n. ru', () => {
    beforeAll(() => i18n.changeLanguage('ru'))

    it('should render movie title', () => expect(wrapper.find('h1').text()).toBe('Детки'))
    it('should not render movie original title', () => expect(wrapper.find('h2').text()).toBe('Kids'))
    it('should render movie runtime', () => expect(wrapper.text()).toContain('1 час, 31 минут'))
    it('should render movie countries', () => expect(wrapper.text()).toContain('США'))
    it('should render movie languages', () => expect(wrapper.text()).toContain('Английский'))
    it('should render word rating', () =>
      expect(wrapper.find('MovieSites').find('span').first().prop('title')).toContain('Рейтинг'))
    it('should render kinopoisk', () => expect(wrapper.text()).toContain('Кинопоиск'))
    it('should render role name', () => expect(wrapper.text()).toContain('Дженни'))
    it('should render page title', () => expect(Helmet.peek().title).toBe('Детки, Kids, 1995'))
  })
})

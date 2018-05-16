import React from 'react'
import Helmet from 'react-helmet'

import { mountRouter, mountGraphql, populated, i18nProps } from 'tests/helpers'

import MoviePage from './MoviePage'
import response from './fixtures/response.json'
import emptyResponse from './fixtures/empty_response.json'

describe('Movie Page Component', () => {
  let element
  let wrapper
  let requestsLog

  describe('Unit test', () => {
    beforeEach(() => {
      element = (<MoviePage.WrappedComponent
        params={{ movieId: '' }} data={response.data} {...i18nProps}/>)
      wrapper = mountRouter(element)
    })

    it('should render movie IMDb rating', () => expect(wrapper.text()).toContain('7'))
    it('should render movie Kinopoisk rating', () => expect(wrapper.text()).toContain('6.336'))

    describe('i18n. en', () => {
      beforeAll(() => i18nProps.i18n.changeLanguage('en'))

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
      beforeAll(() => i18nProps.i18n.changeLanguage('ru'))

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

  describe('Populated with response', () => {
    beforeAll(() => {
      global.console.warn = jest.fn()
    })

    beforeEach(() => {
      element = <MoviePage match={{ params: { slug: response.data.movie.id } }} {...i18nProps}/>
      requestsLog = []
      wrapper = mountGraphql([response], element, requestsLog)
    })

    it('should send requests', done => populated(done, wrapper, async () => {
      expect(requestsLog).toHaveLength(1)
      expect(requestsLog[0].variables).toEqual({ movieId: response.data.movie.id })
    }))
  })

  describe('Populated with empty response', () => {
    beforeEach(() => {
      element = <MoviePage match={{ params: { slug: '' } }} {...i18nProps}/>
      requestsLog = []
      wrapper = mountGraphql([emptyResponse], element, requestsLog)
    })

    it('should render 404 page', done => populated(done, wrapper, async () => {
      expect(wrapper.find('Status[code=404]')).toHaveLength(1)
      expect(wrapper.text()).toContain('Sorry, can’t find that.')
    }))
  })
})

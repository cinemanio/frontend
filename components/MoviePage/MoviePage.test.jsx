import React from 'react'
import Helmet from 'react-helmet'

import { mountGraphql } from 'tests/helpers'
import mutationResponse from 'components/Relation/mutationResponse'
import i18nClient from 'libs/i18nClient'

import MoviePage from './MoviePage'
import { mockMovie } from './mocks'
import MovieRelations from './MovieRelations/MovieRelations'
import response from './fixtures/response.json'
import emptyResponse from './fixtures/empty_response.json'

describe('Movie Page Component', () => {
  let element
  let wrapper

  describe('Unit', () => {
    beforeAll(() => i18nClient.changeLanguage('en'))
    beforeEach(async () => {
      element = (<MoviePage.WrappedComponent
        params={{ movieId: '' }} data={response.data}/>)
      wrapper = await mountGraphql(element)
    })

    it('should render movie IMDb rating', () => expect(wrapper.text()).toContain('7'))
    it('should render movie Kinopoisk rating', () => expect(wrapper.text()).toContain('6.336'))

    describe('i18n. en', () => {
      beforeAll(() => i18nClient.changeLanguage('en'))

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
      beforeAll(() => i18nClient.changeLanguage('ru'))

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

    // it('should change language on the fly', () => {
    //   i18nClient.changeLanguage('ru')
    //   wrapper.update()
    //   expect(wrapper.text()).toContain('Кинопоиск')
    //   expect(wrapper.find('h1').text()).toBe('Детки')
    //   i18nClient.changeLanguage('en')
    //   wrapper.update()
    //   expect(wrapper.text()).toContain('kinopoisk.ru')
    //   expect(wrapper.find('h1').text()).toBe('Kids')
    // })
  })

  describe('GraphQL', () => {
    it('should render movie page', async () => {
      wrapper = await mountGraphql(
        <MoviePage match={{ params: { slug: response.data.movie.id } }}/>, [mockMovie])
      expect(wrapper.find('MovieInfo')).toHaveLength(1)
      expect(wrapper.find('MovieImage')).toHaveLength(1)
      expect(wrapper.find('ObjectWikipedia')).toHaveLength(1)
    })

    it('should render 404 page when response empty', async () => {
      wrapper = await mountGraphql(
        <MoviePage match={{ params: { slug: '' } }}/>,
        [{
          request: { query: MoviePage.queries.movie, variables: { movieId: '' } },
          result: emptyResponse,
        }])
      expect(wrapper.find('Status[code=404]')).toHaveLength(1)
    })

    it('should change relation and relations count', async () => {
      wrapper = await mountGraphql(
        <MoviePage match={{ params: { slug: response.data.movie.id } }}/>,
        [
          mockMovie,
          {
            request: {
              query: MovieRelations.fragments.relate,
              variables: { id: response.data.movie.id, code: 'fav' },
            },
            result: { data: mutationResponse(response.data.movie, 'fav') },
          },
        ])
      expect(wrapper.find('Relation[code="fav"]').find('span[className="active"]')).toHaveLength(0)
      expect(wrapper.find('Relation[code="fav"]').text()).toBe('2')
      wrapper.find('Relation[code="fav"]').find('span').first().simulate('click')
      expect(wrapper.find('Relation[code="fav"]').find('span[className="active"]')).toHaveLength(1)
      expect(wrapper.find('Relation[code="fav"]').text()).toBe('3')
    })
  })
})

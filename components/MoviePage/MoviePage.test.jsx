import React from 'react'
import Helmet from 'react-helmet'

import { mountRouter, mountGraphql, i18nProps } from 'tests/helpers'
import relationMutation from 'components/Relation/relationMutation'

import MoviePage, { MovieQuery } from './MoviePage'
import MovieRelations from './MovieRelations/MovieRelations'
import response from './fixtures/response.json'
import emptyResponse from './fixtures/empty_response.json'

describe('Movie Page Component', () => {
  let element
  let wrapper

  describe('Unit', () => {
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

  describe('GraphQL', () => {
    const mockMovie = {
      request: { query: MovieQuery, variables: { movieId: response.data.movie.id } },
      result: response,
    }

    it('should render movie page', async () => {
      wrapper = await mountGraphql(
        <MoviePage match={{ params: { slug: response.data.movie.id } }} {...i18nProps}/>, [mockMovie])
      expect(wrapper.find('MovieInfo')).toHaveLength(1)
      expect(wrapper.find('MovieImage')).toHaveLength(1)
    })

    it('should render 404 page when response empty', async () => {
      wrapper = await mountGraphql(
        <MoviePage match={{ params: { slug: '' } }} {...i18nProps}/>,
        [{
          request: { query: MovieQuery, variables: { movieId: '' } },
          result: emptyResponse,
        }])
      expect(wrapper.find('Status[code=404]')).toHaveLength(1)
    })

    it('should change relation and relations count', async () => {
      const relateMutation = relationMutation('Movie', MovieRelations.codes)
      wrapper = await mountGraphql(
        <MoviePage match={{ params: { slug: response.data.movie.id } }} {...i18nProps}/>,
        [
          mockMovie,
          {
            request: { query: relateMutation, variables: { id: response.data.movie.id, code: 'fav' } },
            result: {
              data: {
                relate: {
                  relation: {
                    ...response.data.movie.relation,
                    fav: true,
                    __typename: 'MovieRelationNode',
                  },
                  count: {
                    ...response.data.movie.relationsCount,
                    fav: response.data.movie.relationsCount.fav + 1,
                    __typename: 'MovieRelationCountNode',
                  },
                  __typename: 'Relate',
                },
              },
            },
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

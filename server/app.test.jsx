import request from 'supertest'
import Helmet from 'react-helmet'
import _ from 'lodash'

import { getMockedNetworkFetch } from 'tests/helpers'
import routes from 'components/App/routes'

import app from './app'
import poster from './fixtures/poster.json'
import photo from './fixtures/photo.json'
import noPoster from './fixtures/no_poster.json'
import noPhoto from './fixtures/no_photo.json'
import movies from '../components/MoviesPage/fixtures/response.json'
import genres from '../components/MoviesPage/fixtures/genres.json'
import countries from '../components/MoviesPage/fixtures/countries.json'
import movie from '../components/MoviePage/fixtures/response.json'
import noMovie from '../components/MoviePage/fixtures/empty_response.json'
import persons from '../components/PersonsPage/fixtures/response.json'
import person from '../components/PersonPage/fixtures/response.json'
import noPerson from '../components/PersonPage/fixtures/empty_response.json'
import settings from '../settings'

describe('Server Routes', () => {
  let requestsLog
  const client = (response) => {
    const mock = getMockedNetworkFetch(response, requestsLog)
    const httpConf = { fetch: mock, customFetch: mock }
    return request(app(httpConf).callback())
  }

  beforeAll(() => {
    global.console.log = jest.fn()
    global.console.warn = jest.fn()
    Helmet.renderStatic = jest.fn()
  })

  beforeEach(() => {
    requestsLog = []
  })

  it('should respond an index page', async () => {
    const response = await client().get(routes.index)
    expect(response.status).toEqual(302)
  })

  it('should respond an signin page', async () => {
    const response = await client().get(routes.signin).set('Accept-Language', 'en')
    expect(response.status).toEqual(200)
  })

  it('should respond an signup page', async () => {
    const response = await client().get(routes.signup).set('Accept-Language', 'en')
    expect(response.status).toEqual(200)
  })

  it('should respond 404 error page', async () => {
    const response = await client().get('/404').set('Accept-Language', 'en')
    expect(response.status).toEqual(404)
    expect(response.type).toEqual('text/html')
  })

  xit('should respond a favicon', async () => {
    const response = await client().get('/public/favicon.ico')
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('image/x-icon')
  })

  describe('Image app', () => {
    [
      ['movie', 'poster', poster, noMovie, noPoster],
      ['person', 'photo', photo, noPerson, noPhoto],
    ].forEach(([object, image, imageResponse, noObjectResponse, noImageResponse]) => {
      const url = `/images/${object}/${image}/detail/TW92aWVOb2RlOjk2MDc%3D.jpg`

      it(`should respond a ${object} ${image}`, async () => {
        const response = await client(imageResponse).get(url)
        expect(response.status).toEqual(200)
        expect(requestsLog).toHaveLength(1)
        expect(requestsLog[0].operationName).toEqual(_.capitalize(object))
        expect(requestsLog[0].query).toContain(object)
        expect(requestsLog[0].query).toContain(image)
        expect(requestsLog[0].query).toContain('detail')
        expect(requestsLog[0].variables).toEqual({ id: 'TW92aWVOb2RlOjk2MDc=' })
        expect(response.status).toEqual(200)
        expect(response.type).toEqual('image/jpeg')
      })

      it(`should respond 404 for no ${object} ${image}`, async () => {
        const response = await client(noObjectResponse).get(url)
        expect(requestsLog).toHaveLength(1)
        expect(response.status).toEqual(404)
      })

      it(`should respond 404 for ${object} no ${image}`, async () => {
        const response = await client(noImageResponse).get(url)
        expect(requestsLog).toHaveLength(1)
        expect(response.status).toEqual(200)
        expect(response.type).toEqual('image/jpeg')
      })
    })

    it('should make a right camel cased request', async () => {
      await client(photo).get('/images/person/photo/short_card/TW92aWVOb2RlOjk2MDc%3D.jpg')
      expect(requestsLog[0].query).toContain('shortCard')
    })

    it('should respond 404 for wrong request', async () => {
      const response = await client(noPhoto).get('/images/blabla/poster/detail/TW92aWVOb2RlOjk2MDc%3D.jpg')
      expect(response.status).toEqual(404)
      expect(requestsLog).toHaveLength(0)
    })
  })

  describe('Object(s) pages', () => {
    [
      [
        'movie', 'kids-1995-TW92aWVOb2RlOjk2MDc%3D', 'TW92aWVOb2RlOjk2MDc=', movies, movie, noMovie,
        { orderBy: 'relations_count__like' },
      ],
      [
        'person', 'david-fincher-UGVyc29uTm9kZToxNTQ%3D', 'UGVyc29uTm9kZToxNTQ=', persons, person, noPerson,
        { orderBy: 'relations_count__like' },
      ],
    ].forEach(([object, slug, id, objectsResponse, objectResponse, noResponse, defaults]) => {
      it(`should respond a ${object}s page`, async () => {
        const response = await client(objectsResponse).get(routes[object].list).set('Accept-Language', 'en')
        expect(requestsLog).toHaveLength(3)
        expect(requestsLog[2].operationName).toEqual(_.capitalize(object) + 's')
        expect(requestsLog[2].variables).toEqual({ after: '', first: 100, ...defaults })
        expect(response.status).toEqual(200)
        expect(response.type).toEqual('text/html')
      })

      it(`should respond a ${object} page`, async () => {
        const response = await client(objectResponse).get(`${routes[object].list}/${slug}`).set('Accept-Language', 'en')
        expect(requestsLog).toHaveLength(1)
        expect(requestsLog[0].operationName).toEqual(_.capitalize(object))
        expect(requestsLog[0].variables).toEqual({ [`${object}Id`]: id })
        expect(response.status).toEqual(200)
        expect(response.type).toEqual('text/html')
      })

      it(`should respond a ${object} page for authenticated user`, async () => {
        const response = await client(objectResponse).get(`${routes[object].list}/${slug}`).set('Accept-Language', 'en')
          .set('Cookie', ['jwt=12345'])
        expect(requestsLog).toHaveLength(0)
        expect(requestsLog[0].operationName).toEqual(_.capitalize(object))
        expect(requestsLog[0].variables).toEqual({ [`${object}Id`]: id })
        expect(response.status).toEqual(200)
        expect(response.type).toEqual('text/html')
      })

      it(`should not respond a wrong ${object} page`, async () => {
        const response = await client(noResponse).get(`${routes[object].list}/none`).set('Accept-Language', 'en')
        expect(requestsLog).toHaveLength(1)
        expect(requestsLog[0].operationName).toEqual(_.capitalize(object))
        expect(requestsLog[0].variables).toEqual({ [`${object}Id`]: 'none' })
        expect(response.status).toEqual(404)
        expect(response.type).toEqual('text/html')
      })
    })
  })

  describe('i18n. should translate to the language', () => {
    [
      ['ru', 'Фильмы'],
      ['en', 'Movies'],
    ].forEach(([lang, title]) => {
      it(`${lang} if cookie defined`, async () => {
        const cookie = `${settings.i18nCookieName}=${lang}`
        const response = await client([genres, countries, movies]).get('/movies/').set('Cookie', [cookie])
        expect(response.text).toContain(`<html lang="${lang}"`)
        expect(response.text).toContain(title)
      })

      it(`${lang} if browser accept language`, async () => {
        const response = await client([genres, countries, movies]).get('/movies/').set('Accept-Language', lang)
        expect(response.text).toContain(`<html lang="${lang}"`)
        expect(response.text).toContain(title)
      })
    })
  })
})

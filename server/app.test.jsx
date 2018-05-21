import request from 'supertest'
import Helmet from 'react-helmet'

import { getMockedNetworkFetch } from 'tests/helpers'

import app from './app'
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
    const response = await client().get('/')
    expect(response.status).toEqual(302)
  })

  xit('should respond a favicon', async () => {
    const response = await client().get('/public/favicon.ico')
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('image/x-icon')
  })

  it('should respond a image', async () => {
    const poster = {
      data: {
        movie: {
          poster: {
            detail: 'http://upload.wikimedia.org/wikipedia/commons/9/9e/Francis_Ford_Coppola_2007_crop.jpg'
          }
        }
      }
    }
    const response = await client(poster).get('/images/movie/poster/detail/TW92aWVOb2RlOjk2MDc%3D.jpg')
    expect(requestsLog).toHaveLength(1)
    expect(requestsLog[0].operationName).toEqual('Movie')
    expect(requestsLog[0].query).toContain('movie')
    expect(requestsLog[0].query).toContain('poster')
    expect(requestsLog[0].query).toContain('detail')
    expect(requestsLog[0].variables).toEqual({ id: 'TW92aWVOb2RlOjk2MDc=' })
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('image/jpeg')
  })

  it('should respond 404 error page', async () => {
    const response = await client().get('/404')
    expect(response.status).toEqual(404)
    expect(response.type).toEqual('text/html')
  })

  it('should respond a movies page', async () => {
    const response = await client(movies).get('/movies')
    expect(requestsLog).toHaveLength(3)
    expect(requestsLog[2].operationName).toEqual('Movies')
    expect(requestsLog[2].variables).toEqual({ after: '', first: 100 })
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('text/html')
  })

  it('should respond a movie page', async () => {
    const response = await client(movie).get('/movies/kids-1995-TW92aWVOb2RlOjk2MDc%3D')
    expect(requestsLog).toHaveLength(1)
    expect(requestsLog[0].operationName).toEqual('Movie')
    expect(requestsLog[0].variables).toEqual({ movieId: 'TW92aWVOb2RlOjk2MDc=' })
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('text/html')
  })

  it('should not respond a wrong movie page', async () => {
    const response = await client(noMovie).get('/movies/404')
    expect(requestsLog).toHaveLength(1)
    expect(requestsLog[0].operationName).toEqual('Movie')
    expect(requestsLog[0].variables).toEqual({ movieId: '404' })
    expect(response.status).toEqual(404)
    expect(response.type).toEqual('text/html')
  })

  it('should respond a persons page', async () => {
    const response = await client(persons).get('/persons')
    expect(requestsLog).toHaveLength(3)
    expect(requestsLog[2].operationName).toEqual('Persons')
    expect(requestsLog[2].variables).toEqual({ after: '', first: 100 })
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('text/html')
  })

  it('should respond a person page', async () => {
    const response = await client(person).get('/persons/david-fincher-UGVyc29uTm9kZToxNTQ%3D')
    expect(requestsLog).toHaveLength(1)
    expect(requestsLog[0].operationName).toEqual('Person')
    expect(requestsLog[0].variables).toEqual({ personId: 'UGVyc29uTm9kZToxNTQ=' })
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('text/html')
  })

  it('should not respond a wrong person page', async () => {
    const response = await client(noPerson).get('/persons/404')
    expect(requestsLog).toHaveLength(1)
    expect(requestsLog[0].operationName).toEqual('Person')
    expect(requestsLog[0].variables).toEqual({ personId: '404' })
    expect(response.status).toEqual(404)
    expect(response.type).toEqual('text/html')
  })

  describe('i18n. should translate to the language', () => {
    [
      ['ru', 'Фильмы'],
      ['en', 'Movies']
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

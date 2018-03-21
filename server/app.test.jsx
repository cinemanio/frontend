import request from 'supertest'
import Helmet from 'react-helmet'
import createMockedNetworkFetch from 'apollo-mocknetworkinterface'

import app from './app'
import movies from '../components/MoviesPage/fixtures/response.json'
import movie from '../components/MoviePage/fixtures/response.json'
import noMovie from '../components/MoviePage/fixtures/empty_response.json'
import persons from '../components/PersonsPage/fixtures/response.json'
import person from '../components/PersonPage/fixtures/response.json'
import noPerson from '../components/PersonPage/fixtures/empty_response.json'

describe('Server Routes', () => {
  let graphqlParams
  const client = (response) => {
    const graphqlCallback = (params) => {
      graphqlParams = params
      return response || ''
    }
    const httpConf = { fetch: createMockedNetworkFetch(graphqlCallback, { timeout: 0 }) }
    return request(app(httpConf).callback())
  }

  beforeAll(() => {
    global.console.log = jest.fn()
    Helmet.renderStatic = jest.fn()
  })

  it('should respond an index page', async () => {
    const response = await client().get('/')
    expect(response.status).toEqual(302)
  })

  // it('should respond a favicon', async () => {
  //   const response = await client().get('/public/favicon.ico')
  //   expect(response.status).toEqual(200)
  //   expect(response.type).toEqual('image/x-icon')
  // })

  it('should respond 404 error page', async () => {
    const response = await client().get('/404')
    expect(response.status).toEqual(404)
    expect(response.type).toEqual('text/html')
  })

  it('should respond a movies page', async () => {
    const response = await client(movies).get('/movies')
    expect(graphqlParams.operationName).toEqual('Movies')
    expect(graphqlParams.variables).toEqual({ after: '', first: 100 })
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('text/html')
  })

  it('should respond a movie page', async () => {
    const response = await client(movie).get('/movies/kids-1995-TW92aWVOb2RlOjk2MDc%3D')
    expect(graphqlParams.operationName).toEqual('Movie')
    expect(graphqlParams.variables).toEqual({ movieId: 'TW92aWVOb2RlOjk2MDc=' })
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('text/html')
  })

  it('should not respond a wrong movie page', async () => {
    const response = await client(noMovie).get('/movies/404')
    expect(graphqlParams.operationName).toEqual('Movie')
    expect(graphqlParams.variables).toEqual({ movieId: '404' })
    expect(response.status).toEqual(404)
    expect(response.type).toEqual('text/html')
  })

  it('should respond a persons page', async () => {
    const response = await client(persons).get('/persons')
    expect(graphqlParams.operationName).toEqual('Persons')
    expect(graphqlParams.variables).toEqual({ after: '', first: 100 })
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('text/html')
  })

  it('should respond a person page', async () => {
    const response = await client(person).get('/persons/david-fincher-UGVyc29uTm9kZToxNTQ%3D')
    expect(graphqlParams.operationName).toEqual('Person')
    expect(graphqlParams.variables).toEqual({ personId: 'UGVyc29uTm9kZToxNTQ=' })
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('text/html')
  })

  it('should not respond a wrong person page', async () => {
    const response = await client(noPerson).get('/persons/404')
    expect(graphqlParams.operationName).toEqual('Person')
    expect(graphqlParams.variables).toEqual({ personId: '404' })
    expect(response.status).toEqual(404)
    expect(response.type).toEqual('text/html')
  })
})

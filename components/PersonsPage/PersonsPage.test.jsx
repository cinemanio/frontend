import React from 'react'
import Helmet from 'react-helmet'
import { translate } from 'react-i18next'

import { mountGraphql, mockAutoSizer, selectFilterChange } from 'tests/helpers'
import PersonRelations from 'components/PersonPage/PersonRelations/PersonRelations'
import mutationResponse from 'components/Relation/mutationResponse'
import i18nClient from 'libs/i18nClient'
import User from 'stores/User'

import PersonsPage from './PersonsPage'
import { mockPersons, mockCountries, mockRoles, mockWithParams } from './mocks'
import response from './fixtures/response.json'
import roles from './fixtures/roles.json'
import countries from './fixtures/countries.json'
import emptyResponse from './fixtures/empty_response.json'

describe('Persons Page Component', () => {
  let element
  let wrapper

  beforeAll(mockAutoSizer)

  describe('Unit', () => {
    beforeAll(() => i18nClient.changeLanguage('en'))
    beforeEach(async () => {
      const data = { ...response.data, fetchMore: jest.fn(), loadNextPage: jest.fn() }
      const PersonsPagePure = translate()(PersonsPage.WrappedComponent)
      element = <PersonsPagePure data={data} roleData={roles.data} countryData={countries.data}/>
      wrapper = await mountGraphql(element)
    })

    it('should render persons', () => {
      expect(wrapper.find('PersonLink').length).toBeGreaterThan(0)
    })

    it('should render select filters', () => {
      expect(wrapper.find('SelectGeneric')).toHaveLength(2)
      expect(wrapper.find('SelectGeneric[code="view"]').find('option')).toHaveLength(1)
      expect(wrapper.find('SelectGeneric[code="orderBy"]').find('option')).toHaveLength(2)
      expect(wrapper.find('SelectFilter')).toHaveLength(3)
      expect(wrapper.find('SelectFilter[code="relation"]').find('option')).toHaveLength(PersonRelations.codes.length + 1)
      expect(wrapper.find('SelectFilter[code="roles"]').find('option')).toHaveLength(roles.data.list.length + 1)
      expect(wrapper.find('SelectFilter[code="country"]').find('option')).toHaveLength(countries.data.list.length + 1)
    })

    it('should render active filter, when filter selected', () => {
      expect(wrapper.find('ActiveFilters')).toHaveLength(3)
      expect(wrapper.find('ActiveFilters[code="roles"]').find('span')).toHaveLength(0)
      selectFilterChange(wrapper, 'SelectFilter[code="roles"]', 'Um9sZU5vZGU6MTE=')
      expect(wrapper.find('ActiveFilters[code="roles"]').find('span')).toHaveLength(1)
    })

    describe('i18n. en', () => {
      beforeAll(() => i18nClient.changeLanguage('en'))
      it('should render page title', () => expect(Helmet.peek().title).toBe('Persons'))
    })

    describe('i18n. ru', () => {
      beforeAll(() => i18nClient.changeLanguage('ru'))
      it('should render page title', () => expect(Helmet.peek().title).toBe('Персоны'))
    })
  })

  describe('GraphQL', () => {
    beforeAll(() => i18nClient.changeLanguage('en'))

    it('should render persons', async () => {
      wrapper = await mountGraphql(<PersonsPage/>, [mockPersons, mockCountries, mockRoles])
      expect(wrapper.find('PersonShort').length).toBeGreaterThan(0)
      expect(wrapper.find('SelectFilter[code="roles"]').find('option').length).toBeGreaterThan(1)
      expect(wrapper.find('SelectFilter[code="country"]').find('option').length).toBeGreaterThan(1)
    })

    it('should send filter params in request', async () => {
      global.console.warn = jest.fn()
      wrapper = await mountGraphql(
        <PersonsPage/>,
        [
          mockPersons, mockCountries, mockRoles,
          mockWithParams({
            relation: null,
            roles: ['Um9sZU5vZGU6MTE='],
            country: '',
          }),
          mockWithParams({
            relation: null,
            roles: ['Um9sZU5vZGU6MTE='],
            country: 'Q291bnRyeU5vZGU6MTE=',
          }),
          mockWithParams({
            relation: 'fav',
            roles: ['Um9sZU5vZGU6MTE='],
            country: 'Q291bnRyeU5vZGU6MTE=',
          }),
          mockWithParams({
            orderBy: 'relations_count__dislike',
            relation: 'fav',
            roles: ['Um9sZU5vZGU6MTE='],
            country: 'Q291bnRyeU5vZGU6MTE=',
          }),
        ])
      selectFilterChange(wrapper, 'SelectFilter[code="roles"]', 'Um9sZU5vZGU6MTE=')
      selectFilterChange(wrapper, 'SelectFilter[code="country"]', 'Q291bnRyeU5vZGU6MTE=')
      selectFilterChange(wrapper, 'SelectFilter[code="relation"]', 'fav')
      selectFilterChange(wrapper, 'SelectGeneric[code="orderBy"]', 'relations_count__dislike')
    })

    it('should change relation', async () => {
      User.login('user')
      wrapper = await mountGraphql(
        <PersonsPage/>,
        [
          mockPersons, mockCountries, mockRoles,
          {
            request: {
              query: PersonRelations.fragments.relate,
              variables: { id: response.data.list.edges[0].person.id, code: 'fav' },
            },
            result: { data: mutationResponse(response.data.list.edges[0].person, 'fav') },
          },
        ])
      expect(wrapper.find('Relation[code="fav"]').find('span[className="active"]')).toHaveLength(0)
      // expect(wrapper.find('Relation[code="fav"]').first().text()).toBe('2')
      wrapper.find('Relation[code="fav"]').find('span').first().simulate('click')
      expect(wrapper.find('Relation[code="fav"]').find('span[className="active"]')).toHaveLength(1)
      // expect(wrapper.find('Relation[code="fav"]').first().text()).toBe('3')
    })

    it('should render message if no results in response', async () => {
      wrapper = await mountGraphql(<PersonsPage/>, [{ ...mockPersons, result: emptyResponse }])
      expect(wrapper.find('PersonShort')).toHaveLength(0)
      expect(wrapper.text()).toContain('There is no such persons.')
    })
  })
})

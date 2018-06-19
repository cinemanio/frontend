import React from 'react'
import _ from 'lodash'

import { mountGraphql, mockAutoSizer, selectFilterChange, i18nProps } from 'tests/helpers'
import PersonRelations from 'components/PersonPage/PersonRelations/PersonRelations'
import mutationResponse from 'components/Relation/mutationResponse'

import PersonsPage, { PersonsQuery, CountryQuery, RolesQuery } from './PersonsPage'
import response from './fixtures/response.json'
import roles from './fixtures/roles.json'
import countries from './fixtures/countries.json'
import emptyResponse from './fixtures/empty_response.json'

describe('Persons Page Component', () => {
  let element
  let wrapper

  beforeAll(mockAutoSizer)

  describe('Unit', () => {
    beforeEach(async () => {
      const data = _.clone(response.data)
      data.fetchMore = jest.fn()
      data.loadNextPage = jest.fn()
      element = (<PersonsPage.WrappedComponent
        data={data} roleData={roles.data} countryData={countries.data} {...i18nProps}/>)
      wrapper = await mountGraphql(element)
    })

    it('should render persons', () => {
      expect(wrapper.find('PersonLink').length).toBeGreaterThan(0)
    })

    it('should render select filters', () => {
      expect(wrapper.find('SelectFilter')).toHaveLength(2)
      expect(wrapper.find('SelectFilter').at(0).find('option')).toHaveLength(roles.data.list.length + 1)
      expect(wrapper.find('SelectFilter').at(1).find('option')).toHaveLength(countries.data.list.length + 1)
    })

    it('should render active filter, when filter selected', () => {
      expect(wrapper.find('ActiveFilters')).toHaveLength(2)
      expect(wrapper.find('ActiveFilters').at(0).find('span')).toHaveLength(0)
      selectFilterChange(wrapper, 0, 'Um9sZU5vZGU6MTE=')
      expect(wrapper.find('ActiveFilters').at(0).find('span')).toHaveLength(1)
    })
  })

  describe('GraphQL', () => {
    const mockPersons = { request: { query: PersonsQuery, variables: { first: 100, after: '' } }, result: response }
    const mockCountries = { request: { query: CountryQuery }, result: countries }
    const mockRoles = { request: { query: RolesQuery }, result: roles }

    it('should render persons', async () => {
      wrapper = await mountGraphql(<PersonsPage {...i18nProps}/>, [mockPersons, mockCountries, mockRoles])
      expect(wrapper.find('PersonShort').length).toBeGreaterThan(0)
      expect(wrapper.find('SelectFilter[code="roles"]').find('option').length).toBeGreaterThan(1)
      expect(wrapper.find('SelectFilter[code="country"]').find('option').length).toBeGreaterThan(1)
    })

    it('should send filter params in request', async () => {
      wrapper = await mountGraphql(
        <PersonsPage {...i18nProps}/>,
        [
          mockPersons, mockCountries, mockRoles,
          {
            ...mockPersons,
            request: {
              ...mockPersons.request,
              variables: {
                ...mockPersons.request.variables,
                roles: ['Um9sZU5vZGU6MTE='],
                country: '',
              },
            },
          },
          {
            ...mockPersons,
            request: {
              ...mockPersons.request,
              variables: {
                ...mockPersons.request.variables,
                roles: ['Um9sZU5vZGU6MTE='],
                country: 'Q291bnRyeU5vZGU6MTE=',
              },
            },
          },
        ])
      selectFilterChange(wrapper, 0, 'Um9sZU5vZGU6MTE=')
      selectFilterChange(wrapper, 1, 'Q291bnRyeU5vZGU6MTE=')
    })

    it('should change relation', async () => {
      wrapper = await mountGraphql(
        <PersonsPage {...i18nProps}/>,
        [
          mockPersons, mockCountries, mockRoles,
          {
            request: {
              query: PersonRelations.fragments.relate,
              variables: { id: response.data.list.edges[0].person.id, code: 'fav' }
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
      wrapper = await mountGraphql(<PersonsPage {...i18nProps}/>, [{ ...mockPersons, result: emptyResponse }])
      expect(wrapper.find('PersonShort')).toHaveLength(0)
      expect(wrapper.text()).toContain('There is no such persons.')
    })
  })
})

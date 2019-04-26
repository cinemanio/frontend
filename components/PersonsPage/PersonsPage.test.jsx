import React from 'react'
import Helmet from 'react-helmet'
import { translate } from 'react-i18next'

import { mountGraphql, mockAutoSizer, selectFilterChange, paginate, itShouldTestObjectsRelations } from 'tests/helpers'
import PersonRelations from 'components/PersonPage/PersonRelations/PersonRelations'
import i18nClient from 'libs/i18nClient'
import Token from 'stores/Token'

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
      const data = { ...response.data, fetchMore: jest.fn(), loadNextPage: () => jest.fn() }
      const PersonsPagePure = translate()(PersonsPage.WrappedComponent)
      element = <PersonsPagePure data={data} roleData={roles.data} countryData={countries.data} />
      wrapper = await mountGraphql(element)
    })

    it('should render persons', () => {
      expect(wrapper.find('PersonLink').length).toBeGreaterThan(0)
    })

    it('should render select filters', () => {
      expect(wrapper.find('SelectGeneric')).toHaveLength(2)
      expect(wrapper.find('SelectGeneric[code="view"]').prop('list')).toHaveLength(1)
      expect(wrapper.find('SelectGeneric[code="orderBy"]').prop('list')).toHaveLength(2)
      expect(wrapper.find('SelectFilter')).toHaveLength(3)
      expect(wrapper.find('SelectFilter[code="relation"]').prop('list')).toHaveLength(PersonRelations.codes.length)
      expect(wrapper.find('SelectFilter[code="roles"]').prop('list')).toHaveLength(roles.data.list.length)
      expect(wrapper.find('SelectFilter[code="country"]').prop('list')).toHaveLength(countries.data.list.length)
    })

    it('should render active filter, when filter selected', () => {
      expect(wrapper.find('ActiveFilters')).toHaveLength(3)
      expect(wrapper.find('ActiveFilters[code="roles"]').find('Tag')).toHaveLength(0)
      selectFilterChange(wrapper, 'SelectFilter[code="roles"]', 'Um9sZU5vZGU6MTE=')
      expect(wrapper.find('ActiveFilters[code="roles"]').find('Tag')).toHaveLength(1)
    })

    describe('i18n. en', () => {
      beforeAll(() => i18nClient.changeLanguage('en'))
      it('should render filter title', () => expect(wrapper.text()).toContain('Filter by'))
      it('should render page title', () => expect(Helmet.peek().title).toBe('Persons'))
    })

    describe('i18n. ru', () => {
      beforeAll(() => i18nClient.changeLanguage('ru'))
      it('should render filter title', () => expect(wrapper.text()).toContain('Фильтровать по'))
      it('should render page title', () => expect(Helmet.peek().title).toBe('Персоны'))
    })

    it('should change language on the fly', () => {
      i18nClient.changeLanguage('ru')
      wrapper.update()
      expect(wrapper.text()).toContain('Дэвид Финчер')
      expect(wrapper.text()).toContain('David Fincher')
      i18nClient.changeLanguage('en')
      wrapper.update()
      expect(wrapper.text()).toContain('David Fincher')
      expect(wrapper.text()).not.toContain('Дэвид Финчер')
    })
  })

  describe('GraphQL', () => {
    const mocks = [mockPersons, mockCountries, mockRoles]
    const getActiveFilter = code =>
      wrapper
        .find(`ActiveFilters[code="${code}"]`)
        .find('Tag')
        .text()

    beforeAll(() => i18nClient.changeLanguage('en'))

    it('should render persons', async () => {
      wrapper = await mountGraphql(<PersonsPage />, mocks)
      expect(wrapper.find('SelectFilter[code="roles"]').prop('list').length).toBeGreaterThan(1)
      expect(wrapper.find('SelectFilter[code="country"]').prop('list').length).toBeGreaterThan(1)
    })

    it('should render message if no results in response', async () => {
      wrapper = await mountGraphql(<PersonsPage />, [{ ...mockPersons, result: emptyResponse }])
      expect(wrapper.find('PersonShort')).toHaveLength(0)
      expect(wrapper.text()).toContain('There is no such persons.')
    })

    itShouldTestObjectsRelations(
      PersonsPage,
      PersonRelations.fragments.relate,
      mocks,
      response.data.list.edges[0].person
    )

    it('should send filter params in request', async done => {
      Token.set('token')
      global.console.warn = jest.fn()
      wrapper = await mountGraphql(
        <PersonsPage />,
        mocks.concat([
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
      )
      selectFilterChange(wrapper, 'SelectFilter[code="roles"]', 'Um9sZU5vZGU6MTE=')
      selectFilterChange(wrapper, 'SelectFilter[code="country"]', 'Q291bnRyeU5vZGU6MTE=')
      selectFilterChange(wrapper, 'SelectFilter[code="relation"]', 'fav')
      selectFilterChange(wrapper, 'SelectGeneric[code="orderBy"]', 'relations_count__dislike')
      expect(getActiveFilter('roles')).toBe('Translator')
      expect(getActiveFilter('country')).toBe('Benin')
      expect(getActiveFilter('relation')).toBe('Fav')
      setTimeout(done)
    })

    it('should paginate during scrolling keeping selected filters', async done => {
      wrapper = await mountGraphql(
        <PersonsPage />,
        mocks.concat([
          mockWithParams({
            relation: null,
            roles: ['Um9sZU5vZGU6MTE='],
            country: '',
          }),
          mockWithParams({
            relation: null,
            roles: ['Um9sZU5vZGU6MTE='],
            country: '',
            after: response.data.list.pageInfo.endCursor,
          }),
        ])
      )
      selectFilterChange(wrapper, 'SelectFilter[code="roles"]', 'Um9sZU5vZGU6MTE=')
      expect(wrapper.find('ObjectList').prop('data').list.edges).toHaveLength(100)
      paginate(wrapper)
      // TODO: test amount of items after loading second page
      setTimeout(done)
    })
  })
})

import React from 'react'
import Helmet from 'react-helmet'

import { mountGraphql } from 'tests/helpers'
import mutationResponse from 'components/Relation/mutationResponse'
import i18nClient from 'libs/i18nClient'

import PersonPage, { PersonQuery } from './PersonPage'
import PersonRelations from './PersonRelations/PersonRelations'
import response from './fixtures/response.json'
import emptyResponse from './fixtures/empty_response.json'

describe('Person Page Component', () => {
  let element
  let wrapper

  describe('Unit', () => {
    beforeEach(async () => {
      element = (<PersonPage.WrappedComponent
        params={{ personId: '' }} data={response.data}/>)
      wrapper = await mountGraphql(element)
    })

    describe('i18n. en', () => {
      beforeAll(() => i18nClient.changeLanguage('en'))

      it('should render person name', () => expect(wrapper.find('h1').text()).toBe('David Fincher'))
      it('should not render person original name', () => expect(wrapper.find('h2').text()).toBe(''))
      it('should render person birth and death dates', () => expect(wrapper.text())
        .toContain('Aug 28, 1962 – Jan 28, 2100'))
      it('should render person country', () => expect(wrapper.text()).toContain('USA'))
      it('should render person roles', () => expect(wrapper.text()).toContain('Director'))
      it('should render role name', () => expect(wrapper.text()).toContain('Bobby'))
      it('should render page title', () => expect(Helmet.peek().title).toBe('David Fincher, Director'))
    })

    describe('i18n. ru', () => {
      beforeAll(() => i18nClient.changeLanguage('ru'))

      it('should render person name', () => expect(wrapper.find('h1').text()).toBe('Дэвид Финчер'))
      it('should not render person original name', () => expect(wrapper.find('h2').text()).toBe('David Fincher'))
      it('should render person birth and death dates', () => expect(wrapper.text())
        .toContain('Авг 28, 1962 – Янв 28, 2100'))
      it('should render person country', () => expect(wrapper.text()).toContain('США'))
      it('should render person roles', () => expect(wrapper.text()).toContain('Режиссер'))
      it('should render role name', () => expect(wrapper.text()).toContain('Бобби'))
      it('should render page title', () => expect(Helmet.peek().title).toBe('Дэвид Финчер, David Fincher, Режиссер'))
    })
  })

  describe('GraphQL', () => {
    const mockPerson = {
      request: { query: PersonQuery, variables: { personId: response.data.person.id } },
      result: response,
    }

    it('should render person page', async () => {
      wrapper = await mountGraphql(
        <PersonPage match={{ params: { slug: response.data.person.id } }}/>, [mockPerson])
      expect(wrapper.find('PersonInfo')).toHaveLength(1)
      expect(wrapper.find('PersonImage')).toHaveLength(1)
    })

    it('should render 404 page when response empty', async () => {
      wrapper = await mountGraphql(
        <PersonPage match={{ params: { slug: '' } }}/>,
        [{
          request: { query: PersonQuery, variables: { personId: '' } },
          result: emptyResponse,
        }])
      expect(wrapper.find('Status[code=404]')).toHaveLength(1)
    })

    it('should change relation and relations count', async () => {
      wrapper = await mountGraphql(
        <PersonPage match={{ params: { slug: response.data.person.id } }}/>,
        [
          mockPerson,
          {
            request: {
              query: PersonRelations.fragments.relate,
              variables: { id: response.data.person.id, code: 'fav' },
            },
            result: { data: mutationResponse(response.data.person, 'fav') },
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

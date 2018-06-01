import React from 'react'
import Helmet from 'react-helmet'

import { mountRouter, mountGraphql, populated, i18nProps } from 'tests/helpers'

import PersonPage from './PersonPage'
import response from './fixtures/response.json'
import emptyResponse from './fixtures/empty_response.json'

describe('Person Page Component', () => {
  let element
  let wrapper

  describe('Unit', () => {
    beforeEach(() => {
      element = (<PersonPage.WrappedComponent
        params={{ personId: '' }} data={response.data} {...i18nProps}/>)
      wrapper = mountRouter(element)
    })

    describe('i18n. en', () => {
      beforeAll(() => i18nProps.i18n.changeLanguage('en'))

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
      beforeAll(() => i18nProps.i18n.changeLanguage('ru'))

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
    let requestsLog

    describe('Populated with response', () => {
      beforeAll(() => {
        global.console.warn = jest.fn()
      })

      beforeEach(() => {
        element = <PersonPage match={{ params: { slug: response.data.person.id } }} {...i18nProps}/>
        requestsLog = []
        wrapper = mountGraphql([response], element, requestsLog)
      })

      it('should send requests', done => populated(done, wrapper, () => {
        expect(requestsLog).toHaveLength(1)
        expect(requestsLog[0].variables).toEqual({ personId: response.data.person.id })
      }))
    })

    describe('Populated with empty response', () => {
      beforeEach(() => {
        element = <PersonPage match={{ params: { slug: '' } }} {...i18nProps}/>
        wrapper = mountGraphql([emptyResponse], element)
      })

      it('should render 404 page', done => populated(done, wrapper, () => {
        expect(wrapper.find('Status[code=404]')).toHaveLength(1)
        expect(wrapper.text()).toContain('Sorry, can’t find that.')
      }))
    })
  })
})

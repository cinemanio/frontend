import React from 'react'
import Helmet from 'react-helmet'

import i18n from 'libs/i18nClient'
import { mountRouter } from 'tests/helpers'

import { PersonPage } from './PersonPage'
import { data } from './fixtures/response.json'
// import emptyResponse from './fixtures/empty_response.json'

describe('Person Page Component', () => {
  let element
  let wrapper

  beforeEach(() => {
    element = <PersonPage params={{ personId: '' }} data={data} t={i => i18n.t(i)} i18n={i18n}/>
    wrapper = mountRouter(element)
  })

  describe('i18n. en', () => {
    beforeAll(() => i18n.changeLanguage('en'))

    it('should render person name', () => expect(wrapper.find('h1').text()).toBe('David Fincher'))
    it('should not render person original name', () => expect(wrapper.find('h2').text()).toBe(''))
    it('should render person birth date', () => expect(wrapper.text()).toContain('Aug 28, 1962'))
    it('should render person country', () => expect(wrapper.text()).toContain('USA'))
    it('should render person roles', () => expect(wrapper.text()).toContain('Director'))
    it('should render role name', () => expect(wrapper.text()).toContain('Bobby'))
    it('should render page title', () => expect(Helmet.peek().title).toBe('David Fincher, Director'))
  })

  describe('i18n. ru', () => {
    beforeAll(() => i18n.changeLanguage('ru'))

    it('should render person name', () => expect(wrapper.find('h1').text()).toBe('Дэвид Финчер'))
    it('should not render person original name', () => expect(wrapper.find('h2').text()).toBe('David Fincher'))
    it('should render person birth date', () => expect(wrapper.text()).toContain('Авг 28, 1962'))
    it('should render person country', () => expect(wrapper.text()).toContain('США'))
    it('should render person roles', () => expect(wrapper.text()).toContain('Режиссер'))
    it('should render role name', () => expect(wrapper.text()).toContain('Бобби'))
    it('should render page title', () => expect(Helmet.peek().title).toBe('Дэвид Финчер, David Fincher, Режиссер'))
  })

  // it('should render 404 page if response is empty', () => {
  //   element = <PersonPage params={{ personId: '' }} data={emptyResponse.data}/>
  //   wrapper = mount(element)
  //   expect(wrapper.find('Error404')).toHaveLength(1)
  // })
})

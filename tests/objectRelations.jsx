import React from 'react'

import mutationResponse from 'components/Relation/mutationResponse'
import User from 'stores/User'

import { getAlerts, mountGraphql } from './helpers'

export default (Component, query, mock, object, message) => {
  const favMock = {
    request: { query, variables: { id: object.id, code: 'fav' } },
    result: { data: mutationResponse(object, 'fav') },
  }

  describe('Relations', () => {
    it('should change relation and relations count', async () => {
      User.login('user')
      const wrapper = await mountGraphql(<Component match={{ params: { slug: object.id } }}/>, [mock, favMock])
      expect(wrapper.find('Relation[code="fav"]').find('span[className="active"]')).toHaveLength(0)
      expect(wrapper.find('Relation[code="fav"]').text()).toBe('2')
      wrapper.find('Relation[code="fav"]').find('span').first().simulate('click')
      expect(wrapper.find('Relation[code="fav"]').find('span[className="active"]')).toHaveLength(1)
      expect(wrapper.find('Relation[code="fav"]').text()).toBe('3')
    })

    it('should change display one alert when switch relation on and off', async () => {
      User.login('user')
      const wrapper = await mountGraphql(<Component match={{ params: { slug: object.id } }}/>, [mock, favMock])
      expect(getAlerts(wrapper)).toHaveLength(0)
      wrapper.find('Relation[code="fav"]').find('span').first().simulate('click')
      expect(getAlerts(wrapper)).toHaveLength(1)
      expect(getAlerts(wrapper)[0].options.type).toBe('success')
      expect(getAlerts(wrapper)[0].message).toBe(message)
      wrapper.find('Relation[code="fav"]').find('span').first().simulate('click')
      expect(getAlerts(wrapper)).toHaveLength(1)
    })

    it('should not change relation, but display alert if user is unauthenticated', async () => {
      User.logout()
      const wrapper = await mountGraphql(<Component match={{ params: { slug: object.id } }}/>, [mock])
      expect(getAlerts(wrapper)).toHaveLength(0)
      wrapper.find('Relation[code="fav"]').find('span').first().simulate('click')
      expect(getAlerts(wrapper)).toHaveLength(1)
      expect(getAlerts(wrapper)[0].options.type).toBe('error')
    })
  })
}

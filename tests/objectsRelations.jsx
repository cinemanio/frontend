import React from 'react'

import mutationResponse from 'components/Relation/mutationResponse'
import Token from 'stores/Token'
import { mountGraphql, selectFilterChange } from 'tests/helpers'

export default (Component, query, mocks, object) => {
  describe('Relations', () => {
    it('should display alert when filter by relation if user is unauthenticated', async () => {
      Token.set(undefined)
      global.console.warn = jest.fn()
      const wrapper = await mountGraphql(<Component />, mocks)
      selectFilterChange(wrapper, 'SelectFilter[code="relation"]', 'fav')
    })

    it('should change relation', async () => {
      Token.set('token')
      const wrapper = await mountGraphql(
        <Component />,
        mocks.concat([
          {
            request: {
              query,
              variables: { id: object.id, code: 'fav' },
            },
            result: { data: mutationResponse(object, 'fav') },
          },
        ])
      )
      expect(wrapper.find('Relation[code="fav"]').find('span[className="active"]')).toHaveLength(0)
      // expect(wrapper.find('Relation[code="fav"]').first().text()).toBe('2')
      wrapper
        .find('Relation[code="fav"]')
        .find('span')
        .first()
        .simulate('click')
      expect(wrapper.find('Relation[code="fav"]').find('span[className="active"]')).toHaveLength(1)
      // expect(wrapper.find('Relation[code="fav"]').first().text()).toBe('3')
    })
  })
}

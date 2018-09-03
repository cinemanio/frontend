// @flow
import _ from 'lodash'

import PersonPage from './PersonPage'
import response from './fixtures/response.json'

export const getMockPerson = (personId: string) => {
  const newResponse = _.cloneDeep(response)
  newResponse.data.person.id = personId
  return {
    request: { query: PersonPage.queries.person, variables: { personId } },
    result: newResponse,
  }
}

export const mockPerson = getMockPerson(response.data.person.id)

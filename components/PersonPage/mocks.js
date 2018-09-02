import PersonPage from './PersonPage'

import response from './fixtures/response.json'

export const mockPerson = {
  request: { query: PersonPage.queries.person, variables: { personId: response.data.person.id } },
  result: response,
}

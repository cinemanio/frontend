// @flow
import PersonPage from './PersonPage'
import response from './fixtures/response.json'

export const getMockPerson = (personId: string) => ({
  request: { query: PersonPage.queries.person, variables: { personId } },
  result: response,
})

export const mockPerson = getMockPerson(response.data.person.id)

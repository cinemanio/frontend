import PersonsPage from './PersonsPage'
import response from './fixtures/response.json'
import countries from './fixtures/countries.json'
import roles from './fixtures/roles.json'

export const mockPersons = {
  request: { query: PersonsPage.queries.persons, variables: PersonsPage.variables.persons },
  result: response,
}
export const mockCountries = { request: { query: PersonsPage.queries.countries }, result: countries }
export const mockRoles = { request: { query: PersonsPage.queries.roles }, result: roles }
export const mockWithParams = params => ({
  ...mockPersons,
  request: {
    ...mockPersons.request,
    variables: {
      ...mockPersons.request.variables,
      ...params,
    },
  },
})

// @flow
import faker from 'faker'
import AccountActivation from './AccountActivation'
import response from './fixtures/response'

export default {
  request: { query: AccountActivation.fragments.mutation, variables: { key: faker.internet.password() } },
  result: response,
}

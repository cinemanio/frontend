// @flow
import faker from 'faker'

import submitter from 'tests/submitter'

import PasswordReset from './PasswordReset'
import PasswordResetForm from './PasswordResetForm/PasswordResetForm'
import response from './fixtures/response'

const vars = { password: faker.internet.password() }
export const varsRequest = {
  password: vars.password,
  uid: faker.internet.password(),
  token: faker.internet.password(),
}

export default submitter(PasswordReset, PasswordResetForm, vars, response, null, varsRequest)

// @flow
import faker from 'faker'

import submitter from 'tests/submitter'

import PasswordChange from './PasswordChange'
import PasswordChangeForm from './PasswordChangeForm/PasswordChangeForm'
import response from './fixtures/response'

const vars = {
  oldPassword: faker.internet.password(),
  newPassword: faker.internet.password(),
}

export default submitter(PasswordChange, PasswordChangeForm, vars, response)

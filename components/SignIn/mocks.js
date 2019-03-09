// @flow
import faker from 'faker'

import submitter from 'tests/submitter'

import SignIn from './SignIn'
import SignInForm from './SignInForm/SignInForm'
import response from './fixtures/response'

const vars = {
  username: faker.internet.userName(),
  password: faker.internet.password(),
}

export default submitter(SignIn, SignInForm, vars, response)

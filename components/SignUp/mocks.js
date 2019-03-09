// @flow
import faker from 'faker'

import submitter from 'tests/submitter'

import SignUp from './SignUp'
import SignUpForm from './SignUpForm/SignUpForm'
import response from './fixtures/response'

const vars = {
  username: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
}

export default submitter(SignUp, SignUpForm, vars, response)

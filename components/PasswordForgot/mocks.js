import faker from 'faker'

import submitter from 'tests/submitter'

import PasswordForgot from './PasswordForgot'
import PasswordForgotForm from './PasswordForgotForm/PasswordForgotForm'
import response from './fixtures/response'

const vars = { email: faker.internet.email() }

export default submitter(PasswordForgot, PasswordForgotForm, vars, response)

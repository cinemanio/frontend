import faker from 'faker'

import submitter from 'tests/submitter'

import Settings from './Settings'
import SettingsForm from './SettingsForm/SettingsForm'
import response from './fixtures/response'
import responseMe from './fixtures/response_me'

const vars = {
  username: faker.internet.userName(),
  email: faker.internet.email(),
}

export default submitter(Settings, SettingsForm, vars, response, responseMe)

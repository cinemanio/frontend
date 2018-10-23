import SignIn from './SignIn'
import response from './fixtures/response.json'

export const variables = {
  username: 'username',
  password: 'password',
}
export const mockSignIn = {
  request: { query: SignIn.fragments.signin, variables },
  result: response,
}
export const setUsername = (wrapper, value) => wrapper
  .find('input[id="username"]').props().onChange(value || variables.username)
export const setPassword = (wrapper, value) => wrapper
  .find('input[type="password"]').props().onChange(value || variables.password)
export const signIn = (wrapper) => {
  setUsername(wrapper)
  setPassword(wrapper)
  wrapper.find('SignIn').find('form').simulate('submit')
}

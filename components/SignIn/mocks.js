import SignIn from './SignIn'
import response from './fixtures/response.json'

export const username = 'username'
export const password = 'password'
export const mockSignIn = {
  request: { query: SignIn.fragments.signin, variables: { username, password } },
  result: response,
}
export const setUsername = (wrapper, value) => wrapper
  .find('input[type="text"]').props().onChange(value || username)
export const setPassword = (wrapper, value) => wrapper
  .find('input[type="password"]').props().onChange(value || password)
export const signIn = (wrapper) => {
  setUsername(wrapper)
  setPassword(wrapper)
  wrapper.find('SignIn').find('form').simulate('submit')
}

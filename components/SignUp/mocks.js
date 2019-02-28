import SignUp from './SignUp'
import response from './fixtures/response.json'

export const variables = {
  username: 'username',
  email: 'email@gmail.com',
  password: 'password',
}
export const mockSignUp = {
  request: { query: SignUp.fragments.signup, variables },
  result: response,
}
export const setUsername = (wrapper, value) =>
  wrapper
    .find('SignUp')
    .find('Input[id="username"]')
    .props()
    .onChange(value || variables.username)
export const setEmail = (wrapper, value) =>
  wrapper
    .find('SignUp')
    .find('Input[id="email"]')
    .props()
    .onChange(value || variables.email)
export const setPassword = (wrapper, value) =>
  wrapper
    .find('SignUp')
    .find('Input[type="password"]')
    .first()
    .props()
    .onChange(value || variables.password)
export const setPasswordConfirm = (wrapper, value) =>
  wrapper
    .find('SignUp')
    .find('Input[type="password"]')
    .last()
    .props()
    .onChange(value || variables.password)
export const signUp = wrapper => {
  setUsername(wrapper)
  setEmail(wrapper)
  setPassword(wrapper)
  setPasswordConfirm(wrapper)
  wrapper
    .find('SignUp')
    .find('form')
    .simulate('submit')
}

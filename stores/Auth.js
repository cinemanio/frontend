// @flow
import { observable, action } from 'mobx'

// import agent from '../agent'
import user from './User'
import token from './Token'

class Auth {
  @observable inProgress = false
  @observable errors = undefined

  @observable values = {
    username: '',
    email: '',
    password: '',
  }

  @action setUsername(username: string) {
    this.values.username = username
  }

  @action setEmail(email: string) {
    this.values.email = email
  }

  @action setPassword(password: string) {
    this.values.password = password
  }

  @action reset() {
    this.values.username = ''
    this.values.email = ''
    this.values.password = ''
  }

  @action login() {
    this.inProgress = true
    this.errors = undefined
    return agent.Auth.login(this.values.email, this.values.password)
      .then(data => token.set(data.user.token))
      .then(user.pull)
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.errors
        throw err
      }))
      .finally(action(() => {
        this.inProgress = false
      }))
  }

  @action register() {
    this.inProgress = true
    this.errors = undefined
    return agent.Auth.register(this.values.username, this.values.email, this.values.password)
      .then(data => token.set(data.user.token))
      .then(user.pull)
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.errors
        throw err
      }))
      .finally(action(() => {
        this.inProgress = false
      }))
  }

  @action logout() {
    token.set(undefined)
    user.forget()
    return Promise.resolve()
  }
}

export default new Auth()

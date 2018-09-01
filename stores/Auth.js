// @flow
import { observable, computed, action } from 'mobx'

import token from './Token'

class Auth {
  @observable inProgress = false
  @observable errors: Array<string> = []

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

  @action setErrors(errors: Array<string>) {
    this.errors = errors
  }

  @action reset() {
    this.values.username = ''
    this.values.email = ''
    this.values.password = ''
    this.setErrors([])
  }

  @computed get submitDisabled() {
    return !this.values.username || !this.values.password || this.inProgress
  }

  @action logout() {
    token.set(undefined)
    // user.forget()
    return Promise.resolve()
  }
}

export default new Auth()

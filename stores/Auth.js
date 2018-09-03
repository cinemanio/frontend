// @flow
import { observable, computed, action } from 'mobx'
import type { IObservableArray } from 'mobx'

import token from './Token'

class Auth {
  @observable errors: IObservableArray<string> = []

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

  @action setErrors(errors: IObservableArray<string>) {
    this.errors = errors
  }

  @action reset() {
    this.values.username = ''
    this.values.email = ''
    this.values.password = ''
    this.setErrors([])
  }

  @computed get submitDisabled() {
    return !this.values.username || !this.values.password
  }

  @action logout() {
    token.set(undefined)
    // user.forget()
    return Promise.resolve()
  }
}

export default new Auth()

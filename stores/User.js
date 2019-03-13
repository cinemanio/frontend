// @flow
import { observable, computed, action } from 'mobx'

import token from 'stores/Token'

class User {
  @observable
  username: ?string

  @computed
  get authenticated(): boolean {
    return !!token.token
  }

  @action
  login(username: string) {
    this.username = username
  }

  @action
  logout() {
    this.username = undefined
  }
}

export default new User()

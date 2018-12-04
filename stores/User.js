// @flow
import { observable, computed, action } from 'mobx'

class User {
  @observable
  username: ?string

  @computed
  get authenticated(): boolean {
    return !!this.username
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

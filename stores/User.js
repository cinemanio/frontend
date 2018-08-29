// @flow
import { observable, action } from 'mobx'

class User {
  @observable username: ?string

  @action login(username: string) {
    this.username = username
  }

  @action logout() {
    this.username = undefined
  }
}

export default new User()

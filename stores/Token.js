// @flow
import { observable, action, reaction } from 'mobx'

class Token {
  @observable token

  constructor() {
    try {
      this.token = window.localStorage.getItem('jwt')
      reaction(
        () => this.token,
        (token) => {
          if (token) {
            window.localStorage.setItem('jwt', token)
          } else {
            window.localStorage.removeItem('jwt')
          }
        },
      )
    } catch (e) {
    }
  }

  @action set(token: string) {
    this.token = token
  }
}

export default new Token()

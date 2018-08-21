// @flow
import { observable, action, reaction } from 'mobx'
import Cookies from 'universal-cookie'

class Token {
  @observable token

  cookieName = 'jwt'

  constructor() {
    this.cookies = new Cookies()
    try {
      this.token = this.cookies.get(this.cookieName)
      reaction(
        () => this.token,
        (token) => {
          const options = {}
          if (token) {
            options.expires = new Date(1970, 1, 1)
          }
          this.cookies.set(this.cookieName, token, options)
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

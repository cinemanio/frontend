// @flow
import { observable, action, reaction } from 'mobx'
import Cookies from 'universal-cookie'

class Token {
  @observable
  token: ?string

  cookieName = 'jwt'

  cookies: Cookies

  constructor() {
    this.init()
    reaction(() => this.token, this.save)
  }

  @action
  set(token: ?string) {
    this.token = token
  }

  /**
   * Initialize with new cookies
   * @param cookies - new cookies
   * @param node - environment
   */
  init(cookies: ?string, node: ?boolean) {
    try {
      this.cookies = new Cookies(cookies)
      this.cookies.HAS_DOCUMENT_COOKIE = !node
      this.token = this.load()
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }

  /**
   * Load token from cookies
   */
  load(): ?string {
    return this.cookies.get(this.cookieName)
  }

  /**
   * Save token to cookies
   * @param token
   */
  save = (token: ?string) => {
    const options = {}
    if (token) {
      this.cookies.set(this.cookieName, token, options)
    } else {
      this.cookies.remove(this.cookieName, options)
    }
  }
}

export default new Token()

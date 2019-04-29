// @flow
const routes: Object = {
  index: '/',
  movie: {
    list: '/movies',
    detail: '/movies/:slug',
    getDetail(id: string) {
      return this.detail.replace(':slug', id)
    },
  },
  person: {
    list: '/persons',
    detail: '/persons/:slug',
    getDetail(id: string) {
      return this.detail.replace(':slug', id)
    },
  },
  signin: '/signin',
  signup: '/signup',
  activation: '/account/activate/:key',
  getActivation(key: string) {
    return this.activation.replace(':key', key)
  },
  settings: '/settings',
  password: {
    change: '/password/change',
    forgot: '/password/forgot',
    reset: '/password/reset/:uid/:token',
    getReset(uid: string, token: string) {
      return this.reset.replace(':uid', uid).replace(':token', token)
    },
  },
}

export default routes

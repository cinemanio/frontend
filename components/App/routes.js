// @flow
const routes = {
  index: '/',
  movie: {
    list: '/movies',
    detail: '/movies/:slug',
    getDetail: (id: string) => {},
  },
  person: {
    list: '/persons',
    detail: '/persons/:slug',
    getDetail: (id: string) => {},
  },
  signin: '/signin',
  signup: '/signup',
  activation: '/account/activate/:key',
  settings: '/settings',
  password: {
    change: '/password/change',
    forgot: '/password/forgot',
    reset: '/password/reset/:uid/:token',
    getReset: (uid: string, token: string) => {},
  },
}

routes.movie.getDetail = (id: string) => routes.movie.detail.replace(':slug', id)
routes.person.getDetail = (id: string) => routes.person.detail.replace(':slug', id)
routes.getActivation = (key: string) => routes.activation.replace(':key', key)
routes.password.getReset = (uid: string, token: string) =>
  routes.password.reset.replace(':uid', uid).replace(':token', token)

export default routes

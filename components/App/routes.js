// @flow
const routes = {
  index: '/',
  movie: {
    list: '/movies',
    detail: '/movies/:slug',
    getDetail: (id: string) => {}
  },
  person: {
    list: '/persons',
    detail: '/persons/:slug',
    getDetail: (id: string) => {}
  },
  signin: '/signin',
  signup: '/signup',
}

routes.movie.getDetail = (id: string) => routes.movie.detail.replace(':slug', id)
routes.person.getDetail = (id: string) => routes.person.detail.replace(':slug', id)

export default routes

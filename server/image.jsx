// @flow
import { createApolloFetch } from 'apollo-fetch'
import fetch from 'isomorphic-fetch'
import _ from 'lodash'

export default (apolloHttpConf: Object) => async (ctx: Object) => {
  if (
    ['movie', 'person'].indexOf(ctx.params.type) === -1 ||
    ['poster', 'photo'].indexOf(ctx.params.image) === -1 ||
    ['detail', 'icon', 'small_card', 'full_card'].indexOf(ctx.params.size) === -1
  ) {
    ctx.status = 404
    return
  }

  const apolloFetch = createApolloFetch(apolloHttpConf)
  const operationName = _.capitalize(ctx.params.type)
  const query = `query ${operationName}($id: ID!) {
    ${ctx.params.type}(id: $id) {
      ${ctx.params.image} {
        ${_.camelCase(ctx.params.size)}
      }
    }
  }`

  await apolloFetch({
    operationName,
    query,
    variables: { id: ctx.params.id },
  })
    .then((response: Object) => response.data[ctx.params.type][ctx.params.image][ctx.params.size])
    .then(url => fetch(url))
    .then((response: Object) => {
      ctx.status = response.status
      ctx.type = response.headers.get('content-type')
      ctx.body = response.body
      return true
    })
    .catch(() => {
      // TODO: log errors
      ctx.status = 404
    })
}

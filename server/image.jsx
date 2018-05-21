// @flow
import { createApolloFetch } from 'apollo-fetch'
import fetch from 'isomorphic-fetch'
import _ from 'lodash'

export default (apolloHttpConf: Object) => async (ctx: Object) => {
  const apolloFetch = createApolloFetch(apolloHttpConf)
  const operationName = _.capitalize(ctx.params.type)
  await apolloFetch({
    operationName,
    query: `query ${operationName}($id: ID!) {
        ${ctx.params.type}(id: $id) {
          ${ctx.params.image} {
            ${ctx.params.size}
          }
        }
      }`,
    variables: { id: ctx.params.id }
  })
    .then((response: Object) => response.data[ctx.params.type][ctx.params.image][ctx.params.size])
    .then(url => fetch(url))
    .then((response: Object) => {
      ctx.status = response.status
      ctx.type = response.headers.get('content-type')
      ctx.body = response.body
      return true
    })
}

// @flow
import { createApolloFetch } from 'apollo-fetch'
import fetch from 'isomorphic-fetch'
import _ from 'lodash'
import readFilePromise from 'fs-readfile-promise'
import path from 'path'

import settings from 'settings'

const stubPath = path.resolve(settings.baseDir, 'images/grey.jpg')

export default (apolloHttpConf: Object) => async (ctx: Object) => {
  if (
    ['movie', 'person'].indexOf(ctx.params.type) === -1
    || ['poster', 'photo'].indexOf(ctx.params.image) === -1
    || ['detail', 'icon', 'short_card', 'full_card'].indexOf(ctx.params.size) === -1
  ) {
    ctx.status = 404
    return
  }

  const apolloFetch = createApolloFetch(apolloHttpConf)
  const { type, image } = ctx.params
  const operationName = _.capitalize(ctx.params.type)
  const size = _.camelCase(ctx.params.size)
  const query = `query ${operationName}($id: ID!) {
    ${type}(id: $id) {
      ${image} {
        ${size}
      }
    }
  }`

  const processBackendResponse = async (response: Object) => {
    if (!response.data[type]) {
      throw Error('No object in response')
    } else if (!response.data[type][image]) {
      await readFilePromise(stubPath)
        .then((content: Object) => {
          ctx.status = 200
          ctx.type = 'image/jpeg'
          ctx.body = content
          return true
        })
    } else if (!response.data[type][image][size]) {
      throw Error('No image in response')
    } else {
      await fetch(response.data[type][image][size])
        .then((responseImage: Object) => {
          ctx.status = responseImage.status
          ctx.type = responseImage.headers.get('content-type')
          ctx.body = responseImage.body
          return true
        })
    }
  }

  await apolloFetch({
    operationName,
    query,
    variables: { id: ctx.params.id }
  })
    .then(processBackendResponse)
    .catch((e) => {
      console.warn(e)
      ctx.status = 404
    })
}

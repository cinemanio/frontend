// @flow
import { setContext } from 'apollo-link-context'

import Token from 'stores/Token'

export default setContext((_, { headers }) => {
  const { token } = Token
  return {
    headers: {
      ...headers,
      authorization: token ? `JWT ${token}` : '',
    },
  }
})

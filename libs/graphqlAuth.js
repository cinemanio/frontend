// @flow
import { setContext } from 'apollo-link-context'

export default setContext((_, { headers }) => ({ headers }))
// export default setContext((_, { headers }) => {
//   const token = '';
//   return {
//     headers: {
//       ...headers,
//       authorization: token ? `JWT ${token}` : '',
//     }
//   }
// });

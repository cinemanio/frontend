import { IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';

import introspectionQueryResultData from './types.json';

export default new IntrospectionFragmentMatcher({
  introspectionQueryResultData
});

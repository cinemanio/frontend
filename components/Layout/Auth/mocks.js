import Auth from './Auth'
import responseAuth from './fixtures/responseAuth.json'
import responseNonAuth from './fixtures/responseNonAuth.json'

export const mockAuthToken = {
  request: { query: Auth.fragments.verify, variables: { token: 'zxcqweqd323124fgdfkj2o834uwkdfnlsr2834024' } },
  result: responseAuth,
}

export const mockAuthNoToken = {
  request: { query: Auth.fragments.verify, variables: {} },
  result: responseNonAuth,
}

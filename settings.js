export default {
  webpackServerHost: process.env.WEBPACK_SERVER_HOST || '127.0.0.1:3001',
  koaServerPort: process.env.PORT || 3000,
  backendApiUrl: process.env.BACKEND_API_URL || 'http://127.0.0.1:8000/graphql/',
  env: process.env.NODE_ENV || 'development'
}

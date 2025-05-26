export default {
  meEndpoint: '/user/check-auth',
  loginEndpoint: '/user/login',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}

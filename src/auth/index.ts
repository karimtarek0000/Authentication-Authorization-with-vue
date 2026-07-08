export * from './AuthCall/authCall'
export * from './config'
export * from './utils'

import {
  accessToken,
  isAuth,
  permissions,
  role,
  useAuthService,
  userInfo,
} from './AuthService/authService'

const { login, refreshToken, restoreSession } = useAuthService()

export { accessToken, isAuth, login, permissions, refreshToken, restoreSession, role, userInfo }

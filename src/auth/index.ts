export * from './AuthCall'
export * from './config'
export * from './utils'

import { useAuthService, userAuth } from './AuthService'

const { login, logout, refreshToken, restoreSession } = useAuthService()

export { login, logout, refreshToken, restoreSession, userAuth }

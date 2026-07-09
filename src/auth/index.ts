export * from './AuthCall'
export * from './config'
export * from './utils'

import { userAuth, useAuthService } from './AuthService'

const { login, refreshToken, restoreSession } = useAuthService()

export { userAuth, login, refreshToken, restoreSession }

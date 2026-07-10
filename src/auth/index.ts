export * from './AuthCall'
export * from './config'
export * from './Loaders'
export * from './Permissions'
export * from './Types'
export * from './utils'
import CanView from './Components/CanView.vue'

import { useAuthService, userAuth } from './AuthService'

const { login, logout, refreshToken, restoreSession } = useAuthService()

export { CanView, login, logout, refreshToken, restoreSession, userAuth }

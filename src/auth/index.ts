export * from './Call'
export * from './Config'
export * from './Guards'
export * from './Idle'
export * from './OAuth'
export * from './Permissions'
export * from './Sync'
export * from './Types'
export * from './utils'
import CanView from './Components/CanView.vue'

import { useAuthService, userAuth } from './Service/index.ts'

const { login, loginWithOAuth, logout, refreshToken, restoreSession } = useAuthService()

export { CanView, login, loginWithOAuth, logout, refreshToken, restoreSession, userAuth }

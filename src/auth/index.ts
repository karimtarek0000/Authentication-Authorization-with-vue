export * from './Call'
export * from './Config'
export * from './Guards'
export * from './Idle'
export * from './Permissions'
export * from './Sync'
export * from './Types'
export * from './Utils'
import CanView from './Components/CanView.vue'

import { useAuthService, userAuth } from './Service/index.ts'

const { login, logout, refreshToken, restoreSession } = useAuthService()

export { CanView, login, logout, refreshToken, restoreSession, userAuth }

// ========================================= //
// ============= AUTH_SERVICE =============== //
// ========================================= //
export interface Login {
  email: string
  password: string
}

export interface IUserAuth {
  accessToken: string
  userInfo: { id: string; name: string; email: string }
  permissions: Permission[]
  role: string
  isAuth: boolean
  hasAuth: string | null
}

// ========================================= //
// ============= PERMISSIONS =============== //
// ========================================= //
export const PERMISSIONS = {
  VIEW_DASHBOARD: 'view_dashboard',
  EDIT_PROFILE: 'edit_profile',
  MANAGE_USERS: 'manage_users',
  EDIT_TESTING: 'edit_testing',
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

export type PermissionRequirement =
  | { permission: Permission }
  | { anyOf: Permission[] }
  | { allOf: Permission[] }

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

/**
 * Check if user has a specific permission
 */
export function $hasPermission(userPermissions: Permission[], required: Permission): boolean {
  return userPermissions.includes(required)
}

/**
 * Check if user has ANY of the given permissions
 */
export function $hasAnyPermission(userPermissions: Permission[], required: Permission[]): boolean {
  return required.some(p => userPermissions.includes(p))
}

/**
 * Check if user has ALL of the given permissions
 */
export function $hasAllPermissions(userPermissions: Permission[], required: Permission[]): boolean {
  return required.every(p => userPermissions.includes(p))
}

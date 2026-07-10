import type { Permission, PermissionRequirement } from '@/auth'

// You can now use this utility for `Check Permissions`
export const checkPermissions = (
  userPermissions: Permission[],
  permissionRequirement: PermissionRequirement,
): boolean => {
  if ('permission' in permissionRequirement) {
    return $hasPermission(userPermissions, permissionRequirement.permission)
  }
  if ('anyOf' in permissionRequirement) {
    return $hasAnyPermission(userPermissions, permissionRequirement.anyOf)
  }
  if ('allOf' in permissionRequirement) {
    return $hasAllPermissions(userPermissions, permissionRequirement.allOf)
  }
  return false
}

// Check if user has a specific permission
export function $hasPermission(userPermissions: Permission[], required: Permission): boolean {
  return userPermissions.includes(required)
}

// Check if user has ANY of the given permissions
export function $hasAnyPermission(userPermissions: Permission[], required: Permission[]): boolean {
  return required.some(p => userPermissions.includes(p))
}

// Check if user has ALL of the given permissions
export function $hasAllPermissions(userPermissions: Permission[], required: Permission[]): boolean {
  return required.every(p => userPermissions.includes(p))
}

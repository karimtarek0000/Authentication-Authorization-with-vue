import { userAuth, type Permission, type PermissionRequirement } from '@/auth'

// Check if user has a specific permission
function $hasPermission(userPermissions: Permission[], required: Permission): boolean {
  return userPermissions.includes(required)
}

// Check if user has ANY of the given permissions
function $hasAnyPermission(userPermissions: Permission[], required: Permission[]): boolean {
  return required.some(p => userPermissions.includes(p))
}

// Check if user has ALL of the given permissions
function $hasAllPermissions(userPermissions: Permission[], required: Permission[]): boolean {
  return required.every(p => userPermissions.includes(p))
}

const checkPermissions = (
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

// You can now use this utility for `Check Permissions`
export const $checkPermissions = (permissionRequirement: PermissionRequirement) => {
  return checkPermissions(userAuth.permissions, permissionRequirement)
}

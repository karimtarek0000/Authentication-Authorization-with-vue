import { $checkPermissions } from '@/auth'

export const aboutGuard = async (_: any, __: any, next: any) => {
  const hasPermissions = $checkPermissions({
    permission: 'edit_testing',
  })

  if (!hasPermissions) {
    return next('/')
  }

  next()
}

export const testGuard = async (_: any, __: any, next: any) => {
  const hasPermissions = $checkPermissions({
    anyOf: ['edit_profile', 'edit_testing'],
  })

  if (!hasPermissions) {
    return next('/')
  }

  next()
}

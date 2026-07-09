import { checkPermissions, userAuth } from '@/auth'

export const aboutLoader = async (_: any, __: any, next: any) => {
  const hasPermissions = checkPermissions(userAuth.permissions, {
    permission: 'edit_testing',
  })

  if (!hasPermissions) {
    return next('/')
  }

  next()
}

export const testLoader = async (_: any, __: any, next: any) => {
  const hasPermissions = checkPermissions(userAuth.permissions, {
    anyOf: ['edit_profile', 'edit_testing'],
  })

  if (!hasPermissions) {
    return next('/')
  }

  next()
}

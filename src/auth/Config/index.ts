export const LOGIN = '/auth-test'
export const REFRESH_TOKEN = `${import.meta.env.VITE_API_URL}/refresh`
export const PROFILE = '/me'
export const OAUTH_PLATFORM = {
  google: '/auth/google',
  github: '/auth/github',
} as const

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
export const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID

export const GOOGLE_AUTHORIZE_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
export const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize'

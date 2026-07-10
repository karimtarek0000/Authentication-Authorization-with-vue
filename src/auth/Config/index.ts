export const LOGIN = '/auth-test'
export const REFRESH_TOKEN = `${import.meta.env.VITE_API_URL}/refresh`
export const PROFILE = '/me'

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
export const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID

export const GOOGLE_AUTHORIZE_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
export const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize'

// Backend exchange endpoints, resolved against `api`'s baseURL like LOGIN/PROFILE
export const OAUTH_GOOGLE = '/auth/google'
export const OAUTH_GITHUB = '/auth/github'

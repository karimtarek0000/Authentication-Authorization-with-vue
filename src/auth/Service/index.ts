import {
  api,
  authChannel,
  getOAuthRedirectURL,
  handleError,
  LOGIN,
  OAUTH_GITHUB,
  OAUTH_GOOGLE,
  PROFILE,
  REFRESH_TOKEN,
  useIdle,
  type IUserAuth,
  type Login,
  type OAuthProvider,
} from '@/auth'
import router from '@/router'
import type { AxiosError } from 'axios'
import axios from 'axios'
import { reactive, watch } from 'vue'

const initialData = {
  accessToken: '',
  userInfo: { id: '', name: '', email: '' },
  permissions: [],
  role: '',
  isAuth: false,
  hasAuth: localStorage.getItem('hasAuth'),
}

const resetUserAuth = () => {
  Object.assign(userAuth, initialData)
  localStorage.removeItem('hasAuth')
}

export const userAuth = reactive<IUserAuth>(initialData)

let restorePromise: Promise<null | undefined> | null = null
let refreshPromise: Promise<null | undefined> | null = null

export const useAuthService = () => {
  const { setIdle } = useIdle()

  const login = async ({ email, password }: Login) => {
    try {
      const { data } = await api.post(LOGIN, { email, password })

      setAuthData(data)
    } catch (error) {
      throw handleError(error as AxiosError)
    }
  }

  const loginWithOAuth = async (provider: OAuthProvider, code: string) => {
    try {
      const endpoint = provider === 'google' ? OAUTH_GOOGLE : OAUTH_GITHUB

      const { data } = await api.post(endpoint, {
        code,
        redirectURL: getOAuthRedirectURL(provider),
      })

      setAuthData(data)
    } catch (error) {
      throw handleError(error as AxiosError)
    }
  }

  const setAuthData = (data: any) => {
    const { id, name, email, ...info } = data

    Object.assign(userAuth, {
      accessToken: info.accessToken,
      role: info.role,
      userInfo: { id, name, email },
      permissions: info.permissions,
      isAuth: true,
    })

    localStorage.setItem('hasAuth', 'true')

    router.replace('/')
  }

  const logout = () => {
    resetUserAuth()
    authChannel.broadcast('logout')
    location.reload()
  }

  const refreshToken = async () => {
    if (!userAuth.hasAuth) return null

    if (refreshPromise) return refreshPromise

    refreshPromise = (async () => {
      try {
        const { data } = await axios.post(REFRESH_TOKEN, {}, { withCredentials: true })
        userAuth.accessToken = data.accessToken
        return data.accessToken
      } catch (error) {
        logout()
        throw handleError(error as AxiosError)
      } finally {
        refreshPromise = null
      }
    })()

    return refreshPromise
  }

  const restoreUserInfo = async () => {
    try {
      const { data } = await api.get(PROFILE)

      Object.assign(userAuth, {
        role: data.role,
        userInfo: { id: data.id, name: data.name, email: data.email },
        permissions: data.permissions,
        isAuth: true,
      })
    } catch (error) {
      logout()
      throw handleError(error as AxiosError)
    }
  }

  const restoreSession = async () => {
    if (!userAuth.hasAuth) return null

    if (restorePromise) return restorePromise

    restorePromise = (async () => {
      try {
        const token = await refreshToken()

        if (!token) return null

        await restoreUserInfo()
      } catch {}
    })()

    return restorePromise
  }

  watch(
    () => userAuth.isAuth,
    () => setIdle(),
  )

  return { login, loginWithOAuth, logout, refreshToken, restoreSession }
}

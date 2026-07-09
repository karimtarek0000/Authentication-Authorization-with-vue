import { api, handleError, LOGIN, PROFILE, REFRESH_TOKEN, type Permission } from '@/auth'
import router from '@/router'
import type { AxiosError } from 'axios'
import axios from 'axios'
import { reactive } from 'vue'

interface Login {
  email: string
  password: string
}

interface IUserAuth {
  accessToken: string
  userInfo: { id: string; name: string; email: string }
  permissions: Permission[]
  role: string
  isAuth: boolean
  hasAuth: string | null
}

const initialData = {
  accessToken: '',
  userInfo: { id: '', name: '', email: '' },
  permissions: [],
  role: '',
  isAuth: false,
  hasAuth: sessionStorage.getItem('hasAuth'),
}

const resetUserAuth = () => {
  Object.assign(userAuth, initialData)
  sessionStorage.removeItem('hasAuth')
}

export const userAuth = reactive<IUserAuth>(initialData)

let restorePromise: Promise<null | undefined> | null = null
let refreshPromise: Promise<null | undefined> | null = null

export const useAuthService = () => {
  const login = async ({ email, password }: Login) => {
    try {
      const {
        data: { id, name, ...info },
      } = await api.post(LOGIN, { email, password })

      Object.assign(userAuth, {
        accessToken: info.accessToken,
        role: info.role,
        userInfo: { id, name, email },
        permissions: info.permissions,
        isAuth: true,
      })

      sessionStorage.setItem('hasAuth', 'true')

      router.replace('/home')
    } catch (error) {
      throw handleError(error as AxiosError)
    }
  }

  const logout = () => {
    resetUserAuth()
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

  return { login, logout, refreshToken, restoreSession }
}

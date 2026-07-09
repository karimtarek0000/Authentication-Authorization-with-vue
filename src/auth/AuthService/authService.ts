import { api, handleError, LOGIN, REFRESH_TOKEN } from '@/auth'
import router from '@/router'
import type { AxiosError } from 'axios'
import axios from 'axios'
import { ref } from 'vue'

interface Login {
  email: string
  password: string
}

export const accessToken = ref('')
export const userInfo = ref({})
export const permissions = ref<string[]>([])
export const role = ref('')
export const isAuth = ref(false)
export const hasAuth = ref(sessionStorage.getItem('hasAuth'))

const initialData = () => {
  accessToken.value = ''
  permissions.value = []
  userInfo.value = {}
  role.value = ''
  isAuth.value = false

  sessionStorage.removeItem('hasAuth')
}

let restorePromise: Promise<null | undefined> | null = null
let refreshPromise: Promise<null | undefined> | null = null

export const useAuthService = () => {
  const login = async ({ email, password }: Login) => {
    try {
      const {
        data: { id, name, ...info },
      } = await api.post(LOGIN, { email, password })

      accessToken.value = info.accessToken
      role.value = info.role
      userInfo.value = { id, name, email }
      permissions.value = info.permissions
      isAuth.value = true

      sessionStorage.setItem('hasAuth', 'true')

      router.replace('/home')
    } catch (error) {
      throw handleError(error as AxiosError)
    }
  }

  const logout = () => {
    initialData()
  }

  const refreshToken = async () => {
    if (!hasAuth.value) return null

    if (refreshPromise) return refreshPromise

    refreshPromise = (async () => {
      try {
        const { data } = await axios.post(REFRESH_TOKEN, {}, { withCredentials: true })
        accessToken.value = data.accessToken
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
      const { data } = await api.get('/me')

      role.value = data.role
      userInfo.value = { id: data.id, name: data.name, email: data.email }
      permissions.value = data.permissions
      isAuth.value = true
    } catch (error) {
      logout()
      throw handleError(error as AxiosError)
    }
  }

  const restoreSession = async () => {
    if (!hasAuth.value) return null

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

  return { login, refreshToken, restoreSession }
}

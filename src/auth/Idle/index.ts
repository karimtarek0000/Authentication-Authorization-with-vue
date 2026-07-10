import { logout, userAuth } from '@/auth'
import { onScopeDispose, ref, type Ref } from 'vue'

const IDLE_LIMIT = 15 * 60 * 1000 // 15 minutes
const THROTTLE_INTERVAL = 5000
const ACTIVITY_EVENTS: string[] = ['keydown', 'click', 'scroll', 'touchstart', 'mousemove']

type ResetTimerFn = () => void

export const useIdle = () => {
  const logoutTimerRef: Ref<ReturnType<typeof setTimeout> | null> = ref(null)
  const lastResetRef: Ref<number> = ref<number>(0)
  let resetTimer: ResetTimerFn | null = null

  const setIdle = async () => {
    if (!userAuth.isAuth) return

    lastResetRef.value = Date.now()

    resetTimer = (): void => {
      const now: number = Date.now()

      if (now - lastResetRef.value < THROTTLE_INTERVAL) return
      lastResetRef.value = now

      if (logoutTimerRef.value) clearTimeout(logoutTimerRef.value)

      logoutTimerRef.value = setTimeout(logout, IDLE_LIMIT)
    }

    resetTimer()

    ACTIVITY_EVENTS.forEach((event: string) => {
      window.addEventListener(event, resetTimer as EventListener, { passive: true })
    })
  }

  onScopeDispose(() => {
    if (logoutTimerRef.value) {
      clearTimeout(logoutTimerRef.value)
    }

    ACTIVITY_EVENTS.forEach((event: string) => {
      window.removeEventListener(event, resetTimer as EventListener)
    })
  })

  return { setIdle }
}

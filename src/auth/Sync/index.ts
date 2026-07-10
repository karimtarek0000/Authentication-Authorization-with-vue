type AuthEvent = 'logout'

const channel = new BroadcastChannel('auth')

export const authChannel = {
  broadcast: (event: AuthEvent) => {
    channel.postMessage(event)
  },

  subscribe: (handler: (event: AuthEvent) => void) => {
    const listener = (e: MessageEvent<AuthEvent>) => handler(e.data)
    channel.addEventListener('message', listener)
    return () => channel.removeEventListener('message', listener)
  },
}

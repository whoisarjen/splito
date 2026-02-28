export interface User {
  id: string
  email: string
  name: string
  avatar: string | null
  defaultCurrency: string
  locale: string
}

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

export function useAuth() {
  const authState = useState<AuthState>('auth', () => ({
    user: null,
    loading: true,
    error: null,
  }))

  const user = computed(() => authState.value.user)
  const loading = computed(() => authState.value.loading)
  const error = computed(() => authState.value.error)
  const isAuthenticated = computed(() => !!authState.value.user)

  async function fetchUser() {
    authState.value.loading = true
    authState.value.error = null

    try {
      const data = await $fetch<User>('/api/auth/me')
      authState.value.user = data
    } catch (err: any) {
      if (err.statusCode !== 401) {
        authState.value.error = 'Failed to fetch user'
      }
      authState.value.user = null
    } finally {
      authState.value.loading = false
    }
  }

  function signIn() {
    window.location.href = '/api/auth/google'
  }

  async function signOut() {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
      authState.value.user = null
      navigateTo('/')
    } catch (err) {
      console.error('Sign out error:', err)
    }
  }

  function checkOAuthError() {
    if (import.meta.client) {
      const params = new URLSearchParams(window.location.search)
      const error = params.get('error')
      if (error) {
        authState.value.error = `Authentication failed: ${error.replace(/_/g, ' ')}`
        // Clean URL
        window.history.replaceState({}, '', window.location.pathname)
      }
    }
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    fetchUser,
    signIn,
    signOut,
    checkOAuthError,
  }
}

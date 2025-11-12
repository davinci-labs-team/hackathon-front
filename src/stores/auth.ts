import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: (): { user: SupabaseDecodedUser | null } => ({
    user: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
  },
  actions: {
    login(userData: SupabaseDecodedUser) {
      this.user = userData
      localStorage.setItem('authUser', JSON.stringify(userData))
    },
    logout() {
      this.user = null
      localStorage.removeItem('authUser')
    },
    loadAuth() {
      const data = localStorage.getItem('authUser')
      if (data) {
        this.user = JSON.parse(data)
      }
    },
    updateAccessToken(newAccessToken: string) {
      if (this.user) {
        this.user.accessToken = newAccessToken
        localStorage.setItem('authUser', JSON.stringify(this.user))
      }
    },
  },
})


export function getAuthHeaders() {
  const authStore = useAuthStore()
  if (!authStore.user?.accessToken) {
    throw new Error('User is not authenticated')
  }
  return {
    Authorization: `Bearer ${authStore.user.accessToken}`,
  }
}
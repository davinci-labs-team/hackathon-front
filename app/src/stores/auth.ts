import { defineStore } from 'pinia'
import { UserRole } from '@/types/roles'

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
  },
})

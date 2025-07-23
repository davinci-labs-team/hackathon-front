import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as null | { name: string; role: 'organizer' | 'user' },
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
    userRole: (state) => state.user?.role,
  },
  actions: {
    login(userData) {
      this.user = userData
    },
    logout() {
      this.user = null
    },
  },
})

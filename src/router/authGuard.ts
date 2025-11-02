import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { UserRole } from '@/types/roles'

export function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore()
  authStore.loadAuth()

  const requiresAuth = to.meta.requiresAuth as boolean | undefined
  const requiredRole = to.meta.role as string | undefined

  if (requiresAuth && !authStore.isAuthenticated) {
    // Redirige vers le login adapté selon le rôle attendu
    if (requiredRole === UserRole.ORGANIZER) {
      return next({ name: 'AdminLogin' })
    } else {
      return next({ name: 'Login' })
    }
  }

  if (requiresAuth && requiredRole === UserRole.ORGANIZER) {
    const userRole = authStore.user?.role || ''
    if (userRole !== UserRole.ORGANIZER) {
      return next({ name: 'AdminLogin' })
    }
  }

  next()
}

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
  const requiredRole = to.meta.role as UserRole | undefined
  const allowedRoles = to.meta.roles as UserRole[] | undefined

  if (requiresAuth) {

    if (!authStore.isAuthenticated) {
      // Redirige vers le login adapté selon le rôle attendu
      if (requiredRole === UserRole.ORGANIZER) {
        return next({ name: 'AdminLogin' })
      } else {
        return next({ name: 'Login' })
      }
    }

    const userRole = authStore.user?.role || UserRole.PARTICIPANT

    if (requiredRole && userRole !== requiredRole) {
      // Si l'utilisateur n'a pas le rôle requis, redirige vers la page précédente ou vers le login adapté
      if (from.name && from.fullPath !== to.fullPath) {
        return next(from.fullPath)
      } else if (requiredRole === UserRole.ORGANIZER) {
        return next({ name: 'AdminLogin' })
      } else {
        return next({ name: 'Login' })
      }
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
      // Si l'utilisateur n'a pas le rôle requis, redirige vers la page précédente ou vers le login
      if (from.name && from.fullPath !== to.fullPath) {
        return next(from.fullPath)
      } else {
        return next({ name: 'Login' })
      }
    }
  }

  next()
}

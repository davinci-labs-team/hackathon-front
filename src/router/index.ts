import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import publicRoutes from './routes/public'
import organizerRoutes from './routes/organizer'
import userRoutes from './routes/user'
import expertRoutes from './routes/expert'
import { authGuard } from './authGuard'
import TermsAndConditions from '@/pages/legal/TermsAndConditions.vue'
import PrivacyPolicy from '@/pages/legal/PrivacyPolicy.vue'

const routes: RouteRecordRaw[] = [
  ...publicRoutes,
  ...organizerRoutes,
  ...userRoutes,
  ...expertRoutes,
  {
    path: '/terms',
    name: 'terms',
    component: TermsAndConditions,
  },
  {
    path: '/privacy',
    name: 'privacy',
    component: PrivacyPolicy,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(authGuard)

export default router

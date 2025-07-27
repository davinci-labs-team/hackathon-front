import OrganizerLayout from '@/layouts/OrganizerLayout.vue'
import { UserRole } from '@/types/roles'

export default [
  {
    path: '/organizer',
    component: OrganizerLayout,
    children: [
      {
        path: 'dashboard',
        name: 'OrganizerDashboard',
        component: () => import('../../pages/organizer/Dashboard.vue'),
        meta: { requiresAuth: true, role: UserRole.ORGANIZER },
      },
    ],
  },
  {
    path: '/admin-login',
    name: 'AdminLogin',
    component: () => import('../../pages/organizer/AdminLogin.vue'),
  },
]

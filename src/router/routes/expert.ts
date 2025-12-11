import { UserRole } from '@/types/roles'
import Dashboard from '@/pages/expert/Dashboard.vue'
import Team from '@/pages/expert/Team.vue'
import Project from '@/pages/expert/Project.vue'
import FAQ from '@/pages/expert/FAQ.vue'
import Profile from '@/pages/common/Profile.vue'
import ExpertLayout from '@/layouts/ExpertLayout.vue'

export default [
  {
    path: '/expert',
    component: ExpertLayout,
    children: [
      {
        path: '',
        redirect: { name: 'ExpertDashboard' }
      },
      {
        path: 'dashboard',
        name: 'ExpertDashboard',
        component: Dashboard,
        meta: { requiresAuth: true, roles: [UserRole.JURY, UserRole.ORGANIZER, UserRole.MENTOR] },
      },
      {
        path: 'team',
        name: 'ExpertTeamPage',
        component: Team,
        meta: { requiresAuth: true, roles: [UserRole.JURY, UserRole.ORGANIZER, UserRole.MENTOR] },
      },
      {
        path: 'project',
        name: 'ExpertProjectPage',
        component: Project,
        meta: { requiresAuth: true, roles: [UserRole.JURY, UserRole.ORGANIZER, UserRole.MENTOR] },
      },
      {
        path: 'faq',
        name: 'ExpertFaqPage',
        component: FAQ,
        meta: { requiresAuth: true, roles: [UserRole.JURY, UserRole.ORGANIZER, UserRole.MENTOR] },
      },
      {
        path: 'profile',
        name: 'ExpertProfilePage',
        component: Profile,
        meta: { requiresAuth: true },
      },
    ],
  },
]

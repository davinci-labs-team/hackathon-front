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
        path: 'dashboard',
        name: 'JuryDashboard',
        component: Dashboard,
        meta: { requiresAuth: true, roles: [UserRole.JURY, UserRole.ORGANIZER, UserRole.MENTOR] },
      },
      {
        path: 'team',
        name: 'TeamPage',
        component: Team,
        meta: { requiresAuth: true, roles: [UserRole.JURY, UserRole.ORGANIZER, UserRole.MENTOR] },
      },
      {
        path: 'project',
        name: 'ProjectPage',
        component: Project,
        meta: { requiresAuth: true, roles: [UserRole.JURY, UserRole.ORGANIZER, UserRole.MENTOR] },
      },
      {
        path: 'faq',
        name: 'FaqPage',
        component: FAQ,
        meta: { requiresAuth: true, roles: [UserRole.JURY, UserRole.ORGANIZER, UserRole.MENTOR] },
      },
      {
        path: 'profile',
        name: 'OrganizerProfilePage',
        component: Profile,
        meta: { requiresAuth: true },
      },
    ],
  },
]

import { UserRole } from '@/types/roles'
import Dashboard from '@/pages/common/Dashboard.vue'
import Teams from '@/pages/expert/Teams.vue'
import Project from '@/pages/expert/Project.vue'
import FAQ from '@/pages/common/FAQ.vue'
import Profile from '@/pages/common/Profile.vue'
import ExpertLayout from '@/layouts/ExpertLayout.vue'
import Announcements from '@/pages/common/Announcements.vue'

export default [
  {
    path: '/expert',
    component: ExpertLayout,
    children: [
      {
        path: '',
        redirect: { name: 'ExpertDashboard' },
      },
      {
        path: 'dashboard',
        name: 'ExpertDashboard',
        component: Dashboard,
        meta: { requiresAuth: true, roles: [UserRole.JURY, UserRole.ORGANIZER, UserRole.MENTOR] },
      },
      {
        path: 'announcements',
        name: 'ExpertAnnouncements',
        component: Announcements,
        meta: { requiresAuth: true, roles: [UserRole.JURY, UserRole.ORGANIZER, UserRole.MENTOR] },
      },
      {
        path: 'teams',
        name: 'ExpertTeamsPage',
        component: Teams,
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
        meta: { requiresAuth: true, roles: [UserRole.JURY, UserRole.ORGANIZER, UserRole.MENTOR] },
      },
    ],
  },
]

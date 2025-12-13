import OrganizerLayout from '@/layouts/OrganizerLayout.vue'
import { UserRole } from '@/types/roles'
import UserManagement from '@/pages/organizer/UserManagement.vue'
import TeamManagement from '@/pages/organizer/TeamManagement.vue'
import SubmissionManagement from '@/pages/organizer/SubmissionManagement.vue'
import Settings from '@/pages/organizer/Settings.vue'
import Profile from '@/pages/common/Profile.vue'
import Announcements from '@/pages/common/Announcements.vue'
import ThemesManagement from '@/pages/organizer/ThemesManagement.vue'
import FAQ from '@/pages/organizer/FAQ.vue'
import HackathonManagement from '@/pages/organizer/HackathonManagement.vue'

export default [
  {
    path: '/organizer',
    component: OrganizerLayout,
    children: [
      {
        path: '',
        redirect: { name: 'HackathonManagement' }
      },
      {
        path: 'hackathon',
        name: 'HackathonManagement',
        component: HackathonManagement,
        meta: { requiresAuth: true, role: UserRole.ORGANIZER },
      },
      {
        path: 'announcements',
        name: 'Announcements',
        component: Announcements,
        meta: { requiresAuth: true, role: UserRole.ORGANIZER },
      },
      {
        path: 'faq',
        name: 'FAQ',
        component: FAQ,
        meta: { requiresAuth: true, role: UserRole.ORGANIZER },
      },
      {
        path: 'users',
        name: 'UsersManagement',
        component: UserManagement,
        meta: { requiresAuth: true, role: UserRole.ORGANIZER },
      },
      {
        path: 'teams',
        name: 'TeamsManagement',
        component: TeamManagement,
        meta: { requiresAuth: true, role: UserRole.ORGANIZER },
      },
      {
        path: 'projects',
        name: 'ProjectsManagement',
        component: SubmissionManagement,
        meta: { requiresAuth: true, role: UserRole.ORGANIZER },
      },
      {
        path: 'settings',
        name: 'OrganizerSettings',
        component: Settings,
        meta: { requiresAuth: true, role: UserRole.ORGANIZER },
      },
      {
        path: 'profile',
        name: 'OrganizerProfilePage',
        component: Profile,
        meta: { requiresAuth: true, role: UserRole.ORGANIZER },
      },
      {
        path: 'themes',
        name: 'ThemesManagement',
        component: ThemesManagement,
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

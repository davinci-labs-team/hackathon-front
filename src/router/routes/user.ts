import UserLayout from '@/layouts/UserLayout.vue'
import Dashboard from '@/pages/user/Dashboard.vue'
import Team from '@/pages/user/Team.vue'
import Project from '@/pages/user/Project.vue'
import FAQ from '@/pages/user/FAQ.vue'
import Profile from '@/pages/common/Profile.vue'
import Announcements from '@/pages/common/Announcements.vue'

export default [
  {
    path: '/user',
    component: UserLayout,
    children: [
      {
        path: '',
        redirect: { name: 'UserDashboard' }
      },
      {
        path: 'dashboard',
        name: 'UserDashboard',
        component: Dashboard,
        meta: { requiresAuth: true },
      },
      {
        path: 'announcements',
        name: 'UserAnnouncements',
        component: Announcements,
        meta: { requiresAuth: true },
      },
      {
        path: 'team',
        name: 'TeamPage',
        component: Team,
        meta: { requiresAuth: true },
      },
      {
        path: 'project',
        name: 'ProjectPage',
        component: Project,
        meta: { requiresAuth: true },
      },
      {
        path: 'faq',
        name: 'FaqPage',
        component: FAQ,
        meta: { requiresAuth: true },
      },
      {
        path: 'profile',
        name: 'ProfilePage',
        component: Profile,
        meta: { requiresAuth: true },
      },
    ],
  },
]

import UserLayout from '../../layouts/UserLayout.vue'

export default [
  {
    path: '/user',
    component: UserLayout,
    children: [
      {
        path: 'dashboard',
        name: 'UserDashboard',
        component: () => import('../../pages/user/Dashboard.vue'),
      },
    ],
  },
]

import OrganizerLayout from '../../layouts/OrganizerLayout.vue'

export default [
  {
    path: '/organizer',
    component: OrganizerLayout,
    children: [
      {
        path: 'dashboard',
        name: 'OrganizerDashboard',
        component: () => import('../../pages/organizer/Dashboard.vue')
      }
    ]
  }
]

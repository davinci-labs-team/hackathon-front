import PublicLayout from '../../layouts/PublicLayout.vue'

export default [
  {
    path: '/',
    component: PublicLayout,
    children: [
      { path: '', name: 'Home', component: () => import('../../pages/public/Home.vue') },
      { path: 'login', name: 'Login', component: () => import('../../pages/public/Login.vue') }
    ]
  }
]

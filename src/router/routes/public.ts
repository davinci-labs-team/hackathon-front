import PublicLayout from '../../layouts/PublicLayout.vue'

export default [
  {
    path: '/',
    component: PublicLayout,
    children: [
      { path: '', name: 'Home', component: () => import('../../pages/public/Home.vue') },
      { path: 'login', name: 'Login', component: () => import('../../pages/public/Login.vue') },
      { path: 'first-login', name: 'FirstLogin', component: () => import('../../pages/public/FirstLogin.vue') },
      { path: 'reset-password', name: 'ResetPassword', component: () => import('../../pages/public/ResetPassword.vue') },
    ],
  },
]

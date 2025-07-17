import { createRouter, createWebHistory } from 'vue-router'
import publicRoutes from './routes/public'
import organizerRoutes from './routes/organizer'
import userRoutes from './routes/user'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...publicRoutes,
    ...organizerRoutes,
    ...userRoutes,
  ]
})

export default router

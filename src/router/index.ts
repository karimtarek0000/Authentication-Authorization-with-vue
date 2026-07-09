import { restoreSession, userAuth } from '@/auth'
import HomePage from '@/pages/HomePage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import SignupPage from '@/pages/SignupPage.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignupPage,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const protectedRoutes = ['/', '/home']

router.beforeEach(async (to, _, next) => {
  await restoreSession()

  const isAuth = userAuth.isAuth

  if (to.path === '/login' && isAuth) {
    return next('/')
  }

  if (protectedRoutes.includes(to.path) && !isAuth) {
    return next('/login')
  }

  next()
})

export default router

import { restoreSession, userAuth } from '@/auth'
import AboutPage from '@/pages/AboutPage.vue'
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
    path: '/about',
    name: 'about',
    component: AboutPage,
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

const publicRoutes = ['/about', '/login']

router.beforeEach(async (to, _, next) => {
  await restoreSession()

  const isAuth = userAuth.isAuth

  if (!publicRoutes.includes(to.path) && !isAuth) {
    return next('/login')
  }

  if (to.path === '/login' && isAuth) {
    return next('/')
  }

  next()
})

export default router

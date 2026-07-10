import { abortAllApiRequests, aboutGuard, restoreSession, testGuard, userAuth } from '@/auth'
import AboutPage from '@/pages/AboutPage.vue'
import HomePage from '@/pages/HomePage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import OAuthCallbackPage from '@/pages/OAuthCallbackPage.vue'
import SignupPage from '@/pages/SignupPage.vue'
import TestPage from '@/pages/TestPage.vue'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
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
    beforeEnter: aboutGuard,
  },
  {
    path: '/test',
    name: 'test',
    component: TestPage,
    beforeEnter: testGuard,
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
  {
    path: '/auth/callback/:provider',
    name: 'oauth-callback',
    component: OAuthCallbackPage,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const publicRoutes = ['/login', '/signup']

router.beforeEach(async (to, from, next) => {
  await restoreSession()

  const isAuth = userAuth.isAuth
  const isPublic = publicRoutes.includes(to.path) || to.name === 'oauth-callback'

  // Abort requests immeditely if user changes the page
  if (to.path !== from.path) {
    abortAllApiRequests()
  }

  if (!isPublic && !isAuth) {
    return next(`/login?page=${to.path}`)
  }

  if (isPublic && isAuth && to.name === 'oauth-callback') {
    return next('/')
  }

  next()
})

export default router

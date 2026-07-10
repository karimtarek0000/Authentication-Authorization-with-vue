import { abortAllApiRequests, aboutGuard, restoreSession, testGuard, userAuth } from '@/auth'
import AboutPage from '@/pages/AboutPage.vue'
import HomePage from '@/pages/HomePage.vue'
import LandingPage from '@/pages/LandingPage.vue'
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
    meta: {
      protectRoute: true,
    },
  },
  {
    path: '/landing',
    name: 'landing',
    component: LandingPage,
  },
  {
    path: '/about',
    name: 'about',
    component: AboutPage,
    beforeEnter: aboutGuard,
    meta: {
      protectRoute: true,
    },
  },
  {
    path: '/test',
    name: 'test',
    component: TestPage,
    beforeEnter: testGuard,
    meta: {
      protectRoute: true,
    },
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: {
      authRoute: true,
    },
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignupPage,
    meta: {
      authRoute: true,
    },
  },
  {
    path: '/auth/callback/:provider',
    name: 'oauth-callback',
    component: OAuthCallbackPage,
    meta: {
      authRoute: true,
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  await restoreSession()

  const isAuth = userAuth.isAuth
  const isAuthRoute = to.matched[0].meta.authRoute
  const protectedRoute = to.matched[0].meta.protectRoute

  // Abort requests immeditely if user changes the page
  if (to.path !== from.path) {
    abortAllApiRequests()
  }

  if (protectedRoute && !isAuth) {
    return next(`/login?page=${to.path}`)
  }

  if (isAuthRoute && isAuth) {
    return next('/')
  }

  next()
})

export default router

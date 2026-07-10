import { abortAllApiRequests, aboutGuard, restoreSession, testGuard, userAuth } from '@/auth'
import Dashboard from '@/layouts/Dashboard.vue'
import AboutPage from '@/pages/AboutPage.vue'
import HomePage from '@/pages/HomePage.vue'
import LandingPage from '@/pages/LandingPage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import NotFound from '@/pages/NotFound.vue'
import OAuthCallbackPage from '@/pages/OAuthCallbackPage.vue'
import SignupPage from '@/pages/SignupPage.vue'
import TestPage from '@/pages/TestPage.vue'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/landing',
    name: 'landing',
    component: LandingPage,
  },
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: {
      protectRoute: true,
    },
    children: [
      {
        path: '',
        name: 'home',
        component: HomePage,
      },
      {
        path: 'about',
        name: 'about',
        component: AboutPage,
        beforeEnter: aboutGuard,
      },
      {
        path: 'test',
        name: 'test',
        component: TestPage,
        beforeEnter: testGuard,
      },
    ],
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
  {
    path: '/:pathMatch(.*)*',
    component: NotFound,
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
  console.log(to.matched[0].meta)

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

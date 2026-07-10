import { abortAllApiRequests, aboutGuard, restoreSession, testGuard, userAuth } from '@/auth'
import { Auth, Dashboard } from '@/layouts'
import {
  AboutPage,
  HomePage,
  LandingPage,
  LoginPage,
  NotFound,
  OAuthCallbackPage,
  SignupPage,
  TestPage,
} from '@/pages'
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
    path: '/auth',
    component: Auth,
    meta: {
      authRoute: true,
    },
    children: [
      {
        path: 'login',
        name: 'login',
        component: LoginPage,
      },
      {
        path: 'signup',
        name: 'signup',
        component: SignupPage,
      },
      {
        path: 'callback/:provider',
        name: 'oauth-callback',
        component: OAuthCallbackPage,
      },
    ],
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
  const isProtectedRoute = to.matched[0].meta.protectRoute

  // Abort requests immeditely if user changes the page
  if (to.path !== from.path) {
    abortAllApiRequests()
  }

  if (isProtectedRoute && !isAuth) {
    return next(`/auth/login?page=${to.path}`)
  }

  if (isAuthRoute && isAuth) {
    return next('/')
  }

  next()
})

export default router

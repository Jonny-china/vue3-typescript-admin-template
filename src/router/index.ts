import { markRaw } from 'vue'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import LayoutVue from '@/layout/index.vue'
const Layout = markRaw(LayoutVue)

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    hidden: true
  }
]

export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/login2',
    name: 'Login2',
    component: () => import('@/views/login/index.vue'),
    hidden: true
  },
  {
    path: '/clipboard',
    component: Layout,
    redirect: '/clipboard/index',
    children: [
      {
        path: '/clipboard/index',
        component: () => import('@/views/clipboard/index.vue'),
        name: 'Clipboard',
        meta: { title: 'clipboard', icon: 'clipboard' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: (to, from, savedPosition) => {
    return savedPosition ?? { left: 0, top: 0 }
  },
  routes: constantRoutes
})

export function resetRouter() {
  asyncRoutes.forEach(route => {
    router.removeRoute(route.name as string)
  })
}

export default router

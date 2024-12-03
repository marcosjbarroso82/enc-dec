import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from './views/Home.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: Home
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  strict: true
})

// Global navigation error handler
router.onError((error) => {
  console.error('Router navigation error:', error)
})

// Add navigation guards to handle query parameters
router.beforeEach((to, from, next) => {
  // Preserve query parameters during navigation
  if (Object.keys(to.query).length === 0 && Object.keys(from.query).length > 0) {
    next({ ...to, query: from.query })
    return
  }
  next()
})
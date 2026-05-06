import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
  },
  {
    path: '/rooms',
    name: 'Rooms',
    component: () => import('../views/Rooms.vue'),
  },
  {
    path: '/invoices',
    name: 'Invoices',
    component: () => import('../views/Invoices.vue'),
  },
  {
    path: '/contracts',
    name: 'Contracts',
    component: () => import('../views/Contracts.vue'),
  },
  {
    path: '/reservations',
    name: 'Reservations',
    component: () => import('../views/Reservation.vue'),
  },
  {
    path: '/financial',
    name: 'Financial',
    component: () => import('../views/FinancialList.vue'),
  },
  {
    path: '/tenants',
    name: 'Tenants',
    component: () => import('../views/Tenants.vue'),
  },
  {
    path: '/buildings',
    name: 'Buildings',
    component: () => import('../views/Buildings.vue'),
  },
  {
    path: '/services',
    name: 'Services',
    component: () => import('../views/Services.vue'),
  },
  {
    path: '/assets',
    name: 'Assets',
    component: () => import('../views/Assets.vue'),
  },
  {
    path: '/staff',
    name: 'Staff',
    component: () => import('../views/Staff.vue'),
  },
  {
    path: '/maintenance',
    name: 'Maintenance',
    component: () => import('../views/MaintenanceRequest.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

//Thêm Guard
router.beforeEach(async(to, from, next) => {
  const authStore = useAuthStore()
  
  // Kiểm tra các trang cần đăng nhập
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const publicPages = ['/login', '/register']
  const authRequired = !publicPages.includes(to.path)
  const loggedIn = authStore.token
  if (authRequired && !loggedIn) {
    return next('/login')
  } 
  if (loggedIn && publicPages.includes(to.path)) {
    return next('/')
  }
  if (loggedIn && !authStore.user) {
    try {
      await authStore.fetchUser()
    } catch (error) {
      authStore.logout()
      return next('/login')
    }
  }

  //Kiểm tra quyền Admin cho trang Tổng quan
  if (to.path === '/' && authStore.user?.role !== 'admin') {
    return next('/rooms')
  }

  next()
})

export default router




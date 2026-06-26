import { defineStore } from 'pinia'
import api from '../axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
  }),
  
  actions: {
    async login(credentials) {
      const response = await api.post('/auth/login', credentials)
      
      if (response.data?.access_token || response.status === 'success') {
        this.token = response.data.access_token
        this.user = response.data.user
        localStorage.setItem('token', this.token)
        // Lưu role vào localStorage để các module khác (axios interceptor, dashboard) sử dụng
        if (response.data.user?.role) {
          localStorage.setItem('user_role', response.data.user.role)
        }
        return response
      }
      throw new Error(response.message || 'Login failed')
    },
    
    async register(userData) {
      const response = await api.post('/auth/register', userData)
      return response
    },
    
    async logout() {
      try {
        await api.post('/auth/logout')
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.token = null
        this.user = null
        localStorage.removeItem('token')
        localStorage.removeItem('user_role')
      }
    },
    
    async fetchUser() {
      if (!this.token) return
      try {
        const response = await api.get('/auth/me')
        this.user = response
        // Đồng bộ role vào localStorage sau khi fetch user profile
        if (response?.role) {
          localStorage.setItem('user_role', response.role)
        }
      } catch (error) {
        this.logout()
      }
    },
  },
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    userRole: (state) => state.user?.role || localStorage.getItem('user_role') || null,
  },
})

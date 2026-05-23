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
      }
    },
    
    async fetchUser() {
      if (!this.token) return
      try {
        const response = await api.get('/auth/me')
        this.user = response
      } catch (error) {
        this.logout()
      }
    },
  },
  
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
})

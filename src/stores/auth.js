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
      this.token = response.data.token
      this.user = response.data.user
      localStorage.setItem('token', this.token)
      return response.data
    },
    
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
    },
    
    async fetchUser() {
      if (!this.token) return
      const response = await api.get('/auth/user')
      this.user = response.data
    },
  },
  
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
})

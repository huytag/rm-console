import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css' 
import App from './App.vue'
import router from './router'
import axios from './axios'

import { useAuthStore } from './stores/auth'

const app = createApp(App)
const pinia=createPinia()



app.use(pinia)
app.use(router)
app.use(ElementPlus)

app.config.globalProperties.$axios = axios
// lấy lại thông tin user khi khởi động (nếu có token)
const authStore = useAuthStore(pinia)
if (authStore.token) {
    authStore.fetchUser()
}


app.mount('#app')



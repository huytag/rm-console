import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import axios from './axios'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.config.globalProperties.$axios = axios

app.mount('#app')

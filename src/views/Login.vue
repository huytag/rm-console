
<template>
  <div class="login-container">
    <div class="login-banner">
      <div class="banner-content">
        <h1>Rental Management System</h1>
        <p>Hệ thống quản lý phòng trọ chuyên nghiệp, tối ưu và hiệu quả dành riêng cho bạn.</p>
      </div>
    </div>
    <div class="login-form-wrapper">
      <div class="login-glass-card">
        <div class="form-header">
          <h2>Đăng nhập</h2>
        </div>
        
        <el-form :model="form" :rules="rules" ref="formRef" class="custom-form">
          <el-form-item prop="email">
            <el-input
              v-model="form.email"
              placeholder="Email của bạn"
              :prefix-icon="Message"
              size="large"
            />
          </el-form-item>
          
          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="Mật khẩu"
              :prefix-icon="Lock"
              show-password
              size="large"
            />
          </el-form-item>
          
          <div class="form-actions">
            <el-checkbox v-model="rememberMe">Nhớ mật khẩu</el-checkbox>
            <el-link type="primary" :underline="false" class="forgot-link">Quên mật khẩu?</el-link>
          </div>

          <el-form-item>
            <el-button
              type="primary"
              :loading="loading"
              class="submit-btn"
              size="large"
              @click="handleLogin" 
            >
              Đăng nhập
            </el-button>
          </el-form-item>
          <div class="register-prompt">
            <span>Chưa có tài khoản?</span>
            <el-link type="primary" :underline="false" class="register-link" @click="router.push('/register')">Đăng ký ngay</el-link>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { ElMessage } from 'element-plus'
import { Message, Lock } from '@element-plus/icons-vue'

const router = useRouter()
const authStore = useAuthStore()

const formRef = ref(null)
const loading = ref(false)
const form = ref({
  email: '',
  password: '',
})
const rememberMe = ref(false)

const rules = {
  email: [
    { required: true, message: 'Vui lòng nhập email', trigger: 'blur' },
    { type: 'email', message: 'Vui lòng nhập đúng định dạng email (vd: abc@example.com)', trigger: ['blur'] }
  ],
  password: [{ required: true, message: 'Vui lòng nhập mật khẩu', trigger: 'blur' }],
}

const handleLogin = async () => {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  
  loading.value = true
  try {
    const res = await authStore.login({
        email: form.value.email.trim(),
        password: form.value.password
    })
    if (res) {
      ElMessage.success('Đăng nhập thành công')
      setTimeout(() => {
        router.push('/')
      }, 500)
    }
  } catch (error) {
    console.error('Login error:', error)
  } finally {
    loading.value = false
  }
}

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.login-container {
  display: flex;
  height: 100vh;
  font-family: 'Inter', sans-serif;
  background-color: #f8fafc;
}

.login-banner {
  flex: 1;
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.8)), 
              url('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80') center/cover;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 40px;
  position: relative;
  overflow: hidden;
  border-radius: 20px;
}

.banner-content {
  position: relative;
  z-index: 2;
  max-width: 500px;
}

.banner-content h1 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 20px;
  line-height: 1.2;
  background: linear-gradient(to right, #ffffff, #94a3b8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.banner-content p {
  font-size: 1.2rem;
  color: #cbd5e1;
  line-height: 1.6;
}

.login-form-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
}

.login-glass-card {
  width: 100%;
  max-width: 420px;
  padding: 40px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
}

.form-header {
  text-align: center;
  margin-bottom: 30px;
}

.form-header h2 {
  font-size: 2rem;
  color: #1e293b;
  margin-bottom: 10px;
  font-weight: 600;
}

.form-header p {
  color: #64748b;
  font-size: 0.95rem;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 22px;
  margin-top: -5px; 
}

.forgot-link {
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.forgot-link:hover {
  color: #1d4ed8;
}

:deep(.el-checkbox__label) {
  font-size: 0.9rem;
  color: #64748b;
}

.register-prompt {
  text-align: center;
  margin-top: 25px;
  font-size: 0.95rem;
  color: #64748b;
  border-top: 1px solid #f1f5f9; 
  padding-top: 20px;
}

.register-link {
  font-weight: 600;
  margin-left: 5px;
  font-size: 0.95rem;
}

.register-link:hover {
  color: #1d4ed8;
}

.custom-form {
  margin-top: 20px;
}

:deep(.el-input__wrapper) {
  border-radius: 10px;
  padding: 8px 15px;
  box-shadow: 0 0 0 1px #e2e8f0 inset !important;
  transition: all 0.3s ease;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px #3b82f6 inset !important;
}


:deep(.el-input__prefix-inner .el-icon) {
  color: var(--el-text-color-primary) !important; 
  font-size: 18px;
}
:deep(.el-input__prefix-inner .el-icon svg) {
  stroke: var(--el-text-color-primary) !important;
  stroke-width: 0.5px;
}


.submit-btn {
  width: 100%;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: 0.5px;
  margin-top: 10px;
  background: #3b82f6;
  border: none;
  transition: all 0.3s ease; 
}

.submit-btn:hover {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

@media (max-width: 900px) {
  .login-container {
    flex-direction: column;
  }
  .login-banner {
    flex: none;
    height: 30vh;
  }
  .banner-content h1 {
    font-size: 2rem;
  }
  .login-glass-card {
    box-shadow: none;
    padding: 20px;
  }
}
</style>



<style>
html.dark .login-form-wrapper,
html.dark .register-form-wrapper {
  background: #0f172a !important;
}
html.dark .login-glass-card,
html.dark .register-glass-card {
  background: #1e293b !important;
  border: 1px solid #334155 !important;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4) !important;
}
html.dark .form-header h2 {
  color: #f8fafc !important;
}
html.dark .form-header p,
html.dark .register-prompt,
html.dark .login-prompt,
html.dark .register-prompt span,
html.dark .login-prompt span,
html.dark .el-checkbox__label {
  color: #94a3b8 !important;
}

html.dark .register-link span,
html.dark .login-link span {
  color: var(--el-color-primary) !important;
}

html.dark .register-link:hover span,
html.dark .login-link:hover span {
  color: #60a5fa !important; 
}

</style>

<template>
  <div class="register-container">
    <div class="register-banner">
      <div class="banner-content">
        <h1>Bắt đầu quản lý dễ dàng</h1>
        <p>Đăng ký tài khoản ngay hôm nay để trải nghiệm hệ thống quản lý phòng trọ hiện đại nhất.</p>
      </div>
    </div>

    <div class="register-form-wrapper">
      <div class="register-glass-card">
        <div class="form-header">
          <h2>Đăng ký tài khoản</h2>
        </div>
        
        <el-form :model="form" :rules="rules" ref="formRef" @submit.prevent="handleRegister" class="custom-form">
          <el-form-item prop="name">
            <el-input
              v-model="form.name"
              placeholder="Họ và tên"
              :prefix-icon="User"
              size="large"
            />
          </el-form-item>

          <el-form-item prop="email">
            <el-input
              v-model="form.email"
              placeholder="Email của bạn"
              :prefix-icon="Message"
              size="large"
            />
          </el-form-item>

          <el-form-item prop="phone">
            <el-input
              v-model="form.phone"
              placeholder="Số điện thoại"
              :prefix-icon="Phone"
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

          <el-form-item prop="confirmPassword">
            <el-input
              v-model="form.confirmPassword"
              type="password"
              placeholder="Xác nhận mật khẩu"
              :prefix-icon="Lock"
              show-password
              size="large"
            />
          </el-form-item>
          
          <el-form-item>
            <el-button
              type="primary"
              native-type="submit"
              :loading="loading"
              class="submit-btn"
              size="large"
            >
              Đăng ký
            </el-button>
          </el-form-item>
        </el-form>

        <div class="login-prompt">
          <span>Đã có tài khoản?</span>
          <el-link type="primary" :underline="false" class="login-link" @click="router.push('/login')">Đăng nhập ngay</el-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../axios'
import { ElMessage } from 'element-plus'
import { User, Message, Lock, Phone } from '@element-plus/icons-vue'
import {useAuthStore} from '../stores/auth' //Import Store

const router = useRouter()
const formRef = ref(null)
const loading = ref(false)

const authStore = useAuthStore() //khởi tạo Store

const form = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword:'',
})

const rules = {
  name: [{ required: true, message: 'Vui lòng nhập họ tên', trigger: 'blur' }],
  email: [
    { required: true, message: 'Vui lòng nhập email', trigger: 'blur' },
    { type: 'email', message: 'Email không đúng định dạng', trigger: 'blur' }
  ],
  phone: [{ required: true, message: 'Vui lòng nhập số điện thoại', trigger: 'blur' }],
  password: [
    { required: true, message: 'Vui lòng nhập mật khẩu', trigger: 'blur' },
    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự', trigger: 'blur' }
  ],
  confirmPassword: [
    {required:true,message:'Vui lòng nhập lại mật khẩu',trigger:'blur'},
    {validator:(rule,value,callback)=>{
      if(value !== form.value.password){
        callback(new Error('Mật khẩu không khớp'))
      }else{
        callback()
      }
    },trigger:'blur'}
  ]
}

//Hàm xử lý đăng ký
const handleRegister = async () => {
  if (!formRef.value) return
  
  // Validate form trước khi gửi
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  loading.value = true
  try {
    const response = await authStore.register({
      name: form.value.name,
      email: form.value.email,
      phone: form.value.phone,
      password: form.value.password,
    })
    if (response && (response.status === 200 || response.status === 201)) {
      ElMessage.success('Đăng ký tài khoản thành công!')
      router.push('/login') // Chuyển sang trang đăng nhập
    }
  } catch (error) {
    console.error('Register error:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.register-container {
  display: flex;
  height: 100vh;
  font-family: 'Inter', sans-serif;
  background-color: #f8fafc;
}

.register-banner {
  flex: 1;
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.8)), 
              url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80') center/cover;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 40px;
  position: relative;
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
  background: linear-gradient(to right, #ffffff, #94a3b8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.banner-content p {
  font-size: 1.2rem;
  color: #cbd5e1;
  line-height: 1.6;
}

.register-form-wrapper {
  flex: 1.2;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
}

.register-glass-card {
  width: 100%;
  max-width: 450px; 
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

.login-prompt {
  text-align: center;
  margin-top: 25px;
  font-size: 0.95rem;
  color: #64748b;
  border-top: 1px solid #f1f5f9;
  padding-top: 20px;
}

.login-link {
  font-weight: 600;
  margin-left: 5px;
  font-size: 0.95rem;
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




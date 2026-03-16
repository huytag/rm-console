<template>
  <div class="staff-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>Quản lý nhân viên</span>
          <el-button type="primary" @click="showCreateDialog">Thêm nhân viên</el-button>
        </div>
      </template>
      
      <div class="filters">
        <el-select v-model="filters.role" placeholder="Vai trò" clearable style="width: 150px; margin-right: 10px;">
          <el-option label="Quản trị viên" value="admin" />
          <el-option label="Nhân viên" value="staff" />
        </el-select>
        
        <el-button type="primary" @click="fetchData">Lọc</el-button>
      </div>
      
      <el-table :data="staff" v-loading="loading">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="name" label="Tên" />
        <el-table-column prop="email" label="Email" />
        <el-table-column prop="phone" label="Số điện thoại" width="130" />
        <el-table-column label="Vai trò" width="130">
          <template #default="{ row }">
            <el-tag :type="row.role === 'admin' ? 'danger' : 'primary'">
              {{ row.role === 'admin' ? 'Quản trị viên' : 'Nhân viên' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Ngày tạo" width="120">
          <template #default="{ row }">
            {{ formatDate(row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="Thao tác" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="editStaff(row)">Sửa</el-button>
            <el-button type="danger" size="small" @click="deleteStaff(row)">Xóa</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.perPage"
          :total="pagination.total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next"
          @size-change="fetchData"
          @current-change="fetchData"
        />
      </div>
    </el-card>
    
    <el-dialog v-model="dialogVisible" :title="isEdit ? 'Sửa nhân viên' : 'Thêm nhân viên'" width="500px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="Tên" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email" type="email" />
        </el-form-item>
        
        <el-form-item label="Số điện thoại" prop="phone">
          <el-input v-model="form.phone" />
        </el-form-item>
        
        <el-form-item label="Vai trò" prop="role">
          <el-select v-model="form.role" style="width: 100%;">
            <el-option label="Quản trị viên" value="admin" />
            <el-option label="Nhân viên" value="staff" />
          </el-select>
        </el-form-item>
        
        <el-form-item v-if="!isEdit" label="Mật khẩu" prop="password">
          <el-input v-model="form.password" type="password" show-password />
        </el-form-item>
        
        <el-form-item v-if="isEdit" label="Mật khẩu mới" prop="password">
          <el-input v-model="form.password" type="password" show-password placeholder="Để trống nếu không đổi" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="dialogVisible = false">Hủy</el-button>
        <el-button type="primary" @click="submitForm">Lưu</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '../axios'
import { ElMessage, ElMessageBox } from 'element-plus'

const staff = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)

const filters = reactive({
  role: null,
})

const pagination = reactive({
  page: 1,
  perPage: 20,
  total: 0,
})

const form = reactive({
  name: '',
  email: '',
  phone: '',
  role: 'staff',
  password: '',
})

const rules = {
  name: [{ required: true, message: 'Vui lòng nhập tên', trigger: 'blur' }],
  email: [
    { required: true, message: 'Vui lòng nhập email', trigger: 'blur' },
    { type: 'email', message: 'Email không hợp lệ', trigger: 'blur' },
  ],
  role: [{ required: true, message: 'Vui lòng chọn vai trò', trigger: 'change' }],
  password: [{ required: !isEdit.value, message: 'Vui lòng nhập mật khẩu', trigger: 'blur' }],
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN')
}

const fetchData = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      per_page: pagination.perPage,
      ...(filters.role && { role: filters.role }),
    }
    const response = await api.get('/staff', { params })
    staff.value = response.data.data.data
    pagination.total = response.data.data.total
  } catch (error) {
    ElMessage.error('Failed to load staff')
  } finally {
    loading.value = false
  }
}

const showCreateDialog = () => {
  isEdit.value = false
  Object.assign(form, {
    name: '', email: '', phone: '', role: 'staff', password: '',
  })
  dialogVisible.value = true
}

const editStaff = (s) => {
  isEdit.value = true
  Object.assign(form, {
    id: s.id,
    name: s.name,
    email: s.email,
    phone: s.phone,
    role: s.role,
    password: '',
  })
  dialogVisible.value = true
}

const submitForm = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  
  try {
    if (isEdit.value) {
      await api.put(`/staff/${form.id}`, form)
      ElMessage.success('Cập nhật thành công')
    } else {
      await api.post('/staff', form)
      ElMessage.success('Thêm mới thành công')
    }
    dialogVisible.value = false
    fetchData()
  } catch (error) {
    ElMessage.error('Failed to save')
  }
}

const deleteStaff = async (s) => {
  try {
    await ElMessageBox.confirm('Bạn có chắc chắn muốn xóa?', 'Xác nhận', { type: 'warning' })
    await api.delete(`/staff/${s.id}`)
    ElMessage.success('Xóa thành công')
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Failed to delete')
    }
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.staff-page {
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filters {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>

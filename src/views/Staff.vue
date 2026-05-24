<template>
  <div class="staff-page min-h-full p-6 font-inter">
    <!-- Header Section -->
    <div class="mb-8">
      <h1 class="text-3xl font-black text-main mb-1">Quản lý Nhân viên</h1>
      <p class="text-sm text-dim font-medium">Theo dõi và điều phối nhân sự vận hành hệ thống tòa nhà</p>
    </div>

    <!-- Stat Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Total Staff -->
      <div class="stat-card card-blue p-6 rounded-2xl border border-main flex flex-col justify-between h-[150px] relative overflow-hidden group">
        <div>
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-dim mb-4">Tổng nhân sự</p>
          <div class="flex items-baseline gap-2">
            <h2 class="text-4xl font-black text-main">24</h2>
          </div>
        </div>
        <div class="flex items-center gap-1.5 text-[11px] font-bold text-blue-400">
          <el-icon><Top /></el-icon>
          <span>+2 tháng này</span>
        </div>
      </div>

      <!-- Working -->
      <div class="stat-card card-amber p-6 rounded-2xl border border-main flex flex-col justify-between h-[150px] relative overflow-hidden group">
        <div>
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-dim mb-4">Đang làm việc</p>
          <div class="flex items-baseline gap-2">
            <h2 class="text-4xl font-black text-main">18</h2>
          </div>
        </div>
        <div class="flex items-center gap-1.5 text-[11px] font-bold text-amber-500">
          <el-icon><Lightning /></el-icon>
          <span>Hiệu suất: 92%</span>
        </div>
      </div>

      <!-- Probation -->
      <div class="stat-card card-sky p-6 rounded-2xl border border-main flex flex-col justify-between h-[150px] relative overflow-hidden group">
        <div>
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-dim mb-4">Đang thử việc</p>
          <div class="flex items-baseline gap-2">
            <h2 class="text-4xl font-black text-main">04</h2>
          </div>
        </div>
        <div class="flex items-center gap-1.5 text-[11px] font-bold text-blue-400">
          <span>Mới gia nhập hệ thống</span>
        </div>
      </div>

      <!-- Off/Leave -->
      <div class="stat-card card-rose p-6 rounded-2xl border border-main flex flex-col justify-between h-[150px] relative overflow-hidden group">
        <div>
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-dim mb-4">Nghỉ phép/Tạm nghỉ</p>
          <div class="flex items-baseline gap-2">
            <h2 class="text-4xl font-black text-main">02</h2>
          </div>
        </div>
        <div class="flex items-center gap-1.5 text-[11px] font-bold text-rose-500">
          <el-icon><Calendar /></el-icon>
          <span>Trong tuần này</span>
        </div>
      </div>
    </div>

    <!-- Filter & Search Bar -->
    <div class="flex flex-wrap items-center gap-4 mb-6 bg-card/40 p-2 rounded-2xl border border-main">
      <div class="flex items-center gap-3 pl-4 border-r border-main pr-4">
        <span class="text-[10px] font-black uppercase text-dim whitespace-nowrap">Chức vụ:</span>
        <el-select v-model="filters.role" placeholder="Tất cả chức vụ" class="theme-select-mini" style="width: 160px;">
          <el-option label="Tất cả chức vụ" :value="null" />
          <el-option label="Quản trị viên" value="admin" />
          <el-option label="Nhân viên" value="staff" />
        </el-select>
      </div>
      <div class="flex items-center gap-3 border-r border-main pr-4">
        <span class="text-[10px] font-black uppercase text-dim whitespace-nowrap">Trạng thái:</span>
        <el-select v-model="filters.status" placeholder="Tất cả trạng thái" class="theme-select-mini" style="width: 180px;">
          <el-option label="Tất cả trạng thái" :value="null" />
          <el-option label="Đang làm việc" value="active" />
          <el-option label="Đang thử việc" value="probation" />
          <el-option label="Đã nghỉ việc" value="inactive" />
        </el-select>
      </div>
      <div class="flex-grow relative flex items-center min-w-[300px]">
        <el-icon class="absolute left-4 text-dim"><Search /></el-icon>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Tìm theo Tên, SĐT, Mã NV..." 
          class="w-full bg-transparent border-none outline-none pl-12 text-sm text-main placeholder:text-dim font-medium"
        />
      </div>
      <button
        class="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:scale-105 hover:bg-blue-500 hover:shadow-lg active:scale-95 bg-blue-600 shadow-lg shadow-blue-500/20"
        @click="showCreateDialog"
      >
        <el-icon><Plus /></el-icon>
        Thêm nhân viên mới
      </button>
    </div>

    <!-- Table Section -->
    <div class="rounded-2xl border border-main overflow-hidden shadow-2xl bg-table">
      <div class="overflow-x-auto">
        <table class="w-full text-sm border-collapse">
          <thead class="bg-header">
            <tr class="border-b border-main">
              <th class="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-dim">ID</th>
              <th class="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-dim">Tên</th>
              <th class="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-dim">Email</th>
              <th class="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-dim">Số điện thoại</th>
              <th class="px-6 py-5 text-center text-[11px] font-black uppercase tracking-widest text-dim">Vai trò</th>
              <th class="px-6 py-5 text-center text-[11px] font-black uppercase tracking-widest text-dim">Ngày tạo</th>
              <th class="px-6 py-5 text-center text-[11px] font-black uppercase tracking-widest text-dim">Thao tác</th>
            </tr>
          </thead>
          <tbody v-if="!loading" class="bg-table">
            <tr
              v-for="(row, index) in paginatedStaff"
              :key="row.id"
              class="table-row-hover transition-colors border-b last:border-0 border-main"
            >
              <td class="px-6 py-5">
                <span class="font-bold text-xs text-id">NV{{ String(row.id).padStart(3, '0') }}</span>
              </td>
              <td class="px-6 py-5">
                <div class="flex items-center gap-3">
                  <div 
                    class="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0"
                    :style="getAvatarStyle(row.name)"
                  >
                    {{ getInitials(row.name) }}
                  </div>
                  <span class="text-main font-bold text-sm">{{ row.name }}</span>
                </div>
              </td>
              <td class="px-6 py-5">
                <span class="text-dim font-medium">{{ row.email }}</span>
              </td>
              <td class="px-6 py-5">
                <span class="text-dim font-medium tracking-wide">{{ row.phone }}</span>
              </td>
              <td class="px-6 py-5 text-center">
                <span 
                  class="inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest"
                  :class="row.role === 'admin' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'"
                >
                  {{ row.role === 'admin' ? 'ADMIN' : 'STAFF' }}
                </span>
              </td>
              <td class="px-6 py-5 text-center font-medium text-dim text-xs">
                {{ formatDate(row.created_at) }}
              </td>
              <td class="px-6 py-5 text-center">
                <div class="flex items-center justify-center gap-3">
                  <button class="action-btn btn-view" title="Xem chi tiết">
                    <el-icon size="16"><View /></el-icon>
                  </button>
                  <button class="action-btn btn-edit" title="Chỉnh sửa" @click="editStaff(row)">
                    <el-icon size="16"><Edit /></el-icon>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Footer Info & Pagination -->
      <div class="px-6 py-4 flex items-center justify-between bg-header border-t border-main">
        <span class="text-[11px] font-bold text-dim uppercase tracking-widest">
          Tổng cộng <span class="text-main">{{ totalCount }}</span> nhân viên
        </span>
        <div class="flex items-center gap-4">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50]"
            :total="totalCount"
            layout="sizes, prev, pager, next"
            class="custom-pagination"
          />
        </div>
      </div>
    </div>

    <!-- ===== ADD/EDIT STAFF DIALOG ===== -->
    <el-dialog 
      v-model="dialogVisible" 
      :title="isEdit ? 'Cập nhật Thông tin Nhân sự' : 'Cấp tài khoản Nhân sự mới'" 
      width="600px"
      class="theme-dialog-v3"
      append-to-body
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-position="top" class="mt-2">
        <div class="grid grid-cols-1 gap-4">
          <el-form-item label="Họ và tên" prop="name" required>
            <el-input v-model="form.name" placeholder="Nguyễn Văn A..." />
          </el-form-item>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="Vai trò hệ thống" prop="role" required>
            <el-select v-model="form.role" class="!w-full">
              <el-option label="Quản trị viên (Admin)" value="admin" />
              <el-option label="Nhân viên vận hành (Staff)" value="staff" />
            </el-select>
          </el-form-item>
          <el-form-item label="Số điện thoại" prop="phone" required>
            <el-input v-model="form.phone" placeholder="09xx.xxx.xxx" />
          </el-form-item>
        </div>

        <el-form-item label="Email công việc" prop="email" required>
          <el-input v-model="form.email" placeholder="example@qltronha.vn" />
        </el-form-item>

        <div v-if="!isEdit" class="mt-2 pt-4 border-t border-main/50">
          <el-form-item label="Mật khẩu khởi tạo" prop="password" required>
            <el-input v-model="form.password" type="password" show-password placeholder="Tối thiểu 6 ký tự..." />
          </el-form-item>
        </div>
      </el-form>

      <template #footer>
        <div class="flex justify-end gap-3 px-4 pb-4 mt-4">
          <el-button @click="dialogVisible = false" class="theme-btn-cancel-v3">Hủy bỏ</el-button>
          <el-button type="primary" @click="submitForm" class="theme-btn-submit-v3">
            {{ isEdit ? 'Lưu thay đổi' : 'Khởi tạo tài khoản' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import api from '../axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Plus, Search, View, Edit, Delete, ArrowLeft, ArrowRight, 
  Top, Lightning, Calendar
} from '@element-plus/icons-vue'

// ========== MOCK DATA ==========
const mockStaff = [
  { id: 1, name: 'Nguyễn Thị Minh Anh', email: 'minhanh.n@qltronha.vn', phone: '0908.123.456', role: 'admin', created_at: '2022-05-12' },
  { id: 2, name: 'Trần Văn Hoàng', email: 'hoang.tv@qltronha.vn', phone: '0912.445.778', role: 'staff', created_at: '2023-10-01' },
  { id: 3, name: 'Lê Thùy Dung', email: 'dung.lt@qltronha.vn', phone: '0988.999.888', role: 'staff', created_at: '2021-01-15' },
  { id: 4, name: 'Phạm Thế Hùng', email: 'hung.pt@qltronha.vn', phone: '0934.556.778', role: 'staff', created_at: '2020-08-20' },
]

// ========== STATE ==========
const staff = ref(mockStaff)
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)

const filters = reactive({ role: null, status: null })
const form = reactive({ name: '', email: '', phone: '', role: 'staff', password: '' })

const rules = {
  name: [{ required: true, message: 'Vui lòng nhập tên', trigger: 'blur' }],
  email: [{ required: true, message: 'Vui lòng nhập email', trigger: 'blur' }],
  phone: [{ required: true, message: 'Vui lòng nhập số điện thoại', trigger: 'blur' }],
  role: [{ required: true, message: 'Vui lòng chọn vai trò', trigger: 'change' }],
  password: [{ required: true, message: 'Vui lòng nhập mật khẩu', trigger: 'blur' }],
}

// ========== COMPUTED ==========
const filteredStaff = computed(() => {
  return staff.value.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          s.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          s.phone.includes(searchQuery.value)
    const matchesRole = !filters.role || s.role === filters.role
    return matchesSearch && matchesRole
  })
})

const paginatedStaff = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredStaff.value.slice(start, start + pageSize.value)
})

import { watch } from 'vue'
watch(filteredStaff, (newVal) => {
  totalCount.value = newVal.length
}, { immediate: true })

// ========== METHODS ==========
const formatDate = (date) => {
  if (!date) return '---'
  const d = new Date(date)
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(-2)
}

const getAvatarStyle = (name) => {
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']
  const index = name.length % colors.length
  return { backgroundColor: colors[index] }
}

const fetchData = async () => {
  loading.value = true
  try {
    const response = await api.get('/staff', { params: { page: currentPage.value, per_page: pageSize.value } })
    const data = response.data?.data?.data || response.data?.data || response.data || response
    if (data && Array.isArray(data) && data.length > 0) staff.value = data
  } catch (error) {
    // Fail silently
  } finally {
    loading.value = false
  }
}

const showCreateDialog = () => {
  isEdit.value = false
  Object.assign(form, { name: '', email: '', phone: '', role: 'staff', password: '' })
  dialogVisible.value = true
}

const editStaff = (s) => {
  isEdit.value = true
  Object.assign(form, { ...s, password: '' })
  dialogVisible.value = true
}

const submitForm = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  ElMessage.success(isEdit.value ? 'Cập nhật thành công' : 'Thêm mới thành công')
  dialogVisible.value = false
}

const deleteStaff = async (s) => {
  try {
    await ElMessageBox.confirm('Xóa nhân viên này khỏi hệ thống?', 'Cảnh báo', { type: 'warning' })
    ElMessage.success('Xóa thành công')
  } catch (error) {}
}

onMounted(() => {
  fetchData()
})
</script>

<style>
:root {
  --bg-page: #f8fafc;
  --bg-card: #ffffff;
  --bg-table: #ffffff;
  --bg-header: #f8fafc;
  --bg-input: #ffffff;
  --text-main: #1e293b;
  --text-dim: #64748b;
  --border-main: #e2e8f0;
  --text-id: #3B82F6;
}

html.dark {
  --bg-page: #0f172a;
  --bg-card: #1e293b;
  --bg-table: #1e293b;
  --bg-header: #334155;
  --bg-input: #1f2937;
  --text-main: #f8fafc;
  --text-dim: #94a3b8;
  --border-main: #334155;
  --text-id: #60a5fa;
}
</style>

<style scoped>
.staff-page {
  background-color: var(--bg-page);
  color: var(--text-main);
  transition: all 0.3s ease;
}

.text-main { color: var(--text-main); }
.text-dim { color: var(--text-dim); }
.text-id { color: var(--text-id); }
.bg-card { background-color: var(--bg-card); }
.bg-table { background-color: var(--bg-table); }
.bg-header { background-color: var(--bg-header); }
.border-main { border-color: var(--border-main); }

.font-inter {
  font-family: 'Inter', sans-serif;
}

.stat-card {
  transition: all 0.3s ease;
  backdrop-filter: blur(12px);
}

.card-blue { background-color: rgba(59, 130, 246, 0.08) !important; border-color: rgba(59, 130, 246, 0.2) !important; }
.card-amber { background-color: rgba(245, 158, 11, 0.08) !important; border-color: rgba(245, 158, 11, 0.2) !important; }
.card-sky { background-color: rgba(14, 165, 233, 0.08) !important; border-color: rgba(14, 165, 233, 0.2) !important; }
.card-rose { background-color: rgba(244, 63, 94, 0.08) !important; border-color: rgba(244, 63, 94, 0.2) !important; }

html.dark .card-blue { background-color: rgba(59, 130, 246, 0.15) !important; }
html.dark .card-amber { background-color: rgba(245, 158, 11, 0.15) !important; }
html.dark .card-sky { background-color: rgba(14, 165, 233, 0.15) !important; }
html.dark .card-rose { background-color: rgba(244, 63, 94, 0.15) !important; }

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.4);
}

.card-blue:hover { background-color: rgba(59, 130, 246, 0.2) !important; }
.card-amber:hover { background-color: rgba(245, 158, 11, 0.2) !important; }
.card-sky:hover { background-color: rgba(14, 165, 233, 0.2) !important; }
.card-rose:hover { background-color: rgba(244, 63, 94, 0.2) !important; }

.table-row-hover:hover {
  background-color: var(--bg-header);
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-input);
  color: var(--text-dim);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-view:hover {
  background-color: rgba(59, 130, 246, 0.15) !important;
  color: #3b82f6 !important;
}

.btn-edit:hover {
  background-color: rgba(16, 185, 129, 0.15) !important;
  color: #10b981 !important;
}

/* Custom Select Theme */
.theme-select-mini :deep(.el-input__wrapper) {
  background-color: transparent !important;
  box-shadow: none !important;
  border: none !important;
  padding: 0 !important;
}
.theme-select-mini :deep(.el-input__inner) {
  color: var(--text-main) !important;
  font-weight: 800;
  font-size: 11px;
}

/* Dialog Theme */
:deep(.theme-dialog-custom .el-dialog) {
  background-color: var(--bg-card) !important;
  border-radius: 20px;
  border: 1px solid var(--border-main);
}
:deep(.theme-dialog-custom .el-dialog__title) {
  color: var(--text-main) !important;
  font-weight: 900;
}
:deep(.theme-dialog-custom .el-form-item__label) {
  color: var(--text-dim) !important;
  font-weight: 700;
  font-size: 11px;
  text-transform: uppercase;
}
:deep(.theme-dialog-custom .el-input__wrapper) {
  background-color: var(--bg-page) !important;
  box-shadow: none !important;
  border: 1px solid var(--border-main) !important;
  color: var(--text-main) !important;
}

.theme-btn-secondary {
  background-color: var(--bg-page) !important;
  border: 1px solid var(--border-main) !important;
  color: var(--text-main) !important;
  border-radius: 10px !important;
  font-weight: bold !important;
}

.theme-btn-primary {
  background-color: #2563eb !important;
  border: none !important;
  color: #fff !important;
  border-radius: 10px !important;
  font-weight: bold !important;
}

/* Dialog Theme Customization (Shared style v3) */
:deep(.theme-dialog-v3) {
  border-radius: 24px !important;
  overflow: hidden;
  background-color: var(--bg-card) !important;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.2) !important;
}

:deep(.theme-dialog-v3 .el-dialog__header) {
  padding: 24px 32px;
  margin-right: 0;
  border-bottom: 1px solid var(--border-main);
}

:deep(.theme-dialog-v3 .el-dialog__title) {
  font-weight: 900;
  font-size: 1.25rem;
  color: var(--text-main);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

:deep(.theme-dialog-v3 .el-dialog__body) {
  padding: 32px;
}

:deep(.theme-dialog-v3 .el-form-item__label) {
  font-weight: 800;
  color: var(--text-dim);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
}

:deep(.theme-dialog-v3 .el-input__wrapper) {
  background-color: var(--bg-page) !important;
  box-shadow: none !important;
  border: 1px solid var(--border-main) !important;
  border-radius: 12px;
  padding: 8px 12px;
}

:deep(.theme-dialog-v3 .el-input__inner) {
  font-weight: 600;
  color: var(--text-main);
}

.theme-btn-cancel-v3 {
  border-radius: 12px;
  height: 44px;
  padding: 0 24px;
  font-weight: 700;
  border: 1px solid var(--border-main);
  background: transparent;
  color: var(--text-dim);
}

.theme-btn-submit-v3 {
  border-radius: 12px;
  height: 44px;
  padding: 0 24px;
  font-weight: 700;
  background-color: #3b82f6 !important;
  border: none !important;
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
}
</style>

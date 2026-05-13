<template>
  <div class="services-page min-h-full p-6 font-inter">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-black text-main mb-2">Quản lý danh mục dịch vụ</h1>
      <p class="text-sm text-dim font-medium">Thiết lập và theo dõi các loại dịch vụ tiện ích, chi phí vận hành tòa nhà một cách minh bạch.</p>
    </div>

    <!-- Stat Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
      <!-- Total Services -->
      <div class="stat-card card-blue p-6 rounded-2xl border border-main flex flex-col justify-between h-[180px]">
        <div class="flex justify-between items-start">
          <p class="text-xs font-bold text-dim uppercase tracking-widest">Tổng số dịch vụ</p>
          <div class="p-2 rounded-lg bg-blue-500/10">
            <el-icon size="20" style="color: #3B82F6;"><Box /></el-icon>
          </div>
        </div>
        <div>
          <h2 class="text-4xl font-black text-main mb-2">12</h2>
          <p class="text-xs font-bold" style="color: #F59E0B;">+2 so với tháng trước</p>
        </div>
      </div>

      <!-- Electricity Avg -->
      <div class="stat-card card-indigo p-6 rounded-2xl border border-main flex flex-col justify-between h-[180px]">
        <div class="flex justify-between items-start">
          <div class="p-2 rounded-lg bg-indigo-500/10">
            <el-icon size="20" style="color: #6366f1;"><Lightning /></el-icon>
          </div>
          <p class="text-xs font-bold text-dim uppercase tracking-widest">Tăng 5%</p>
        </div>
        <div>
          <p class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Tiền điện TB</p>
          <div class="flex items-baseline gap-1">
            <span class="text-3xl font-black text-main">3.500</span>
            <span class="text-xs font-bold text-dim">đ/kwh</span>
          </div>
        </div>
      </div>

      <!-- Water Avg -->
      <div class="stat-card card-emerald p-6 rounded-2xl border border-main flex flex-col justify-between h-[180px]">
        <div class="flex justify-between items-start">
          <div class="p-2 rounded-lg bg-emerald-500/10">
            <el-icon size="20" style="color: #10B981;"><Odometer /></el-icon>
          </div>
          <p class="text-xs font-bold text-dim uppercase tracking-widest">Ổn định</p>
        </div>
        <div>
          <p class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Tiền nước TB</p>
          <div class="flex items-baseline gap-1">
            <span class="text-3xl font-black text-main">25.000</span>
            <span class="text-xs font-bold text-dim">đ/m³</span>
          </div>
        </div>
      </div>

      <!-- Internet Card -->
      <div class="stat-card card-purple p-6 rounded-2xl border border-main flex flex-col justify-between h-[180px]">
        <div class="flex justify-between items-start">
          <div class="p-2 rounded-lg bg-purple-500/10">
            <el-icon size="20" style="color: #8B5CF6;"><Connection /></el-icon>
          </div>
          <p class="text-xs font-bold text-dim uppercase tracking-widest">Cố định</p>
        </div>
        <div>
          <p class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Phí Internet</p>
          <div class="flex items-baseline gap-1">
            <span class="text-3xl font-black text-main">100.000</span>
            <span class="text-xs font-bold text-dim">đ/phòng</span>
          </div>
        </div>
      </div>

      <!-- Cleaning Avg -->
      <div class="stat-card card-amber p-6 rounded-2xl border border-main flex flex-col justify-between h-[180px]">
        <div class="flex justify-between items-start">
          <div class="p-2 rounded-lg bg-amber-500/10">
            <el-icon size="20" style="color: #F59E0B;"><Brush /></el-icon>
          </div>
          <p class="text-xs font-bold text-dim uppercase tracking-widest">Định kỳ</p>
        </div>
        <div>
          <p class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Phí vệ sinh TB</p>
          <div class="flex items-baseline gap-1">
            <span class="text-3xl font-black text-main">50.000</span>
            <span class="text-xs font-bold text-dim">đ/phòng</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex gap-4">
        <el-select v-model="filters.type" placeholder="Tất cả loại" class="theme-select-custom" style="width: 160px;">
          <el-option label="Tất cả loại" value="all" />
          <el-option label="Hàng tháng" value="monthly" />
          <el-option label="Theo chỉ số" value="meter" />
        </el-select>
        <el-select v-model="filters.status" placeholder="Trạng thái" class="theme-select-custom" style="width: 160px;">
          <el-option label="Đang kinh doanh" value="active" />
          <el-option label="Ngừng kinh doanh" value="inactive" />
        </el-select>
      </div>
      <button
        class="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-105 hover:bg-blue-500 hover:shadow-lg active:scale-95"
        style="background-color: #3B82F6;"
        @click="openAddModal"
      >
        <el-icon><Plus /></el-icon>
        Thêm dịch vụ
      </button>
    </div>

    <!-- Table Section -->
    <div class="rounded-2xl border border-main overflow-hidden shadow-2xl bg-table">
      <div class="overflow-x-auto">
        <table class="w-full text-sm border-collapse">
          <thead class="bg-header">
            <tr class="border-b border-main">
              <th class="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-dim">ID</th>
              <th class="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-dim">Tên dịch vụ</th>
              <th class="px-6 py-5 text-center text-[11px] font-black uppercase tracking-widest text-dim">Đơn giá</th>
              <th class="px-6 py-5 text-center text-[11px] font-black uppercase tracking-widest text-dim">Đơn vị</th>
              <th class="px-6 py-5 text-center text-[11px] font-black uppercase tracking-widest text-dim">Loại</th>
              <th class="px-6 py-5 text-center text-[11px] font-black uppercase tracking-widest text-dim">Trạng thái</th>
              <th class="px-6 py-5 text-center text-[11px] font-black uppercase tracking-widest text-dim">Thao tác</th>
            </tr>
          </thead>
          <tbody v-if="!loading" class="bg-table">
            <tr
              v-for="(row, index) in filteredServices"
              :key="row.id"
              class="table-row-hover transition-colors border-b last:border-0 border-main"
            >
              <td class="px-6 py-5">
                <span class="font-bold text-xs text-id">DV-{{ String(row.id).padStart(3, '0') }}</span>
              </td>
              <td class="px-6 py-5">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" :style="getIconBg(row.icon)">
                    <el-icon size="20" :style="{ color: getIconColor(row.icon) }">
                      <component :is="getIconComponent(row.icon)" />
                    </el-icon>
                  </div>
                  <span class="text-main font-bold text-sm">{{ row.name }}</span>
                </div>
              </td>
              <td class="px-6 py-5 text-center text-main font-bold">{{ formatPriceOnly(row.unit_price) }}đ</td>
              <td class="px-6 py-5 text-center text-dim font-medium uppercase text-[11px] tracking-widest">{{ row.unit }}</td>
              <td class="px-6 py-5 text-center text-main font-medium">{{ row.type_label }}</td>
              <td class="px-6 py-5 text-center">
                <span 
                  class="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                  :style="row.is_active ? 'background-color: rgba(16, 185, 129, 0.1); color: #10B981;' : 'background-color: rgba(239, 68, 68, 0.1); color: #EF4444;'"
                >
                  {{ row.is_active ? 'ĐANG KINH DOANH' : 'NGỪNG KINH DOANH' }}
                </span>
              </td>
              <td class="px-6 py-5 text-center">
                <div class="flex items-center justify-center gap-3">
                  <button class="action-btn btn-edit" title="Chỉnh sửa">
                    <el-icon size="16"><Edit /></el-icon>
                  </button>
                  <button class="action-btn btn-delete" title="Xóa" @click="handleDelete(row)">
                    <el-icon size="16"><Delete /></el-icon>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Footer Info -->
      <div class="px-6 py-4 flex items-center justify-between bg-header border-t border-main">
        <span class="text-xs font-bold text-dim uppercase tracking-widest">Tổng cộng <span class="text-main">{{ filteredServices.length }}</span> dịch vụ</span>
        <div class="flex items-center gap-2">
          <button class="w-8 h-8 rounded-lg flex items-center justify-center text-dim hover:text-main"><el-icon><ArrowLeft /></el-icon></button>
          <button class="w-8 h-8 rounded-lg text-xs font-black bg-blue-600 text-white">1</button>
          <button class="w-8 h-8 rounded-lg text-xs font-black text-dim hover:text-main">2</button>
          <button class="w-8 h-8 rounded-lg text-xs font-black text-dim hover:text-main">3</button>
          <button class="w-8 h-8 rounded-lg flex items-center justify-center text-dim hover:text-main"><el-icon><ArrowRight /></el-icon></button>
        </div>
      </div>
    </div>

    <!-- ===== ADD SERVICE DIALOG ===== -->
    <el-dialog 
      v-model="addDialogVisible" 
      title="Thiết lập Dịch vụ mới" 
      width="600px"
      class="theme-dialog-v3"
      append-to-body
    >
      <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-position="top" class="mt-2">
        <div class="grid grid-cols-1 gap-4">
          <el-form-item label="Tên dịch vụ" prop="name" required>
            <el-input v-model="addForm.name" placeholder="Ví dụ: Tiền rác..." />
          </el-form-item>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="Đơn giá (VNĐ)" prop="unit_price" required>
            <el-input v-model.number="addForm.unit_price" placeholder="Giá...">
              <template #append>đ</template>
            </el-input>
          </el-form-item>
          <el-form-item label="Đơn vị tính" prop="unit" required>
            <el-input v-model="addForm.unit" placeholder="Phòng, kWh, m³..." />
          </el-form-item>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="Loại dịch vụ" prop="type" required>
            <el-select v-model="addForm.type" class="!w-full">
              <el-option label="Cố định (Hàng tháng)" value="fixed" />
              <el-option label="Theo chỉ số (Điện/Nước)" value="meter" />
            </el-select>
          </el-form-item>
          <el-form-item label="Trạng thái" prop="status" required>
            <el-select v-model="addForm.status" class="!w-full">
              <el-option label="Đang kinh doanh" value="active" />
              <el-option label="Ngừng kinh doanh" value="inactive" />
            </el-select>
          </el-form-item>
        </div>
      </el-form>

      <template #footer>
        <div class="flex justify-end gap-3 px-4 pb-4 mt-4">
          <el-button @click="addDialogVisible = false" class="theme-btn-cancel-v3">Hủy bỏ</el-button>
          <el-button type="primary" @click="submitAddForm" class="theme-btn-submit-v3">
            Lưu danh mục dịch vụ
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
import { Box, Lightning, Odometer, Connection, Brush, Plus, Edit, Delete, ArrowLeft, ArrowRight, Tools } from '@element-plus/icons-vue'

// ========== MOCK DATA ==========
const mockServices = [
  { id: 1, name: 'Tiền điện', unit_price: 3500, unit: 'kWh', type_label: 'Hàng tháng', is_active: true, icon: 'electricity' },
  { id: 2, name: 'Tiền nước', unit_price: 25000, unit: 'Khối (m3)', type_label: 'Hàng tháng', is_active: true, icon: 'water' },
  { id: 3, name: 'Vệ sinh', unit_price: 50000, unit: 'Phòng', type_label: 'Hàng tháng', is_active: true, icon: 'cleaning' },
  { id: 4, name: 'Internet', unit_price: 150000, unit: 'Phòng', type_label: 'Hàng tháng', is_active: false, icon: 'internet' },
]

const services = ref(mockServices)
const loading = ref(false)
const filters = reactive({
  type: 'all',
  status: null
})

// ========== COMPUTED ==========
const filteredServices = computed(() => {
  return services.value
})

// ========== METHODS ==========
const formatPriceOnly = (price) => {
  return new Intl.NumberFormat('vi-VN').format(price)
}

const getIconComponent = (iconType) => {
  switch (iconType) {
    case 'electricity': return Lightning
    case 'water': return Odometer
    case 'cleaning': return Brush
    case 'internet': return Connection
    default: return Box
  }
}

const getIconBg = (iconType) => {
  switch (iconType) {
    case 'electricity': return 'background-color: rgba(59, 130, 246, 0.1);'
    case 'water': return 'background-color: rgba(16, 185, 129, 0.1);'
    case 'cleaning': return 'background-color: rgba(245, 158, 11, 0.1);'
    case 'internet': return 'background-color: rgba(139, 92, 246, 0.1);'
    default: return 'background-color: rgba(156, 163, 175, 0.1);'
  }
}

const getIconColor = (iconType) => {
  switch (iconType) {
    case 'electricity': return '#3B82F6'
    case 'water': return '#10B981'
    case 'cleaning': return '#F59E0B'
    case 'internet': return '#8B5CF6'
    default: return '#9CA3AF'
  }
}

const fetchServices = async () => {
  loading.value = true
  try {
    const response = await api.get('/services')
    const data = response.data?.data || response.data || response;
    if (data && Array.isArray(data) && data.length > 0) {
      services.value = data.map(s => ({
        ...s,
        icon: s.name.toLowerCase().includes('điện') ? 'electricity' : 
              s.name.toLowerCase().includes('nước') ? 'water' :
              s.name.toLowerCase().includes('vệ sinh') ? 'cleaning' :
              s.name.toLowerCase().includes('internet') ? 'internet' : 'default',
        type_label: s.type === 'fixed' ? 'Hàng tháng' : 'Theo chỉ số'
      }))
    }
  } catch (error) {
    // Keep mock data on error
  } finally {
    loading.value = false
  }
}

// ========== ADD MODAL ==========
const addDialogVisible = ref(false)
const addFormRef = ref(null)
const addForm = ref({
  name: '',
  unit_price: null,
  unit: '',
  type: 'fixed',
  status: 'active'
})

const addRules = {
  name: [{ required: true, message: 'Vui lòng nhập tên dịch vụ', trigger: 'blur' }],
  unit_price: [{ required: true, message: 'Vui lòng nhập đơn giá', trigger: 'blur' }],
  unit: [{ required: true, message: 'Vui lòng nhập đơn vị tính', trigger: 'blur' }],
  type: [{ required: true, message: 'Vui lòng chọn loại dịch vụ', trigger: 'change' }],
  status: [{ required: true, message: 'Vui lòng chọn trạng thái', trigger: 'change' }],
}

const openAddModal = () => {
  addForm.value = {
    name: '',
    unit_price: null,
    unit: '',
    type: 'fixed',
    status: 'active'
  }
  addDialogVisible.value = true
}

const submitAddForm = async () => {
  const valid = await addFormRef.value.validate().catch(() => false)
  if (!valid) return
  console.log('Submit new service:', addForm.value)
  ElMessage.success('Đã cập nhật danh mục dịch vụ thành công')
  addDialogVisible.value = false
}

const handleDelete = async (service) => {
  try {
    await ElMessageBox.confirm(
      `Bạn có chắc chắn muốn xóa dịch vụ "${service.name}" không? Hành động này không thể hoàn tác.`,
      'Xác nhận xóa dịch vụ',
      {
        confirmButtonText: 'Xóa vĩnh viễn',
        cancelButtonText: 'Hủy bỏ',
        type: 'warning',
        customClass: 'theme-message-box'
      }
    )
    
    // Thực hiện gọi API xóa ở đây (giả lập)
    console.log('Deleting service:', service.id)
    ElMessage.success(`Đã xóa dịch vụ "${service.name}" thành công`)
    
    // Cập nhật local state
    services.value = services.value.filter(s => s.id !== service.id)
    
  } catch (error) {
    // User cancelled or error occurred
  }
}

onMounted(() => {
  fetchServices()
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
  --bg-page: #111827;
  --bg-card: #1f2937;
  --bg-table: #111827;
  --bg-header: #1f2937;
  --bg-input: #1f2937;
  --text-main: #ffffff;
  --text-dim: #9ca3af;
  --border-main: #374151;
  --text-id: #6b7280;
}
</style>

<style scoped>
.services-page {
  background-color: var(--bg-page);
  color: var(--text-main);
  transition: all 0.3s ease;
}

.text-main { color: var(--text-main); }
.text-dim { color: var(--text-dim); }
.bg-card { background-color: var(--bg-card); }
.bg-table { background-color: var(--bg-table); }
.bg-header { background-color: var(--bg-header); }
.text-id { color: var(--text-id); }
.border-main { border-color: var(--border-main); }

.font-inter {
  font-family: 'Inter', sans-serif;
}

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

.btn-edit:hover {
  background-color: rgba(16, 185, 129, 0.15) !important;
  color: #10b981 !important;
}

.btn-delete:hover {
  background-color: rgba(239, 68, 68, 0.15) !important;
  color: #ef4444 !important;
}

.stat-card {
  transition: all 0.3s ease;
  backdrop-filter: blur(12px);
}

.card-blue { background-color: rgba(59, 130, 246, 0.05) !important; border-color: rgba(59, 130, 246, 0.1) !important; }
.card-indigo { background-color: rgba(99, 102, 241, 0.05) !important; border-color: rgba(99, 102, 241, 0.1) !important; }
.card-emerald { background-color: rgba(16, 185, 129, 0.05) !important; border-color: rgba(16, 185, 129, 0.1) !important; }
.card-purple { background-color: rgba(139, 92, 246, 0.05) !important; border-color: rgba(139, 92, 246, 0.1) !important; }
.card-amber { background-color: rgba(245, 158, 11, 0.05) !important; border-color: rgba(245, 158, 11, 0.1) !important; }

html.dark .card-blue { background-color: rgba(59, 130, 246, 0.1) !important; border-color: rgba(59, 130, 246, 0.2) !important; }
html.dark .card-indigo { background-color: rgba(99, 102, 241, 0.1) !important; border-color: rgba(99, 102, 241, 0.2) !important; }
html.dark .card-emerald { background-color: rgba(16, 185, 129, 0.1) !important; border-color: rgba(16, 185, 129, 0.2) !important; }
html.dark .card-purple { background-color: rgba(139, 92, 246, 0.1) !important; border-color: rgba(139, 92, 246, 0.2) !important; }
html.dark .card-amber { background-color: rgba(245, 158, 11, 0.1) !important; border-color: rgba(245, 158, 11, 0.2) !important; }

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.2);
}

.card-blue:hover { background-color: rgba(59, 130, 246, 0.15) !important; }
.card-indigo:hover { background-color: rgba(99, 102, 241, 0.15) !important; }
.card-emerald:hover { background-color: rgba(16, 185, 129, 0.15) !important; }
.card-purple:hover { background-color: rgba(139, 92, 246, 0.15) !important; }
.card-amber:hover { background-color: rgba(245, 158, 11, 0.15) !important; }

/* Custom Select Theme */
.theme-select-custom :deep(.el-input__wrapper) {
  background-color: var(--bg-input) !important;
  border: 1px solid var(--border-main) !important;
  box-shadow: none !important;
  border-radius: 12px;
  height: 44px;
}
.theme-select-custom :deep(.el-input__inner) {
  color: var(--text-main) !important;
  font-weight: 600;
}
.theme-select-custom :deep(.el-select__placeholder) {
  color: var(--text-dim) !important;
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

<template>
  <div class="services-page min-h-full p-6 font-inter" style="background-color: #111827;">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-black text-white mb-2">Quản lý danh mục dịch vụ</h1>
      <p class="text-sm text-gray-400 font-medium">Thiết lập và theo dõi các loại dịch vụ tiện ích, chi phí vận hành tòa nhà một cách minh bạch.</p>
    </div>

    <!-- Stat Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Total Services -->
      <div class="p-6 rounded-2xl border flex flex-col justify-between h-[180px]" style="background-color: #1F2937; border-color: #374151;">
        <div class="flex justify-between items-start">
          <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Tổng số dịch vụ</p>
          <div class="p-2 rounded-lg" style="background-color: rgba(59, 130, 246, 0.1);">
            <el-icon size="20" style="color: #3B82F6;"><Box /></el-icon>
          </div>
        </div>
        <div>
          <h2 class="text-4xl font-black text-white mb-2">12</h2>
          <p class="text-xs font-bold" style="color: #F59E0B;">+2 so với tháng trước</p>
        </div>
      </div>

      <!-- Electricity Avg -->
      <div class="p-6 rounded-2xl border flex flex-col justify-between h-[180px]" style="background-color: #1F2937; border-color: #374151;">
        <div class="flex justify-between items-start">
          <div class="p-2 rounded-lg" style="background-color: rgba(59, 130, 246, 0.15);">
            <el-icon size="20" style="color: #3B82F6;"><Lightning /></el-icon>
          </div>
          <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Tăng 5%</p>
        </div>
        <div>
          <p class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Tiền điện TB</p>
          <div class="flex items-baseline gap-1">
            <span class="text-3xl font-black text-white">3.500</span>
            <span class="text-xs font-bold text-gray-400">đ/kwh</span>
          </div>
        </div>
      </div>

      <!-- Water Avg -->
      <div class="p-6 rounded-2xl border flex flex-col justify-between h-[180px]" style="background-color: #1F2937; border-color: #374151;">
        <div class="flex justify-between items-start">
          <div class="p-2 rounded-lg" style="background-color: rgba(16, 185, 129, 0.15);">
            <el-icon size="20" style="color: #10B981;"><Odometer /></el-icon>
          </div>
          <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Ổn định</p>
        </div>
        <div>
          <p class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Tiền nước TB</p>
          <div class="flex items-baseline gap-1">
            <span class="text-3xl font-black text-white">25.000</span>
            <span class="text-xs font-bold text-gray-400">đ/m³</span>
          </div>
        </div>
      </div>

      <!-- Internet Card -->
      <div class="p-6 rounded-2xl border flex flex-col justify-between h-[180px]" style="background-color: #1F2937; border-color: #374151;">
        <div class="flex justify-between items-start">
          <div class="p-2 rounded-lg" style="background-color: rgba(139, 92, 246, 0.15);">
            <el-icon size="20" style="color: #8B5CF6;"><Connection /></el-icon>
          </div>
          <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Cố định</p>
        </div>
        <div>
          <p class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Phí Internet</p>
          <div class="flex items-baseline gap-1">
            <span class="text-3xl font-black text-white">100.000</span>
            <span class="text-xs font-bold text-gray-400">đ/phòng</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex gap-4">
        <el-select v-model="filters.type" placeholder="Tất cả loại" class="dark-select-custom" style="width: 160px;">
          <el-option label="Tất cả loại" value="all" />
          <el-option label="Hàng tháng" value="monthly" />
          <el-option label="Theo chỉ số" value="meter" />
        </el-select>
        <el-select v-model="filters.status" placeholder="Trạng thái" class="dark-select-custom" style="width: 160px;">
          <el-option label="Đang kinh doanh" value="active" />
          <el-option label="Ngừng kinh doanh" value="inactive" />
        </el-select>
      </div>
      <button
        class="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
        style="background-color: #3B82F6;"
      >
        <el-icon><Plus /></el-icon>
        Thêm dịch vụ
      </button>
    </div>

    <!-- Table Section -->
    <div class="rounded-2xl border overflow-hidden shadow-2xl" style="background-color: #111827; border-color: #374151;">
      <div class="overflow-x-auto">
        <table class="w-full text-sm border-collapse">
          <thead style="background-color: #1f2937;">
            <tr style="border-bottom: 1px solid #374151;">
              <th class="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-gray-500">ID</th>
              <th class="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-gray-500">Tên dịch vụ</th>
              <th class="px-6 py-5 text-center text-[11px] font-black uppercase tracking-widest text-gray-500">Đơn giá</th>
              <th class="px-6 py-5 text-center text-[11px] font-black uppercase tracking-widest text-gray-500">Đơn vị</th>
              <th class="px-6 py-5 text-center text-[11px] font-black uppercase tracking-widest text-gray-500">Loại</th>
              <th class="px-6 py-5 text-center text-[11px] font-black uppercase tracking-widest text-gray-500">Trạng thái</th>
              <th class="px-6 py-5 text-center text-[11px] font-black uppercase tracking-widest text-gray-500">Thao tác</th>
            </tr>
          </thead>
          <tbody v-if="!loading" style="background-color: #111827;">
            <tr
              v-for="(row, index) in filteredServices"
              :key="row.id"
              class="table-row-hover transition-colors"
              :style="index !== filteredServices.length - 1 ? 'border-bottom: 1px solid #374151;' : ''"
            >
              <td class="px-6 py-5">
                <span class="font-bold text-xs text-gray-400">DV-{{ String(row.id).padStart(3, '0') }}</span>
              </td>
              <td class="px-6 py-5">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" :style="getIconBg(row.icon)">
                    <el-icon size="20" :style="{ color: getIconColor(row.icon) }">
                      <component :is="getIconComponent(row.icon)" />
                    </el-icon>
                  </div>
                  <span class="text-white font-bold text-sm">{{ row.name }}</span>
                </div>
              </td>
              <td class="px-6 py-5 text-center text-white font-bold">{{ formatPriceOnly(row.unit_price) }}đ</td>
              <td class="px-6 py-5 text-center text-gray-400 font-medium uppercase text-[11px] tracking-widest">{{ row.unit }}</td>
              <td class="px-6 py-5 text-center text-white font-medium">{{ row.type_label }}</td>
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
                  <button class="text-gray-500 hover:text-blue-500 transition-colors" title="Chỉnh sửa">
                    <el-icon size="16"><Edit /></el-icon>
                  </button>
                  <button class="text-gray-500 hover:text-red-500 transition-colors" title="Xóa">
                    <el-icon size="16"><Delete /></el-icon>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Footer Info -->
      <div class="px-6 py-4 flex items-center justify-between" style="background-color: #1f2937; border-top: 1px solid #374151;">
        <span class="text-xs font-bold text-gray-500 uppercase tracking-widest">Tổng cộng <span class="text-white">{{ filteredServices.length }}</span> dịch vụ</span>
        <div class="flex items-center gap-2">
          <button class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white"><el-icon><ArrowLeft /></el-icon></button>
          <button class="w-8 h-8 rounded-lg text-xs font-black bg-blue-600 text-white">1</button>
          <button class="w-8 h-8 rounded-lg text-xs font-black text-gray-500 hover:text-white">2</button>
          <button class="w-8 h-8 rounded-lg text-xs font-black text-gray-500 hover:text-white">3</button>
          <button class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white"><el-icon><ArrowRight /></el-icon></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import api from '../axios'
import { ElMessage } from 'element-plus'
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
    if (response.data?.data && response.data.data.length > 0) {
      services.value = response.data.data.map(s => ({
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

onMounted(() => {
  fetchServices()
})
</script>

<style scoped>
.font-inter {
  font-family: 'Inter', sans-serif;
}

.table-row-hover:hover {
  background-color: rgba(55, 65, 81, 0.4);
}

/* Custom Select Dark */
.dark-select-custom :deep(.el-input__wrapper) {
  background-color: #1F2937 !important;
  border: 1px solid #374151 !important;
  box-shadow: none !important;
  border-radius: 12px;
  height: 44px;
}
.dark-select-custom :deep(.el-input__inner) {
  color: #F9FAFB !important;
  font-weight: 600;
}
.dark-select-custom :deep(.el-select__placeholder) {
  color: #9CA3AF !important;
}
</style>

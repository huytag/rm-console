<template>
  <div class="dashboard-page min-h-full p-6 font-inter">
    <!-- Stat Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Total Rooms -->
      <div class="stat-card card-blue p-6 rounded-2xl border border-main flex items-center justify-between h-[120px] group relative overflow-hidden">
        <div>
          <p class="text-[10px] font-black uppercase tracking-widest text-dim mb-4">Tổng phòng</p>
          <div class="flex items-baseline gap-2">
            <h2 class="text-3xl font-black text-main">{{ isTenant ? '---' : '120' }}</h2>
            <span class="text-xs font-bold text-dim">Phòng</span>
          </div>
        </div>
        <div class="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-500/10 text-blue-500 relative z-10 group-hover:scale-110 transition-transform">
          <el-icon size="24"><HomeFilled /></el-icon>
        </div>
        <div class="absolute -right-4 -bottom-4 opacity-[0.03] text-blue-500">
          <el-icon size="100"><HomeFilled /></el-icon>
        </div>
      </div>

      <!-- Empty Rooms -->
      <div class="stat-card card-emerald p-6 rounded-2xl border border-main flex items-center justify-between h-[120px] group relative overflow-hidden">
        <div>
          <p class="text-[10px] font-black uppercase tracking-widest text-dim mb-4">Phòng trống</p>
          <div class="flex items-baseline gap-2">
            <h2 class="text-3xl font-black text-emerald-500">{{ isTenant ? '---' : '15' }}</h2>
            <span class="text-xs font-bold text-dim">Sẵn sàng</span>
          </div>
        </div>
        <div class="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-500/10 text-emerald-500 relative z-10 group-hover:scale-110 transition-transform">
          <el-icon size="24"><CircleCheck /></el-icon>
        </div>
        <div class="absolute -right-4 -bottom-4 opacity-[0.03] text-emerald-500">
          <el-icon size="100"><CircleCheck /></el-icon>
        </div>
      </div>

      <!-- Rented Rooms -->
      <div class="stat-card card-rose p-6 rounded-2xl border border-main flex items-center justify-between h-[120px] group relative overflow-hidden">
        <div>
          <p class="text-[10px] font-black uppercase tracking-widest text-dim mb-4">Đã cho thuê</p>
          <div class="flex items-baseline gap-2">
            <h2 class="text-3xl font-black text-rose-500">{{ isTenant ? '---' : '105' }}</h2>
            <span class="text-xs font-bold text-dim">Khách ở</span>
          </div>
        </div>
        <div class="w-12 h-12 rounded-xl flex items-center justify-center bg-rose-500/10 text-rose-500 relative z-10 group-hover:scale-110 transition-transform">
          <el-icon size="24"><User /></el-icon>
        </div>
        <div class="absolute -right-4 -bottom-4 opacity-[0.03] text-rose-500">
          <el-icon size="100"><User /></el-icon>
        </div>
      </div>

      <!-- Unpaid Invoices -->
      <div class="stat-card card-amber p-6 rounded-2xl border border-main flex items-center justify-between h-[120px] group relative overflow-hidden">
        <div>
          <p class="text-[10px] font-black uppercase tracking-widest text-dim mb-4">Chưa thanh toán</p>
          <div class="flex items-baseline gap-2">
            <h2 class="text-3xl font-black text-amber-500">{{ isTenant ? '---' : '8' }}</h2>
            <span class="text-xs font-bold text-dim">Hóa đơn</span>
          </div>
        </div>
        <div class="w-12 h-12 rounded-xl flex items-center justify-center bg-amber-500/10 text-amber-500 relative z-10 group-hover:scale-110 transition-transform">
          <el-icon size="24"><Clock /></el-icon>
        </div>
        <div class="absolute -right-4 -bottom-4 opacity-[0.03] text-amber-500">
          <el-icon size="100"><Clock /></el-icon>
        </div>
      </div>
    </div>

    <!-- Charts Section (Ẩn toàn bộ cho tenant) -->
    <template v-if="!isTenant">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <!-- Revenue Chart -->
      <div class="lg:col-span-2 p-6 rounded-2xl border border-main bg-card">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h3 class="text-sm font-black text-main uppercase tracking-widest mb-1">Biểu đồ doanh thu</h3>
            <p class="text-[10px] font-bold text-dim uppercase">Thống kê theo từng tháng (Đơn vị: Triệu VNĐ)</p>
          </div>
          <div class="flex items-center gap-4 self-start sm:self-auto">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0"></span>
              <span class="text-[10px] font-bold text-dim uppercase shrink-0 whitespace-nowrap">Thực thu</span>
            </div>
            <el-select v-model="selectedYear" size="small" class="theme-select-mini shrink-0" style="width: 100px; min-width: 60px;">
              <el-option v-for="y in [2024, 2023, 2022]" :key="y" :label="`Năm ${y}`" :value="y" />
            </el-select>
          </div>
        </div>
        <div class="flex gap-4">
          <!-- Y-Axis -->
          <div class="flex flex-col justify-between h-[280px] pb-6 text-[9px] font-black text-dim uppercase tracking-widest text-right w-10">
            <span>{{ (maxRevenue / 1000000).toFixed(0) }}tr</span>
            <span>{{ ((maxRevenue * 0.8) / 1000000).toFixed(0) }}tr</span>
            <span>{{ ((maxRevenue * 0.6) / 1000000).toFixed(0) }}tr</span>
            <span>{{ ((maxRevenue * 0.4) / 1000000).toFixed(0) }}tr</span>
            <span>{{ ((maxRevenue * 0.2) / 1000000).toFixed(0) }}tr</span>
            <span>0</span>
          </div>
          <!-- Chart Grid -->
          <div class="flex-grow h-[280px] flex items-end justify-between px-4 gap-2 border-l border-b border-main/50 relative">
            <div v-for="(label, idx) in revenueData.labels" :key="idx" class="flex-grow flex flex-col items-center gap-2 h-full justify-end">
              <div class="w-full flex justify-center items-end h-full">
                <el-tooltip :content="formatPrice(revenueData.data[idx])" placement="top">
                  <div 
                    class="w-full max-w-[20px] bg-blue-600 rounded-t-sm transition-all hover:bg-blue-500 cursor-pointer" 
                    :style="{ height: `${(revenueData.data[idx] / maxRevenue) * 100}%`, minHeight: '4px' }"
                  ></div>
                </el-tooltip>
              </div>
              <span class="absolute -bottom-6 text-[10px] font-black text-dim">{{ label }}</span>
            </div>
          </div>
        </div>
        <div class="mt-8 text-center text-[10px] font-black text-dim uppercase tracking-[0.2em]">Biểu đồ doanh thu theo từng năm (VNĐ)</div>
      </div>

      <!-- Room Status Chart -->
      <div class="p-6 rounded-2xl border border-main bg-card flex flex-col">
        <h3 class="text-sm font-black text-main uppercase tracking-widest mb-8">Trạng thái phòng</h3>
        <div class="flex-grow flex flex-col items-center justify-center relative">
          <div class="relative w-44 h-44 mb-8">
            <svg class="w-full h-full transform -rotate-90">
              <!-- Trống 12% (green) -->
              <circle cx="88" cy="88" r="70" stroke="currentColor" stroke-width="16" fill="transparent" stroke-dasharray="439.6" stroke-dashoffset="386.8" class="text-emerald-500" style="transform: rotate(0deg); transform-origin: center;" />
              <!-- Đang thuê 84% (red) -->
              <circle cx="88" cy="88" r="70" stroke="currentColor" stroke-width="16" fill="transparent" stroke-dasharray="439.6" stroke-dashoffset="70.3" class="text-rose-500" style="transform: rotate(43.2deg); transform-origin: center;" />
              <!-- Bảo trì 4% (orange) -->
              <circle cx="88" cy="88" r="70" stroke="currentColor" stroke-width="16" fill="transparent" stroke-dasharray="439.6" stroke-dashoffset="422.0" class="text-amber-500" style="transform: rotate(345.6deg); transform-origin: center;" />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-3xl font-black text-main">120</span>
              <span class="text-[8px] font-black text-dim uppercase tracking-widest">Tổng cộng</span>
            </div>
          </div>
          <div class="w-full space-y-4 px-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span class="text-[11px] font-bold text-main" style="font-size: 14px;">Trống</span>
              </div>
              <span class="text-[11px] font-black text-main" style="font-size: 14px;">15 phòng (12%)</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span class="text-[11px] font-bold text-main" style="font-size: 14px;">Đang thuê</span>
              </div>
              <span class="text-[11px] font-black text-main" style="font-size: 14px;">105 phòng (84%)</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span class="text-[11px] font-bold text-main" style="font-size: 14px;">Bảo trì</span>
              </div>
              <span class="text-[11px] font-black text-main" style="font-size: 14px;">5 phòng (4%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </template>

    <!-- Tables Section (Ẩn toàn bộ cho tenant) -->
    <template v-if="!isTenant">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Debtors Table -->
      <div class="rounded-2xl border border-main bg-card overflow-hidden">
        <div class="px-6 py-5 flex items-center justify-between border-b border-main bg-header/20">
          <div class="flex items-center gap-3">
            <el-icon class="text-rose-500" size="18"><Warning /></el-icon>
            <h3 class="text-sm font-black text-main uppercase tracking-widest">Khách nợ tiền phòng</h3>
          </div>
          <button @click="router.push('/reports/debtors')" class="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:underline">Xem tất cả</button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-header/40 text-[10px] font-black text-dim uppercase tracking-widest">
              <tr>
                <th class="px-6 py-4 text-left">Khách hàng</th>
                <th class="px-6 py-4 text-left">Phòng</th>
                <th class="px-6 py-4 text-left">Tháng nợ</th>
                <th class="px-6 py-4 text-right">Số tiền nợ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(d, idx) in debtors" :key="idx" class="border-b last:border-0 border-main table-row-hover transition-colors">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-black text-white shrink-0">{{ getInitials(d.name) }}</div>
                    <span class="text-xs font-bold text-main">{{ d.name }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="text-xs font-bold text-dim">{{ d.room }}</span>
                </td>
                <td class="px-6 py-4">
                  <span class="text-xs font-medium text-dim">{{ d.month }}</span>
                </td>
                <td class="px-6 py-4 text-right">
                  <span class="text-sm font-black text-rose-500">{{ formatPrice(d.amount) }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Empty Rooms Table -->
      <div class="rounded-2xl border border-main bg-card overflow-hidden">
        <div class="px-6 py-5 flex items-center justify-between border-b border-main bg-header/20">
          <div class="flex items-center gap-3">
            <el-icon class="text-emerald-500" size="18"><House /></el-icon>
            <h3 class="text-sm font-black text-main uppercase tracking-widest">Danh sách phòng trống</h3>
          </div>
          <button @click="router.push('/rooms')" class="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:underline">Quản lý phòng</button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-header/40 text-[10px] font-black text-dim uppercase tracking-widest">
              <tr>
                <th class="px-6 py-4 text-left">Số phòng</th>
                <th class="px-6 py-4 text-left">Tòa nhà</th>
                <th class="px-6 py-4 text-right">Giá thuê</th>
                <th class="px-6 py-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(r, idx) in emptyRooms" :key="idx" class="border-b last:border-0 border-main table-row-hover transition-colors">
                <td class="px-6 py-4">
                  <span class="text-xs font-black text-main">{{ r.number }}</span>
                </td>
                <td class="px-6 py-4">
                  <span class="text-xs font-medium text-dim">{{ r.building }}</span>
                </td>
                <td class="px-6 py-4 text-right">
                  <span class="text-sm font-black text-blue-500">{{ formatPrice(r.price) }}</span>
                </td>
                <td class="px-6 py-4 text-center">
                  <button @click="router.push('/contracts')" class="px-4 py-1.5 rounded-lg bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase hover:bg-blue-500 hover:text-white transition-all">Thuê ngay</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { 
  HomeFilled, CircleCheck, User, Clock, Warning, House, ArrowRight
} from '@element-plus/icons-vue'
import api from '../axios'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const isTenant = computed(() => authStore.userRole === 'tenant')
const selectedYear = ref(new Date().getFullYear())

const debtors = ref([])
const emptyRooms = ref([])
const revenueData = ref({ labels: [], data: [] })

const maxRevenue = computed(() => {
  if (!revenueData.value.data || revenueData.value.data.length === 0) return 1
  return Math.max(...revenueData.value.data) || 1
})

const fetchDebtors = async () => {
  try {
    const res = await api.get('/dashboard/debtors')
    if (res && res.data) {
      debtors.value = res.data.map(item => ({
        name: item.contract?.tenant?.name || 'Khách vãng lai',
        room: `P.${item.contract?.room?.room_number || 'N/A'}`,
        month: formatMonth(item.due_date),
        amount: item.total_amount
      }))
    }
  } catch (error) {
    console.error('Error fetching debtors:', error)
  }
}

const fetchEmptyRooms = async () => {
  try {
    const res = await api.get('/dashboard/empty-rooms')
    if (res && res.data) {
      emptyRooms.value = res.data.map(item => ({
        number: `P.${item.room_number}`,
        building: `Tòa nhà ${item.building?.name || 'N/A'}`,
        price: item.price || 0 // Thêm price nếu BE có trả về
      }))
    }
  } catch (error) {
    console.error('Error fetching empty rooms:', error)
  }
}

const fetchRevenue = async () => {
  try {
    const res = await api.get('/dashboard/revenue', { params: { year: selectedYear.value } })
    if (res && res.labels && res.datasets && res.datasets[0]) {
      revenueData.value = {
        labels: res.labels,
        data: res.datasets[0].data
      }
    }
  } catch (error) {
    console.error('Error fetching revenue:', error)
  }
}

const formatMonth = (dateStr) => {
  if (!dateStr) return 'N/A'
  const date = new Date(dateStr)
  return `Tháng ${date.getMonth() + 1}/${date.getFullYear()}`
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND',
    maximumFractionDigits: 0 
  }).format(price)
}

const getInitials = (name) => {
  if (!name) return 'N'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(-2)
}

onMounted(() => {
  fetchDebtors()
  fetchEmptyRooms()
  fetchRevenue()
  // Tenant không cần gọi các API dashboard (đã bị chặn ở interceptor)
  if (!isTenant.value) {
    fetchDebtors()
    fetchEmptyRooms()
    fetchRevenue()
  }
})

watch(selectedYear, () => {
  if (!isTenant.value) {
    fetchRevenue()
  }
})
</script>

<style>
:root {
  --bg-page: #f8fafc;
  --bg-card: #ffffff;
  --bg-table: #ffffff;
  --bg-header: #f8fafc;
  --text-main: #1e293b;
  --text-dim: #64748b;
  --border-main: #e2e8f0;
}

html.dark {
  --bg-page: #0f172a;
  --bg-card: #1e293b;
  --bg-table: #0f172a;
  --bg-header: #1e293b;
  --text-main: #f8fafc;
  --text-dim: #94a3b8;
  --border-main: #334155;
}
</style>

<style scoped>
.dashboard-page {
  background-color: var(--bg-page);
  color: var(--text-main);
  transition: all 0.3s ease;
}

.text-main { color: var(--text-main); }
.text-dim { color: var(--text-dim); }
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
.card-emerald { background-color: rgba(16, 185, 129, 0.08) !important; border-color: rgba(16, 185, 129, 0.2) !important; }
.card-rose { background-color: rgba(244, 63, 94, 0.08) !important; border-color: rgba(244, 63, 94, 0.2) !important; }
.card-amber { background-color: rgba(245, 158, 11, 0.08) !important; border-color: rgba(245, 158, 11, 0.2) !important; }

html.dark .card-blue { background-color: rgba(59, 130, 246, 0.15) !important; }
html.dark .card-emerald { background-color: rgba(16, 185, 129, 0.15) !important; }
html.dark .card-rose { background-color: rgba(244, 63, 94, 0.15) !important; }
html.dark .card-amber { background-color: rgba(245, 158, 11, 0.15) !important; }

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.3);
}

.card-blue:hover { background-color: rgba(59, 130, 246, 0.2) !important; }
.card-emerald:hover { background-color: rgba(16, 185, 129, 0.2) !important; }
.card-rose:hover { background-color: rgba(244, 63, 94, 0.2) !important; }
.card-amber:hover { background-color: rgba(245, 158, 11, 0.2) !important; }

.table-row-hover:hover {
  background-color: rgba(59, 130, 246, 0.04);
}

html.dark .table-row-hover:hover {
  background-color: rgba(59, 130, 246, 0.08);
}

/* Custom Select Theme */
.theme-select-mini :deep(.el-input__wrapper) {
  background-color: transparent !important;
  box-shadow: none !important;
  border: 1px solid var(--border-main) !important;
  border-radius: 8px !important;
}
.theme-select-mini :deep(.el-input__inner) {
  color: var(--text-main) !important;
  font-weight: 800;
  font-size: 10px;
  text-transform: uppercase;
}

/* Custom Chart Animations */
@keyframes grow {
  from { height: 0; }
}
.rounded-t-md {
  animation: grow 1s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>

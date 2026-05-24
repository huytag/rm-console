<template>
  <div class="revenue-report-page min-h-full p-6 font-inter">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-black text-main">Báo cáo Doanh thu</h1>
      <div class="flex items-center gap-4">
        <button class="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 bg-blue-600 shadow-lg shadow-blue-500/20">
          <el-icon><Download /></el-icon>
          Xuất PDF
        </button>
      </div>
    </div>

    <!-- Stat Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Total Revenue -->
      <div class="stat-card card-blue p-6 rounded-2xl border border-main flex flex-col justify-center h-[140px] group">
        <div class="flex justify-between items-start mb-3">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-500/10 text-blue-500">
            <el-icon size="20"><Money /></el-icon>
          </div>
          <span class="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
            <el-icon><Top /></el-icon> +12%
          </span>
        </div>
        <div>
          <p class="text-[10px] font-black uppercase tracking-widest text-dim mb-1">Tổng doanh thu</p>
          <h2 class="text-2xl font-black text-main">1.250.000.000đ</h2>
        </div>
      </div>

      <!-- Profit -->
      <div class="stat-card card-emerald p-6 rounded-2xl border border-main flex flex-col justify-center h-[140px] group">
        <div class="flex justify-between items-start mb-3">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-500/10 text-emerald-500">
            <el-icon size="20"><TrendCharts /></el-icon>
          </div>
          <span class="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
            <el-icon><Top /></el-icon> +8%
          </span>
        </div>
        <div>
          <p class="text-[10px] font-black uppercase tracking-widest text-dim mb-1">Lợi nhuận</p>
          <h2 class="text-2xl font-black text-main">850.000.000đ</h2>
        </div>
      </div>

      <!-- Total Cost -->
      <div class="stat-card card-rose p-6 rounded-2xl border border-main flex flex-col justify-center h-[140px] group">
        <div class="flex justify-between items-start mb-3">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-rose-500/10 text-rose-500">
            <el-icon size="20"><ShoppingCart /></el-icon>
          </div>
          <span class="text-[10px] font-bold text-rose-500 flex items-center gap-1">
            <el-icon><Top /></el-icon> +5%
          </span>
        </div>
        <div>
          <p class="text-[10px] font-black uppercase tracking-widest text-dim mb-1">Tổng chi phí</p>
          <h2 class="text-2xl font-black text-main">400.000.000đ</h2>
        </div>
      </div>

      <!-- Paid Invoices -->
      <div class="stat-card card-slate p-6 rounded-2xl border border-main flex items-center justify-between h-[140px] group">
        <div>
          <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-500/10 text-slate-400 mb-3">
            <el-icon size="20"><Document /></el-icon>
          </div>
          <p class="text-[10px] font-black uppercase tracking-widest text-dim mb-1">Hóa đơn đã thanh toán</p>
          <div class="flex items-baseline gap-2">
            <h2 class="text-2xl font-black text-main">142/150</h2>
            <span class="text-[10px] font-bold text-dim">(95%)</span>
          </div>
        </div>
        <div class="w-16 h-16 relative">
          <svg class="w-full h-full transform -rotate-90">
            <circle cx="32" cy="32" r="28" stroke="currentColor" stroke-width="6" fill="transparent" class="text-slate-700" />
            <circle cx="32" cy="32" r="28" stroke="currentColor" stroke-width="6" fill="transparent" stroke-dasharray="175.9" stroke-dashoffset="8.8" class="text-blue-500" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <!-- Revenue vs Cost Bar Chart -->
      <div class="lg:col-span-2 p-6 rounded-2xl border border-main bg-card">
        <div class="flex items-center justify-between mb-8">
          <h3 class="text-sm font-black text-main uppercase tracking-widest">Doanh thu và Chi phí</h3>
          <div class="flex items-center gap-6">
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-blue-500"></span>
                <span class="text-[10px] font-bold text-dim uppercase">Doanh thu</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-rose-500"></span>
                <span class="text-[10px] font-bold text-dim uppercase">Chi phí</span>
              </div>
            </div>
            <el-select v-model="selectedYear" size="small" class="theme-select-mini" style="width: 100px;">
              <el-option v-for="y in [2024, 2023, 2022]" :key="y" :label="`Năm ${y}`" :value="y" />
            </el-select>
          </div>
        </div>
        <div class="flex gap-4">
          <!-- Y-Axis -->
          <div class="flex flex-col justify-between h-[300px] pb-6 text-[9px] font-black text-dim uppercase tracking-widest text-right w-10">
            <span>1 tỷ</span>
            <span>800m</span>
            <span>600m</span>
            <span>400m</span>
            <span>200m</span>
            <span>0</span>
          </div>
          <!-- Chart Grid -->
          <div class="flex-grow h-[300px] flex items-end justify-between px-4 gap-2 border-l border-b border-main/50 relative">
            <div v-for="i in 12" :key="i" class="flex-grow flex flex-col items-center gap-2 h-full justify-end">
              <div class="w-full flex justify-center gap-1 items-end h-full">
                <div 
                  class="w-2 md:w-3 bg-blue-500 rounded-t-sm transition-all hover:bg-blue-400" 
                  :style="{ height: `${[60, 75, 85, 80, 90, 88, 95, 70, 82, 80, 65, 55][i-1]}%` }"
                ></div>
                <div 
                  class="w-2 md:w-3 bg-rose-500 rounded-t-sm transition-all hover:bg-rose-400" 
                  :style="{ height: `${[40, 45, 50, 42, 48, 44, 52, 38, 45, 42, 35, 30][i-1]}%` }"
                ></div>
              </div>
              <span class="absolute -bottom-6 text-[10px] font-bold text-dim">T{{i}}</span>
            </div>
          </div>
        </div>
        <div class="mt-8 text-center text-[10px] font-black text-dim uppercase tracking-[0.2em]">Bảng thống kê doanh thu và chi theo năm (VNĐ)</div>
      </div>

      <!-- Revenue Structure Donut Chart -->
      <div class="p-6 rounded-2xl border border-main bg-card flex flex-col">
        <h3 class="text-sm font-black text-main uppercase tracking-widest mb-8">Cơ cấu doanh thu</h3>
        <div class="flex-grow flex flex-col items-center justify-center">
          <div class="relative w-48 h-48 mb-8">
            <svg class="w-full h-full transform -rotate-90">
              <!-- Tiền phòng 70% (blue) -->
              <circle cx="96" cy="96" r="80" stroke="currentColor" stroke-width="24" fill="transparent" stroke-dasharray="502.4" stroke-dashoffset="150.72" class="text-blue-500" />
              <!-- Tiền điện 15% (emerald) -->
              <circle cx="96" cy="96" r="80" stroke="currentColor" stroke-width="24" fill="transparent" stroke-dasharray="502.4" stroke-dashoffset="427.04" class="text-emerald-500" style="transform: rotate(252deg); transform-origin: center;" />
              <!-- Tiền nước 8% (amber) -->
              <circle cx="96" cy="96" r="80" stroke="currentColor" stroke-width="24" fill="transparent" stroke-dasharray="502.4" stroke-dashoffset="462.2" class="text-amber-500" style="transform: rotate(306deg); transform-origin: center;" />
              <!-- Dịch vụ khác 7% (slate) -->
              <circle cx="96" cy="96" r="80" stroke="currentColor" stroke-width="24" fill="transparent" stroke-dasharray="502.4" stroke-dashoffset="467.23" class="text-slate-600" style="transform: rotate(335deg); transform-origin: center;" />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-2xl font-black text-main">100%</span>
              <span class="text-[8px] font-black text-dim uppercase tracking-widest">Doanh thu</span>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-x-8 gap-y-4 w-full px-4">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-blue-500"></span>
              <div class="flex flex-col">
                <span class="text-[10px] font-bold text-main" style="font-size: 14px;">Tiền phòng</span>
                <span class="text-[10px] font-black text-blue-500" style="font-size: 13px;">70%</span>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
              <div class="flex flex-col">
                <span class="text-[10px] font-bold text-main" style="font-size: 14px;">Tiền điện</span>
                <span class="text-[10px] font-black text-emerald-500" style="font-size: 13px;">15%</span>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-amber-500"></span>
              <div class="flex flex-col">
                <span class="text-[10px] font-bold text-main" style="font-size: 14px;">Tiền nước</span>
                <span class="text-[10px] font-black text-amber-500" style="font-size: 13px;">8%</span>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-slate-600"></span>
              <div class="flex flex-col">
                <span class="text-[10px] font-bold text-main" style="font-size: 14px;">Dịch vụ khác</span>
                <span class="text-[10px] font-black text-slate-400" style="font-size: 13px;">7%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="rounded-2xl border border-main overflow-hidden shadow-2xl bg-table">
      <div class="px-6 py-5 flex items-center justify-between bg-header">
        <h3 class="text-sm font-black text-main uppercase tracking-widest">Chi tiết theo tòa nhà</h3>
        <button class="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:underline">Xem tất cả</button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm border-collapse">
          <thead class="bg-header">
            <tr class="border-b border-main">
              <th class="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-dim">ID</th>
              <th class="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-dim">Tòa nhà</th>
              <th class="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-dim">Doanh thu</th>
              <th class="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-dim">Chi phí</th>
              <th class="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-dim">Lợi nhuận</th>
              <th class="px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest text-dim">Trạng thái</th>
            </tr>
          </thead>
          <tbody class="bg-table">
            <tr v-for="(row, idx) in paginatedBuildings" :key="idx" class="table-row-hover border-b last:border-0 border-main transition-colors">
              <td class="px-6 py-4 text-[11px] font-black text-id tracking-widest">{{ row.id }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <el-icon><OfficeBuilding /></el-icon>
                  </div>
                  <span class="text-xs font-bold text-main">{{ row.name }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-right text-xs font-black text-main">{{ formatPrice(row.revenue) }}</td>
              <td class="px-6 py-4 text-right text-xs font-bold text-dim">{{ formatPrice(row.cost) }}</td>
              <td class="px-6 py-4 text-right text-xs font-black text-main">{{ formatPrice(row.profit) }}</td>
              <td class="px-6 py-4 text-center">
                <span 
                  class="inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest"
                  :class="row.status === 'up' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'"
                >
                  {{ row.status === 'up' ? 'Tăng trưởng' : 'Giảm' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="px-6 py-4 flex items-center justify-between bg-header border-t border-main">
        <span class="text-[10px] font-bold text-dim uppercase tracking-widest">Tổng cộng <span class="text-main">{{ totalCount }}</span> tòa nhà</span>
        <div class="flex items-center gap-4">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[4, 10, 20]"
            :total="totalCount"
            layout="sizes, prev, pager, next"
            class="custom-pagination"
          />
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  Bell, QuestionFilled, Download, Money, TrendCharts, ShoppingCart, 
  Document, Top, OfficeBuilding, MoreFilled, ArrowLeft, ArrowRight, Plus
} from '@element-plus/icons-vue'

const selectedYear = ref(2024)

const buildingStats = ref([
  { id: '#BD-0102', name: 'Tòa nhà A - Quận 1', revenue: 450000000, cost: 120000000, profit: 330000000, status: 'up' },
  { id: '#BD-0105', name: 'Tòa nhà B - Quận 3', revenue: 320000000, cost: 95000000, profit: 225000000, status: 'up' },
  { id: '#BD-0109', name: 'Vinhomes Central', revenue: 280000000, cost: 110000000, profit: 170000000, status: 'down' },
  { id: '#BD-0112', name: 'Landmark 81', revenue: 200000000, cost: 75000000, profit: 125000000, status: 'up' },
])

const currentPage = ref(1)
const pageSize = ref(4)

const totalCount = ref(0)
import { watch } from 'vue'
watch(buildingStats, (newVal) => {
  totalCount.value = newVal.length
}, { immediate: true })

const paginatedBuildings = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return buildingStats.value.slice(start, start + pageSize.value)
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND',
    maximumFractionDigits: 0 
  }).format(price)
}
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
  --text-id: #3B82F6;
}

html.dark {
  --bg-page: #0f172a;
  --bg-card: #1e293b;
  --bg-table: #0f172a;
  --bg-header: #1e293b;
  --text-main: #f8fafc;
  --text-dim: #94a3b8;
  --border-main: #334155;
  --text-id: #60a5fa;
}
</style>

<style scoped>
.revenue-report-page {
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
.card-emerald { background-color: rgba(16, 185, 129, 0.08) !important; border-color: rgba(16, 185, 129, 0.2) !important; }
.card-rose { background-color: rgba(244, 63, 94, 0.08) !important; border-color: rgba(244, 63, 94, 0.2) !important; }
.card-slate { background-color: rgba(71, 85, 105, 0.08) !important; border-color: rgba(71, 85, 105, 0.2) !important; }

html.dark .card-blue { background-color: rgba(59, 130, 246, 0.15) !important; }
html.dark .card-emerald { background-color: rgba(16, 185, 129, 0.15) !important; }
html.dark .card-rose { background-color: rgba(244, 63, 94, 0.15) !important; }
html.dark .card-slate { background-color: rgba(71, 85, 105, 0.15) !important; }

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.3);
}

.card-blue:hover { background-color: rgba(59, 130, 246, 0.2) !important; }
.card-emerald:hover { background-color: rgba(16, 185, 129, 0.2) !important; }
.card-rose:hover { background-color: rgba(244, 63, 94, 0.2) !important; }
.card-slate:hover { background-color: rgba(71, 85, 105, 0.2) !important; }

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

.table-row-hover:hover {
  background-color: var(--bg-header);
}

/* Custom Chart Animations */
@keyframes grow {
  from { height: 0; }
}
.w-3 {
  animation: grow 1s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>

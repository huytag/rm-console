<template>
  <div class="utilities-page min-h-full p-6 font-inter">
    <!-- Filter Section -->
    <div class="filter-section hover-elevate p-6 rounded-2xl border border-main bg-card mb-6 transition-all duration-300 shadow-2xl">
      <div class="flex flex-wrap gap-4 items-end">
        <div class="w-full md:w-64">
          <label class="text-[10px] font-black text-dim uppercase tracking-widest mb-2 block transition-colors duration-200">Chọn phòng</label>
          <el-select v-model="filterForm.room_id" placeholder="Tất cả phòng" clearable class="w-full transition-transform duration-200">
            <el-option v-for="room in roomOptions" :key="room.id" :label="room.name" :value="room.id" />
          </el-select>
        </div>
        
        <div class="w-full md:w-48">
          <label class="text-[10px] font-black text-dim uppercase tracking-widest mb-2 block transition-colors duration-200">Kỳ hạn (Biểu đồ)</label>
          <el-select v-model="filterForm.period" placeholder="Năm 2024" class="w-full transition-transform duration-200">
            <el-option label="Năm 2024" value="2024" />
            <el-option label="Năm 2023" value="2023" />
            <el-option label="Năm 2022" value="2022" />
          </el-select>
        </div>

        <div class="w-full md:w-80">
          <label class="text-[10px] font-black text-dim uppercase tracking-widest mb-2 block transition-colors duration-200">Thời gian (Lịch sử)</label>
          <el-date-picker
            v-model="filterForm.dateRange"
            type="daterange"
            range-separator="Đến"
            start-placeholder="Từ ngày"
            end-placeholder="Đến ngày"
            value-format="YYYY-MM-DD"
            class="w-full transition-transform duration-200"
          />
        </div>

        <el-button type="primary" @click="fetchData" :loading="loading" class="h-8 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
          Áp dụng
        </el-button>
      </div>
    </div>

    <!-- Chart Section -->
    <div class="chart-section hover-elevate p-6 rounded-2xl border border-main bg-card mb-6 transition-all duration-300 shadow-2xl">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h3 class="text-sm font-black text-main uppercase tracking-widest mb-1">Biểu đồ tiêu thụ điện nước</h3>
          <p class="text-[10px] font-bold text-dim uppercase">Thống kê theo từng tháng</p>
        </div>
      </div>
      
      <div class="transition-opacity duration-500" :class="{'opacity-100': loading, 'hidden': !loading}">
        <el-skeleton animated>
          <template #template>
            <el-skeleton-item variant="rect" style="width: 100%; height: 300px; border-radius: 12px;" />
          </template>
        </el-skeleton>
      </div>
      <div class="h-[300px] w-full transition-opacity duration-500" :class="{'opacity-100': !loading, 'hidden': loading}">
        <Line :data="chartData" :options="chartOptions" />
      </div>
    </div>

    <!-- History Table Section -->
    <div class="history-section hover-elevate rounded-2xl border border-main bg-card overflow-hidden transition-all duration-300 shadow-2xl">
      <div class="px-6 py-5 flex items-center justify-between border-b border-main bg-header/20">
        <h3 class="text-sm font-black text-main uppercase tracking-widest">Lịch sử chốt chỉ số</h3>
      </div>
      
      <div class="p-6 relative min-h-[300px]">
        <div v-if="loading" class="absolute inset-0 p-6 z-10 bg-card transition-opacity duration-500">
          <el-skeleton animated :rows="5" />
        </div>
        
        <div class="transition-opacity duration-500" :class="{'opacity-0': loading, 'opacity-100': !loading}">
          <el-table :data="historyData" style="width: 100%" class="theme-table border border-main rounded-lg overflow-hidden">
            <el-table-column type="expand">
              <template #default="props">
                <div class="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-xl mx-4 my-3 border border-slate-100 dark:border-slate-700 shadow-inner transition-all duration-300">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="space-y-4">
                      <h4 class="text-xs font-black text-dim uppercase tracking-widest flex items-center gap-2">
                        <el-icon><Odometer /></el-icon> Chi tiết Điện & Nước
                      </h4>
                      <div class="space-y-3 bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm">
                        <div class="flex justify-between items-center text-sm">
                          <span class="text-dim font-medium">Chỉ số điện (Cũ ➔ Mới):</span>
                          <span class="font-bold text-blue-600 dark:text-blue-400">
                            {{ props.row.electricity?.old_index || 0 }} ➔ {{ props.row.electricity?.new_index || 0 }}
                          </span>
                        </div>
                        <div class="flex justify-between items-center text-sm">
                          <span class="text-dim font-medium">Chỉ số nước (Cũ ➔ Mới):</span>
                          <span class="font-bold text-emerald-600 dark:text-emerald-400">
                            {{ props.row.water?.old_index || 0 }} ➔ {{ props.row.water?.new_index || 0 }}
                          </span>
                        </div>
                        <div class="flex justify-between items-center text-sm border-t border-slate-100 dark:border-slate-800 pt-3 mt-3">
                          <span class="text-dim font-medium">Người chốt:</span>
                          <div class="flex flex-col items-end">
                            <span class="font-bold text-main">{{ props.row.recorded_by || 'N/A' }}</span>
                            <span class="text-[11px] text-dim">{{ props.row.recorded_at || 'N/A' }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="space-y-4">
                      <h4 class="text-xs font-black text-dim uppercase tracking-widest flex items-center gap-2">
                        <el-icon><Picture /></el-icon> Minh chứng chỉ số
                      </h4>
                      <div class="flex flex-wrap gap-4">
                        <!-- Electricity Proof -->
                        <div class="flex flex-col gap-2">
                          <span class="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Điện</span>
                          <div v-if="props.row.electricity?.image_proof" 
                               class="relative group rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm aspect-video w-[140px] cursor-pointer" 
                               @click="viewProof(props.row.electricity.image_proof)">
                            <el-image 
                              :src="props.row.electricity.image_proof" 
                              fit="cover" 
                              class="w-full h-full transition-transform duration-500 group-hover:scale-105"
                            />
                            <div class="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                              <el-icon class="text-white text-2xl drop-shadow-md"><ZoomIn /></el-icon>
                            </div>
                          </div>
                          <div v-else class="flex flex-col items-center justify-center h-full min-h-[80px] w-[140px] bg-slate-100/50 dark:bg-slate-800/50 rounded-lg border border-dashed border-slate-300 dark:border-slate-600">
                            <el-icon class="text-dim text-xl mb-1"><PictureFilled /></el-icon>
                            <span class="text-[10px] text-dim italic font-medium">Không có ảnh</span>
                          </div>
                        </div>

                        <!-- Water Proof -->
                        <div class="flex flex-col gap-2">
                          <span class="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Nước</span>
                          <div v-if="props.row.water?.image_proof" 
                               class="relative group rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm aspect-video w-[140px] cursor-pointer" 
                               @click="viewProof(props.row.water.image_proof)">
                            <el-image 
                              :src="props.row.water.image_proof" 
                              fit="cover" 
                              class="w-full h-full transition-transform duration-500 group-hover:scale-105"
                            />
                            <div class="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                              <el-icon class="text-white text-2xl drop-shadow-md"><ZoomIn /></el-icon>
                            </div>
                          </div>
                          <div v-else class="flex flex-col items-center justify-center h-full min-h-[80px] w-[140px] bg-slate-100/50 dark:bg-slate-800/50 rounded-lg border border-dashed border-slate-300 dark:border-slate-600">
                            <el-icon class="text-dim text-xl mb-1"><PictureFilled /></el-icon>
                            <span class="text-[10px] text-dim italic font-medium">Không có ảnh</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            
            <el-table-column prop="room_name" label="Phòng" width="120" />
            <el-table-column prop="month_year" label="Kỳ" width="100" />
            
            <el-table-column label="Sử dụng Điện" align="right">
              <template #default="scope">
                <el-tooltip content="Bấm mở rộng để xem chỉ số cũ/mới" placement="top" :show-after="300">
                  <span class="text-blue-500 font-bold px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-md inline-block min-w-[60px] text-center transition-colors hover:bg-blue-100 dark:hover:bg-blue-900/40 cursor-default">
                    {{ scope.row.electricity?.usage || 0 }} <span class="text-[10px] font-normal ml-1">kWh</span>
                  </span>
                </el-tooltip>
              </template>
            </el-table-column>
            
            <el-table-column label="Sử dụng Nước" align="right">
              <template #default="scope">
                <el-tooltip content="Bấm mở rộng để xem chỉ số cũ/mới" placement="top" :show-after="300">
                  <span class="text-emerald-500 font-bold px-2 py-1 bg-emerald-50 dark:bg-emerald-900/20 rounded-md inline-block min-w-[60px] text-center transition-colors hover:bg-emerald-100 dark:hover:bg-emerald-900/40 cursor-default">
                    {{ scope.row.water?.usage || 0 }} <span class="text-[10px] font-normal ml-1">m³</span>
                  </span>
                </el-tooltip>
              </template>
            </el-table-column>

            <el-table-column label="Ngày chốt" align="right" min-width="120">
              <template #default="scope">
                <span class="text-dim font-medium">{{ scope.row.recorded_at }}</span>
              </template>
            </el-table-column>
          </el-table>

          <div class="mt-6 flex justify-end">
            <el-pagination
              v-model:current-page="pagination.page"
              v-model:page-size="pagination.limit"
              :total="pagination.total"
              :page-sizes="[10, 20, 50, 100]"
              layout="total, sizes, prev, pager, next"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              class="shadow-sm border border-slate-100 dark:border-slate-800 rounded-lg px-2 py-1 bg-white dark:bg-slate-900"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Image Proof Dialog -->
    <el-dialog v-model="dialogVisible" title="Ảnh minh chứng chỉ số" width="600px" destroy-on-close class="custom-dialog">
      <div class="flex justify-center items-center p-2 bg-slate-50 dark:bg-slate-900 rounded-lg">
        <el-image 
          :src="currentImageProof" 
          fit="contain" 
          class="w-full max-h-[70vh] rounded shadow-md transition-transform duration-300"
          :preview-src-list="[currentImageProof]"
          :initial-index="0"
        >
          <template #error>
            <div class="flex flex-col items-center justify-center w-full h-[300px] bg-slate-100 dark:bg-slate-800 text-dim rounded">
              <el-icon class="text-4xl mb-3 text-slate-300 dark:text-slate-600"><Warning /></el-icon>
              <span class="font-medium">Không tải được ảnh minh chứng</span>
            </div>
          </template>
        </el-image>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import api from '../axios'
import { ElMessage } from 'element-plus'
import { ZoomIn, Picture, PictureFilled, Odometer, Warning } from '@element-plus/icons-vue'

// Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

// State
const loading = ref(true)
const abortController = ref(null)

const filterForm = reactive({
  room_id: '',
  period: '2024',
  dateRange: []
})

const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0
})

const roomOptions = ref([])
const historyData = ref([])

const dialogVisible = ref(false)
const currentImageProof = ref('')

// Chart Configuration
const chartData = ref({
  labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
  datasets: []
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: '#64748b',
        usePointStyle: true,
        pointStyle: 'circle',
        padding: 20,
        font: {
          family: "'Inter', sans-serif",
          weight: '600',
          size: 12
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      titleFont: { family: "'Inter', sans-serif", size: 13, weight: 'bold' },
      bodyFont: { family: "'Inter', sans-serif", size: 12 },
      padding: 16,
      cornerRadius: 12,
      boxPadding: 6,
      usePointStyle: true,
      borderColor: 'rgba(255,255,255,0.1)',
      borderWidth: 1
    }
  },
  scales: {
    y: {
      type: 'linear',
      display: true,
      position: 'left',
      grid: {
        color: 'rgba(100, 116, 139, 0.08)',
        drawBorder: false,
      },
      border: { dash: [4, 4] },
      ticks: {
        color: '#64748b',
        font: { family: "'Inter', sans-serif", size: 11, weight: '500' }
      }
    },
    y1: {
      type: 'linear',
      display: true,
      position: 'right',
      grid: {
        drawOnChartArea: false,
      },
      ticks: {
        color: '#64748b',
        font: { family: "'Inter', sans-serif", size: 11, weight: '500' }
      }
    },
    x: {
      grid: {
        display: false,
        drawBorder: false,
      },
      ticks: {
        color: '#64748b',
        font: { family: "'Inter', sans-serif", size: 11, weight: '600' },
        padding: 8
      }
    }
  }
}

// Methods
const fetchRooms = async () => {
  try {
    const res = await api.get('/rooms', { params: { limit: 1000 } })
    roomOptions.value = res.data?.data || res.data || []
  } catch (error) {
    console.error('Lỗi khi lấy danh sách phòng:', error)
  }
}

const fetchData = async () => {
  if (abortController.value) {
    abortController.value.abort()
  }
  abortController.value = new AbortController()
  const signal = abortController.value.signal

  loading.value = true
  try {
    const statParams = {
      period: filterForm.period,
      ...(filterForm.room_id && { room_id: filterForm.room_id })
    }
    
    const historyParams = {
      page: pagination.page,
      limit: pagination.limit,
      ...(filterForm.room_id && { room_id: filterForm.room_id }),
      ...(filterForm.dateRange?.[0] && { start_date: filterForm.dateRange[0] }),
      ...(filterForm.dateRange?.[1] && { end_date: filterForm.dateRange[1] })
    }

    const [statRes, historyRes] = await Promise.all([
      api.get('/v1/utilities/statistics', { params: statParams, signal }),
      api.get('/v1/utilities/history', { params: historyParams, signal })
    ])

    const statData = statRes.data?.data || statRes.data
    mapChartData(statData)

    const histData = historyRes.data?.data || historyRes.data
    let rawItems = []
    if (histData.items) {
      rawItems = histData.items
      pagination.total = histData.total || histData.items.length
    } else if (histData.data) {
      rawItems = histData.data
      pagination.total = histData.total || 0
    } else {
      rawItems = Array.isArray(histData) ? histData : []
      pagination.total = rawItems.length
    }

    // Map API fields to template fields
    historyData.value = rawItems.map(item => ({
      ...item,
      room_name: item.room_name || item.room_id || 'N/A',
      month_year: item.billing_cycle || item.month_year,
      recorded_at: item.recorded_date ? new Date(item.recorded_date).toLocaleDateString('vi-VN') : item.recorded_at
    }))

  } catch (error) {
    if (error.name !== 'CanceledError' && error.name !== 'AbortError') {
      ElMessage.error('Không thể tải dữ liệu điện nước')
      console.error(error)
    }
  } finally {
    setTimeout(() => { loading.value = false }, 300) // smooth transition minimum delay
  }
}

const mapChartData = (data) => {
  const electricityData = Array(12).fill(0)
  const waterData = Array(12).fill(0)

  if (Array.isArray(data)) {
    data.forEach(item => {
      const monthIdx = (parseInt(item.month) || 1) - 1
      if (monthIdx >= 0 && monthIdx < 12) {
        electricityData[monthIdx] = item.electricity_kwh || item.electricity_usage || 0
        waterData[monthIdx] = item.water_m3 || item.water_usage || 0
      }
    })
  }

  chartData.value = {
    labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
    datasets: [
      {
        type: 'bar',
        label: 'Điện (kWh)',
        backgroundColor: 'rgba(59, 130, 246, 0.85)',
        hoverBackgroundColor: 'rgba(37, 99, 235, 1)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 0,
        borderRadius: 6,
        data: electricityData,
        yAxisID: 'y',
        order: 2,
        barPercentage: 0.6
      },
      {
        type: 'line',
        label: 'Nước (m³)',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 3,
        pointBackgroundColor: 'rgb(16, 185, 129)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(16, 185, 129)',
        pointHoverBorderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        data: waterData,
        yAxisID: 'y1',
        tension: 0.4,
        order: 1
      }
    ]
  }
}



const viewProof = (url) => {
  currentImageProof.value = url
  dialogVisible.value = true
}

const handleSizeChange = (val) => {
  pagination.limit = val
  fetchData()
}

const handleCurrentChange = (val) => {
  pagination.page = val
  fetchData()
}

onMounted(() => {
  fetchRooms()
  fetchData()
})

onUnmounted(() => {
  if (abortController.value) {
    abortController.value.abort()
  }
})
</script>

<style scoped>
.utilities-page {
  background-color: var(--bg-page);
  color: var(--text-main);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.text-main { color: var(--text-main); }
.text-dim { color: var(--text-dim); }
.bg-card { background-color: var(--bg-card); }
.bg-header { background-color: var(--bg-header); }
.border-main { border-color: var(--border-main); }

.font-inter {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.hover-elevate {
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;
}
.hover-elevate:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
}
html.dark .hover-elevate:hover {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2);
}

/* Table Enhancements */
:deep(.el-table) {
  --el-table-border-color: var(--border-main);
  --el-table-header-bg-color: rgba(248, 250, 252, 0.6);
  --el-table-header-text-color: var(--text-dim);
  --el-table-text-color: var(--text-main);
  --el-table-row-hover-bg-color: rgba(59, 130, 246, 0.04);
  --el-table-expanded-cell-bg-color: transparent;
  background-color: transparent;
  border-radius: 8px;
}

html.dark :deep(.el-table) {
  --el-table-header-bg-color: rgba(30, 41, 59, 0.6);
  --el-table-row-hover-bg-color: rgba(59, 130, 246, 0.08);
}

:deep(.el-table th.el-table__cell) {
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--border-main);
  padding: 12px 0;
}

:deep(.el-table td.el-table__cell) {
  border-bottom: 1px solid var(--border-main);
  font-size: 13px;
  padding: 12px 0;
  transition: background-color 0.2s ease;
}

:deep(.el-table__expanded-cell) {
  padding: 0 !important;
  background-color: transparent !important;
  border-bottom: 1px solid var(--border-main) !important;
}

:deep(.el-table__expanded-cell:hover) {
  background-color: transparent !important;
}

:deep(.el-table__expand-icon) {
  height: 24px;
  width: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
}
:deep(.el-table__expand-icon:hover) {
  background-color: rgba(0,0,0,0.05);
}
html.dark :deep(.el-table__expand-icon:hover) {
  background-color: rgba(255,255,255,0.1);
}

/* Custom Dialog Styling */
:deep(.custom-dialog .el-dialog__header) {
  margin-right: 0;
  border-bottom: 1px solid var(--border-main);
  padding-bottom: 16px;
}
:deep(.custom-dialog .el-dialog__title) {
  font-weight: 800;
  font-size: 16px;
  letter-spacing: 0.02em;
}
</style>

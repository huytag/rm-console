<template>
  <div class="utilities-page min-h-full p-6 font-inter">
    <!-- Filter Section -->
    <div class="filter-section p-6 rounded-2xl border border-main bg-card mb-6">
      <div class="flex flex-wrap gap-4 items-end">
        <div class="w-full md:w-64">
          <label class="text-[10px] font-black text-dim uppercase tracking-widest mb-2 block">Chọn phòng</label>
          <el-select v-model="filterForm.room_id" placeholder="Tất cả phòng" clearable class="w-full">
            <el-option v-for="room in roomOptions" :key="room.id" :label="room.name" :value="room.id" />
          </el-select>
        </div>
        
        <div class="w-full md:w-48">
          <label class="text-[10px] font-black text-dim uppercase tracking-widest mb-2 block">Kỳ hạn (Biểu đồ)</label>
          <el-select v-model="filterForm.period" placeholder="Năm 2024" class="w-full">
            <el-option label="Năm 2024" value="2024" />
            <el-option label="Năm 2023" value="2023" />
            <el-option label="Năm 2022" value="2022" />
          </el-select>
        </div>

        <div class="w-full md:w-80">
          <label class="text-[10px] font-black text-dim uppercase tracking-widest mb-2 block">Thời gian (Lịch sử)</label>
          <el-date-picker
            v-model="filterForm.dateRange"
            type="daterange"
            range-separator="Đến"
            start-placeholder="Từ ngày"
            end-placeholder="Đến ngày"
            value-format="YYYY-MM-DD"
            class="w-full"
          />
        </div>

        <el-button type="primary" @click="fetchData" :loading="loading" class="h-8">
          Áp dụng
        </el-button>
      </div>
    </div>

    <!-- Chart Section -->
    <div class="chart-section p-6 rounded-2xl border border-main bg-card mb-6">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h3 class="text-sm font-black text-main uppercase tracking-widest mb-1">Biểu đồ tiêu thụ điện nước</h3>
          <p class="text-[10px] font-bold text-dim uppercase">Thống kê theo từng tháng</p>
        </div>
      </div>
      
      <div v-if="loading" class="h-[300px]">
        <el-skeleton animated>
          <template #template>
            <el-skeleton-item variant="rect" style="width: 100%; height: 300px;" />
          </template>
        </el-skeleton>
      </div>
      <div v-else class="h-[300px] w-full">
        <Line :data="chartData" :options="chartOptions" />
      </div>
    </div>

    <!-- History Table Section -->
    <div class="history-section rounded-2xl border border-main bg-card overflow-hidden">
      <div class="px-6 py-5 flex items-center justify-between border-b border-main bg-header/20">
        <h3 class="text-sm font-black text-main uppercase tracking-widest">Lịch sử chốt chỉ số</h3>
      </div>
      
      <div class="p-6">
        <el-skeleton v-if="loading" animated :rows="5" />
        
        <template v-else>
          <el-table :data="historyData" style="width: 100%" class="theme-table border border-main rounded-lg">
            <el-table-column prop="room_name" label="Phòng" width="120" />
            <el-table-column prop="month_year" label="Kỳ" width="100" />
            
            <el-table-column label="Điện" align="center">
              <el-table-column prop="electricity.old_index" label="Cũ" width="80" align="right" />
              <el-table-column prop="electricity.new_index" label="Mới" width="80" align="right" />
              <el-table-column prop="electricity.usage" label="Sử dụng" width="90" align="right">
                <template #default="scope">
                  <span class="text-blue-500 font-bold">{{ scope.row.electricity?.usage || 0 }}</span>
                </template>
              </el-table-column>
            </el-table-column>
            
            <el-table-column label="Nước" align="center">
              <el-table-column prop="water.old_index" label="Cũ" width="80" align="right" />
              <el-table-column prop="water.new_index" label="Mới" width="80" align="right" />
              <el-table-column prop="water.usage" label="Sử dụng" width="90" align="right">
                <template #default="scope">
                  <span class="text-emerald-500 font-bold">{{ scope.row.water?.usage || 0 }}</span>
                </template>
              </el-table-column>
            </el-table-column>

            <el-table-column prop="recorded_by" label="Người chốt" />
            <el-table-column prop="recorded_at" label="Ngày chốt" width="120" />
            
            <el-table-column label="Minh chứng" width="120" align="center">
              <template #default="scope">
                <el-button 
                  v-if="scope.row.image_proof" 
                  size="small" 
                  text 
                  type="primary"
                  @click="viewProof(scope.row.image_proof)"
                >
                  Xem ảnh
                </el-button>
                <span v-else class="text-xs text-dim italic">Không có</span>
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
            />
          </div>
        </template>
      </div>
    </div>

    <!-- Image Proof Dialog -->
    <el-dialog v-model="dialogVisible" title="Ảnh minh chứng chỉ số" width="500px" destroy-on-close>
      <div class="flex justify-center items-center p-4">
        <el-image 
          :src="currentImageProof" 
          fit="contain" 
          class="w-full max-h-[400px] rounded border border-main shadow-sm"
          :preview-src-list="[currentImageProof]"
        >
          <template #error>
            <div class="flex items-center justify-center w-full h-[200px] bg-slate-100 dark:bg-slate-800 text-dim">
              Không tải được ảnh minh chứng
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
  LineController,
  BarController
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
  LineController,
  BarController
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
        color: '#64748b', // text-dim
        font: {
          family: "'Inter', sans-serif",
          weight: 'bold',
          size: 11
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      titleFont: { family: "'Inter', sans-serif", size: 13 },
      bodyFont: { family: "'Inter', sans-serif", size: 12 },
      padding: 12,
      cornerRadius: 8,
    }
  },
  scales: {
    y: {
      type: 'linear',
      display: true,
      position: 'left',
      grid: {
        color: 'rgba(100, 116, 139, 0.1)',
        drawBorder: false,
      },
      ticks: {
        color: '#64748b',
        font: { family: "'Inter', sans-serif", size: 10, weight: 'bold' }
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
        font: { family: "'Inter', sans-serif", size: 10, weight: 'bold' }
      }
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: '#64748b',
        font: { family: "'Inter', sans-serif", size: 10, weight: 'bold' }
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
  // Cancel previous requests
  if (abortController.value) {
    abortController.value.abort()
  }
  abortController.value = new AbortController()
  const signal = abortController.value.signal

  loading.value = true
  try {
    // 1. Fetch Statistics
    const statParams = {
      period: filterForm.period,
      ...(filterForm.room_id && { room_id: filterForm.room_id })
    }
    
    // 2. Fetch History
    const historyParams = {
      page: pagination.page,
      limit: pagination.limit,
      ...(filterForm.room_id && { room_id: filterForm.room_id }),
      ...(filterForm.dateRange?.[0] && { start_date: filterForm.dateRange[0] }),
      ...(filterForm.dateRange?.[1] && { end_date: filterForm.dateRange[1] })
    }

    const [statRes, historyRes] = await Promise.all([
      api.get('/utilities/statistics', { params: statParams, signal }).catch(() => ({ data: getMockStatData() })),
      api.get('/utilities/history', { params: historyParams, signal }).catch(() => ({ data: getMockHistoryData() }))
    ])

    // Map Statistics Data
    const statData = statRes.data?.data || statRes.data
    mapChartData(statData)

    // Map History Data
    const histData = historyRes.data?.data || historyRes.data
    if (histData.data) {
      historyData.value = histData.data
      pagination.total = histData.total || 0
    } else {
      historyData.value = Array.isArray(histData) ? histData : []
      pagination.total = historyData.value.length
    }

  } catch (error) {
    if (error.name !== 'CanceledError' && error.name !== 'AbortError') {
      ElMessage.error('Không thể tải dữ liệu điện nước')
      console.error(error)
    }
  } finally {
    loading.value = false
  }
}

const mapChartData = (data) => {
  // Ensure we have an array of 12 months
  const electricityData = Array(12).fill(0)
  const waterData = Array(12).fill(0)

  if (Array.isArray(data)) {
    data.forEach(item => {
      // Expecting item.month (1-12)
      const monthIdx = (parseInt(item.month) || 1) - 1
      if (monthIdx >= 0 && monthIdx < 12) {
        electricityData[monthIdx] = item.electricity_usage || 0
        waterData[monthIdx] = item.water_usage || 0
      }
    })
  }

  chartData.value = {
    labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
    datasets: [
      {
        type: 'bar',
        label: 'Điện (kWh)',
        backgroundColor: 'rgba(59, 130, 246, 0.8)', // blue-500
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
        borderRadius: 4,
        data: electricityData,
        yAxisID: 'y',
        order: 2
      },
      {
        type: 'line',
        label: 'Nước (m³)',
        backgroundColor: 'rgba(16, 185, 129, 0.2)', // emerald-500
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(16, 185, 129)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(16, 185, 129)',
        fill: true,
        data: waterData,
        yAxisID: 'y1',
        tension: 0.4,
        order: 1
      }
    ]
  }
}

// Fallback mocks if API fails or not ready
const getMockStatData = () => {
  return Array.from({ length: 12 }).map((_, i) => ({
    month: i + 1,
    electricity_usage: Math.floor(Math.random() * 500) + 100,
    water_usage: Math.floor(Math.random() * 30) + 5
  }))
}

const getMockHistoryData = () => {
  return {
    total: 25,
    data: Array.from({ length: 10 }).map((_, i) => ({
      id: i,
      room_name: `P.${100 + i}`,
      month_year: '10/2023',
      electricity: { old_index: 1000 + i*10, new_index: 1150 + i*10, usage: 150 },
      water: { old_index: 100 + i*5, new_index: 115 + i*5, usage: 15 },
      recorded_by: 'Admin',
      recorded_at: '2023-10-31',
      image_proof: i % 2 === 0 ? 'https://placeholder.co/600x800' : null
    }))
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
  transition: all 0.3s ease;
}

.text-main { color: var(--text-main); }
.text-dim { color: var(--text-dim); }
.bg-card { background-color: var(--bg-card); }
.bg-header { background-color: var(--bg-header); }
.border-main { border-color: var(--border-main); }

.font-inter {
  font-family: 'Inter', sans-serif;
}

/* Base table styling to match theme */
:deep(.el-table) {
  --el-table-border-color: var(--border-main);
  --el-table-header-bg-color: rgba(248, 250, 252, 0.4);
  --el-table-header-text-color: var(--text-dim);
  --el-table-text-color: var(--text-main);
  --el-table-row-hover-bg-color: rgba(59, 130, 246, 0.04);
  background-color: transparent;
}

html.dark :deep(.el-table) {
  --el-table-header-bg-color: rgba(30, 41, 59, 0.4);
  --el-table-row-hover-bg-color: rgba(59, 130, 246, 0.08);
}

:deep(.el-table th.el-table__cell) {
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--border-main);
}

:deep(.el-table td.el-table__cell) {
  border-bottom: 1px solid var(--border-main);
  font-size: 13px;
}
</style>

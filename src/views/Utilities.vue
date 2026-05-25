<template>
  <div class="utilities-page min-h-full p-6 font-inter">
    <!-- Chart Section -->
    <div class="chart-section hover-elevate p-6 rounded-2xl border border-main bg-card mb-6 transition-all duration-300 shadow-2xl">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h3 class="text-sm font-black text-main uppercase tracking-widest mb-1">Biểu đồ tiêu thụ điện nước</h3>
          <p class="text-[10px] font-bold text-dim uppercase">Thống kê theo từng tháng</p>
        </div>
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-4 pr-6 border-r border-main/30">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full" style="background-color: rgba(244, 63, 94, 0.85);"></span>
              <span class="text-[10px] font-bold text-dim uppercase">Nước (m³)</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full" style="background-color: rgba(59, 130, 246, 0.85);"></span>
              <span class="text-[10px] font-bold text-dim uppercase">Điện (kWh)</span>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-[10px] font-black text-dim uppercase tracking-widest">Kỳ hạn:</span>
            <el-select v-model="filterForm.period" :placeholder="'Năm ' + filterForm.period" size="small" class="theme-select-mini" style="width: 100px;" @change="fetchData">
              <el-option v-for="year in availableYears" :key="year" :label="'Năm ' + year" :value="year" />
            </el-select>
          </div>
        </div>
      </div>
      
      <div class="transition-opacity duration-500" :class="{'opacity-100': loading, 'hidden': !loading}">
        <el-skeleton animated>
          <template #template>
            <div class="h-[300px] w-full flex items-end justify-around px-6 pb-6 pt-10 border border-main/50 rounded-xl bg-slate-50 dark:bg-slate-900/40">
              <el-skeleton-item variant="rect" class="w-12 rounded-t" style="height: 40%" />
              <el-skeleton-item variant="rect" class="w-12 rounded-t" style="height: 70%" />
              <el-skeleton-item variant="rect" class="w-12 rounded-t" style="height: 50%" />
              <el-skeleton-item variant="rect" class="w-12 rounded-t" style="height: 90%" />
              <el-skeleton-item variant="rect" class="w-12 rounded-t" style="height: 60%" />
              <el-skeleton-item variant="rect" class="w-12 rounded-t" style="height: 80%" />
              <el-skeleton-item variant="rect" class="w-12 rounded-t" style="height: 30%" />
              <el-skeleton-item variant="rect" class="w-12 rounded-t" style="height: 75%" />
            </div>
          </template>
        </el-skeleton>
      </div>
      <div class="h-[300px] w-full transition-opacity duration-500" :class="{'opacity-100': !loading, 'hidden': loading}">
        <Bar :data="chartData" :options="chartOptions" />
      </div>
    </div>

    <!-- Filter Section -->
    <div class="filter-section hover-elevate p-6 rounded-2xl border border-main bg-card mb-6 transition-all duration-300 shadow-2xl">
      <div class="flex flex-wrap gap-4 items-end">
        <div class="w-full md:w-64">
          <label class="text-[10px] font-black text-dim uppercase tracking-widest mb-2 block transition-colors duration-200">Thời gian (Lịch sử)</label>
          <el-date-picker
            v-model="filterForm.date"
            type="date"
            placeholder="Chọn ngày"
            value-format="YYYY-MM-DD"
            class="w-full transition-transform duration-200"
          />
        </div>

        <button 
          class="px-6 text-[#10b981] font-bold rounded-lg border border-transparent hover:bg-[rgba(16,185,129,0.25)] transition-all duration-300 flex items-center justify-center cursor-pointer"
          style="background-color: rgba(16, 185, 129, 0.15); height: 32px;"
          @click="fetchData"
          :disabled="loading"
        >
          <span v-if="loading" class="mr-2 border-2 border-[#10b981] border-t-transparent rounded-full w-4 h-4 animate-spin"></span>
          Lọc kết quả
        </button>
      </div>
    </div>

    <!-- History Table Section -->
    <div class="history-section hover-elevate rounded-2xl border border-main bg-table overflow-hidden transition-all duration-300 shadow-2xl">
      <div class="px-6 py-5 flex items-center justify-between border-b border-main bg-header">
        <h3 class="text-sm font-black text-main uppercase tracking-widest">Lịch sử chốt chỉ số</h3>
        <button
          class="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-105 hover:bg-blue-500 hover:shadow-lg active:scale-95"
          style="background-color: #3b82f6"
          @click="createUtility"
        >
          <el-icon><Plus /></el-icon>
          Thêm chỉ số
        </button>
      </div>
      
      <div class="p-6 relative min-h-[300px]">
        <div v-if="loading" class="absolute inset-0 p-6 z-10 bg-card transition-opacity duration-500">
          <el-skeleton animated>
            <template #template>
              <div class="w-full border border-main rounded-lg overflow-hidden">
                <div class="flex gap-4 p-4 border-b border-main bg-slate-50 dark:bg-slate-800/40">
                  <el-skeleton-item variant="text" class="w-20" />
                  <el-skeleton-item variant="text" class="w-24" />
                  <el-skeleton-item variant="text" class="w-20" />
                  <el-skeleton-item variant="text" class="w-20" />
                  <el-skeleton-item variant="text" class="w-24" />
                  <el-skeleton-item variant="text" class="w-32" />
                  <el-skeleton-item variant="text" class="w-24" />
                </div>
                <div v-for="i in 5" :key="i" class="flex gap-4 p-4 border-b border-main/50 last:border-0 items-center">
                  <el-skeleton-item variant="text" class="w-16" />
                  <el-skeleton-item variant="text" class="w-20" />
                  <el-skeleton-item variant="text" class="w-16" />
                  <el-skeleton-item variant="text" class="w-16" />
                  <el-skeleton-item variant="text" class="w-24" />
                  <el-skeleton-item variant="text" class="w-24" />
                  <el-skeleton-item variant="rect" class="w-16 h-6 rounded" />
                </div>
              </div>
            </template>
          </el-skeleton>
        </div>
        
        <div class="transition-opacity duration-500" :class="{'opacity-0': loading, 'opacity-100': !loading}">
          <el-table :data="historyData" style="width: 100%" class="theme-table border-x border-t border-main rounded-t-lg overflow-hidden">
            
            <el-table-column prop="id" label="ID" width="70" align="center" />
            <el-table-column prop="contract_number" label="Mã hợp đồng" width="130" />
            
            <el-table-column prop="service_name" label="Tên dịch vụ" width="120">
              <template #default="scope">
                <span :class="scope.row.service_name?.toLowerCase().includes('điện') ? 'text-blue-500 font-bold' : (scope.row.service_name?.toLowerCase().includes('nước') ? 'text-emerald-500 font-bold' : 'text-main font-bold')">
                  {{ scope.row.service_name || 'N/A' }}
                </span>
              </template>
            </el-table-column>
            
            <el-table-column prop="old_index" label="Chỉ số cũ" align="right" width="100" />
            <el-table-column prop="new_index" label="Chỉ số mới" align="right" width="100" />
            
            <el-table-column prop="unit_price" label="Đơn giá" align="right" width="120">
              <template #default="scope">
                {{ formatPrice(scope.row.unit_price) }}
              </template>
            </el-table-column>
            
            <el-table-column prop="total_amount" label="Thành tiền" align="right" width="140">
              <template #default="scope">
                <span class="font-black text-main">{{ formatPrice(scope.row.total_amount) }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="reading_date" label="Ngày chốt" align="center" min-width="120" />
            
            <el-table-column label="Thao tác" align="center" width="120">
              <template #default="scope">
                <div class="flex items-center justify-center gap-3">
                  <button class="action-btn btn-view" title="Xem chi tiết" @click="viewDetail(scope.row)">
                    <el-icon size="16"><View /></el-icon>
                  </button>
                  <button class="action-btn btn-edit" title="Chỉnh sửa" @click="editUtility(scope.row)">
                    <el-icon size="16"><Edit /></el-icon>
                  </button>
                </div>
              </template>
            </el-table-column>
          </el-table>

          <div class="px-6 py-4 flex items-center justify-between bg-header border-t-0 border border-main rounded-b-lg">
            <span class="text-[11px] font-black text-dim uppercase tracking-widest">
              Tổng cộng <span class="text-main">{{ pagination.total }}</span> bản ghi
            </span>
            <div class="flex items-center gap-4">
              <el-pagination
                v-model:current-page="pagination.page"
                v-model:page-size="pagination.limit"
                :total="pagination.total"
                :page-sizes="[10, 20, 50, 100]"
                layout="total, sizes, prev, pager, next"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                class="custom-pagination"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- View Details Dialog -->
    <el-dialog v-model="viewDialogVisible" title="Chi tiết chỉ số" width="600px" class="custom-dialog">
      <div v-if="currentDetail" class="space-y-4 font-inter text-[13px]">
        <div class="grid grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-main">
          <div><span class="text-dim font-medium mr-2">ID:</span> <span class="font-bold">{{ currentDetail.id }}</span></div>
          <div><span class="text-dim font-medium mr-2">Mã hợp đồng:</span> <span class="font-bold">{{ currentDetail.contract_number }}</span></div>
          <div><span class="text-dim font-medium mr-2">Dịch vụ:</span> <span class="font-bold text-blue-500">{{ currentDetail.service_name }}</span></div>
          <div><span class="text-dim font-medium mr-2">Ngày chốt:</span> <span class="font-bold">{{ currentDetail.reading_date }}</span></div>
          <div><span class="text-dim font-medium mr-2">Chỉ số cũ:</span> <span class="font-bold">{{ currentDetail.old_index }}</span></div>
          <div><span class="text-dim font-medium mr-2">Chỉ số mới:</span> <span class="font-bold">{{ currentDetail.new_index }}</span></div>
          <div><span class="text-dim font-medium mr-2">Sử dụng:</span> <span class="font-bold">{{ (currentDetail.new_index || 0) - (currentDetail.old_index || 0) }}</span></div>
          <div><span class="text-dim font-medium mr-2">Đơn giá:</span> <span class="font-bold">{{ formatPrice(currentDetail.unit_price) }}</span></div>
          <div class="col-span-2 pt-2 border-t border-main">
            <span class="text-dim font-bold mr-2 uppercase text-[10px] tracking-widest">Thành tiền:</span> 
            <span class="font-black text-rose-500 text-lg">{{ formatPrice(currentDetail.total_amount) }}</span>
          </div>
        </div>
        <div class="mt-4">
          <h4 class="text-[11px] font-black uppercase text-dim tracking-widest mb-3">Ảnh minh chứng</h4>
          <el-image 
            v-if="currentDetail.image"
            :src="currentDetail.image" 
            fit="contain" 
            class="w-full max-h-[300px] rounded shadow-sm border border-main bg-slate-50 dark:bg-slate-900"
            :preview-src-list="[currentDetail.image]"
            :initial-index="0"
          />
          <div v-else class="flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-800/40 rounded border border-dashed border-main">
            <span class="text-sm text-dim italic">Chưa có ảnh minh chứng</span>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- CRUD Form Dialog -->
    <el-dialog v-model="formDialogVisible" :title="dialogType === 'create' ? 'Thêm chỉ số' : 'Cập nhật chỉ số'" width="500px" class="custom-dialog">
      <el-form :model="utilityForm" label-position="top" class="p-4 grid grid-cols-2 gap-x-4 gap-y-2">
        <el-form-item v-if="dialogType === 'create'" label="Mã hóa đơn" class="col-span-1">
          <el-input v-model="utilityForm.contract_number" placeholder="Nhập mã hóa đơn" class="w-full" />
        </el-form-item>
        <el-form-item v-if="dialogType === 'create'" label="Dịch vụ" class="col-span-1">
          <el-select v-model="utilityForm.service_id" placeholder="Chọn dịch vụ" class="w-full">
            <el-option v-for="service in serviceOptions" :key="service.id" :label="service.name" :value="service.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="Chỉ số cũ" class="col-span-1">
          <el-input-number v-model="utilityForm.old_index" :min="0" class="w-full" />
        </el-form-item>
        <el-form-item label="Chỉ số mới" class="col-span-1">
          <el-input-number v-model="utilityForm.new_index" :min="utilityForm.old_index || 0" class="w-full" />
        </el-form-item>
        <el-form-item label="Đơn giá" class="col-span-1">
          <el-input-number v-model="utilityForm.unit_price" :min="0" class="w-full" :step="1000" />
        </el-form-item>
        <el-form-item label="Thành tiền" class="col-span-1">
          <el-input-number v-model="utilityForm.total_amount" :min="0" class="w-full" :step="1000" />
        </el-form-item>
        <el-form-item label="Ngày chốt" class="col-span-2">
          <el-date-picker v-model="utilityForm.reading_date" type="date" placeholder="Chọn ngày" format="DD/MM/YYYY" value-format="YYYY-MM-DD" class="w-full" />
        </el-form-item>
        <el-form-item label="Ảnh minh chứng" class="col-span-2">
          <div v-if="utilityForm.image" class="relative group rounded-lg overflow-hidden border border-slate-200 w-[140px] h-[80px]">
            <el-image :src="utilityForm.image" fit="cover" class="w-full h-full" />
            <div class="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <el-button type="danger" size="small" circle @click="removeImage"><el-icon><Delete /></el-icon></el-button>
            </div>
          </div>
          <el-upload v-else action="#" :auto-upload="false" :show-file-list="false" :on-change="handleImageChange" class="w-full">
            <el-button type="primary" plain size="small">Chọn ảnh tải lên</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="formDialogVisible = false">Hủy</el-button>
          <el-button type="primary" @click="saveUtility">Lưu</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import api from '../axios'
import { ElMessage } from 'element-plus'
import { ZoomIn, Picture, PictureFilled, Odometer, Warning, Plus, Edit, Delete, View } from '@element-plus/icons-vue'

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND',
    maximumFractionDigits: 0 
  }).format(price || 0)
}

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
import { Bar } from 'vue-chartjs'

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
  period: '2024',
  date: ''
})

const availableYears = ref(['2024'])

const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0
})

const roomOptions = ref([])
const serviceOptions = ref([])
const historyData = ref([])

const viewDialogVisible = ref(false)
const currentDetail = ref(null)

const formDialogVisible = ref(false)
const dialogType = ref('create')
const utilityForm = reactive({
  id: null,
  contract_number: '',
  service_id: '',
  old_index: 0,
  new_index: 0,
  unit_price: 0,
  total_amount: 0,
  image: null,
  reading_date: ''
})

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
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      titleFont: { family: "'Inter', sans-serif", size: 14, weight: 'bold' },
      bodyFont: { family: "'Inter', sans-serif", size: 13, weight: '500' },
      padding: 16,
      cornerRadius: 12,
      boxPadding: 8,
      usePointStyle: true,
      borderColor: 'rgba(255,255,255,0.1)',
      borderWidth: 1,
      callbacks: {
        label: function(context) {
          return context.dataset.label + ': ' + context.parsed.y;
        }
      }
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

const fetchServices = async () => {
  try {
    const res = await api.get('/services')
    serviceOptions.value = res.data?.data || res.data || []
  } catch (error) {
    console.error('Lỗi khi lấy danh sách dịch vụ:', error)
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
      period: filterForm.period ? `year_${filterForm.period}` : 'year_2024'
    }
    
    const historyParams = {
      page: pagination.page,
      limit: pagination.limit
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

    const yearsSet = new Set()
    rawItems.forEach(item => {
      if (item.billing_cycle) {
        const parts = item.billing_cycle.split('/')
        if (parts.length === 2) {
          yearsSet.add(parts[1])
        }
      } else if (item.recorded_date) {
        const year = new Date(item.recorded_date).getFullYear().toString()
        yearsSet.add(year)
      }
    })

    if (yearsSet.size > 0) {
      availableYears.value = Array.from(yearsSet).sort((a, b) => b - a)
      if (!availableYears.value.includes(filterForm.period)) {
        filterForm.period = availableYears.value[0]
      }
    }

    const mappedItems = []
    rawItems.forEach((item, index) => {
      // 1. Electricity Row
      if (item.electricity) {
        mappedItems.push({
          id: index * 2 + 1,
          contract_number: `HD-${item.billing_cycle ? item.billing_cycle.replace('/', '') : '2024'}-01`,
          service_name: 'Điện',
          old_index: item.electricity.old_index || 0,
          new_index: item.electricity.new_index || 0,
          unit_price: 3500,
          total_amount: (item.electricity.usage || (item.electricity.new_index - item.electricity.old_index) || 0) * 3500,
          reading_date: item.recorded_date ? new Date(item.recorded_date).toLocaleDateString('vi-VN') : '',
          image: item.electricity.image_proof || null
        })
      }
      // 2. Water Row
      if (item.water) {
        mappedItems.push({
          id: index * 2 + 2,
          contract_number: `HD-${item.billing_cycle ? item.billing_cycle.replace('/', '') : '2024'}-02`,
          service_name: 'Nước',
          old_index: item.water.old_index || 0,
          new_index: item.water.new_index || 0,
          unit_price: 25000,
          total_amount: (item.water.usage || (item.water.new_index - item.water.old_index) || 0) * 25000,
          reading_date: item.recorded_date ? new Date(item.recorded_date).toLocaleDateString('vi-VN') : '',
          image: item.water.image_proof || null
        })
      }
    })

    if (filterForm.date) {
      const filterDateStr = new Date(filterForm.date).toLocaleDateString('vi-VN')
      historyData.value = mappedItems.filter(item => item.reading_date === filterDateStr)
      pagination.total = historyData.value.length
    } else {
      historyData.value = mappedItems
      pagination.total = mappedItems.length
    }

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
        electricityData[monthIdx] += item.electricity_kwh || item.electricity_usage || 0
        waterData[monthIdx] += item.water_m3 || item.water_usage || 0
      }
    })
  }

  chartData.value = {
    labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
    datasets: [
      {
        type: 'bar',
        label: 'Nước (m³)',
        backgroundColor: 'rgba(244, 63, 94, 0.85)',
        hoverBackgroundColor: 'rgba(225, 29, 72, 1)',
        borderColor: 'rgb(244, 63, 94)',
        borderWidth: 0,
        borderRadius: { topLeft: 4, topRight: 4 },
        data: waterData,
        yAxisID: 'y1',
        order: 1,
        barPercentage: 0.6
      },
      {
        type: 'bar',
        label: 'Điện (kWh)',
        backgroundColor: 'rgba(59, 130, 246, 0.85)',
        hoverBackgroundColor: 'rgba(37, 99, 235, 1)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 0,
        borderRadius: { topLeft: 4, topRight: 4 },
        data: electricityData,
        yAxisID: 'y',
        order: 2,
        barPercentage: 0.6
      }
    ]
  }
}


const viewDetail = (row) => {
  currentDetail.value = row
  viewDialogVisible.value = true
}

const createUtility = () => {
  dialogType.value = 'create'
  Object.assign(utilityForm, { id: null, contract_number: '', service_id: '', old_index: 0, new_index: 0, unit_price: 0, total_amount: 0, image: null, reading_date: '' })
  formDialogVisible.value = true
}

const editUtility = (row) => {
  dialogType.value = 'edit'
  Object.assign(utilityForm, { ...row })
  formDialogVisible.value = true
}

const deleteUtility = async (row) => {
  try {
    await api.delete(`/v1/utilities/${row.id}`)
    ElMessage.success('Xóa thành công')
    fetchData()
  } catch(error) {
    ElMessage.error('Lỗi khi xóa bản ghi')
  }
}

const saveUtility = async () => {
  try {
    if (dialogType.value === 'create') {
      await api.post('/v1/utilities', utilityForm)
      ElMessage.success('Thêm thành công')
    } else {
      await api.put(`/v1/utilities/${utilityForm.id}`, utilityForm)
      ElMessage.success('Cập nhật thành công')
    }
    formDialogVisible.value = false
    fetchData()
  } catch (error) {
    ElMessage.error('Đã xảy ra lỗi khi lưu')
  }
}

const handleImageChange = (file) => {
  utilityForm.image = URL.createObjectURL(file.raw)
}

const removeImage = () => {
  utilityForm.image = null
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
  fetchServices()
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

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-input, #f1f5f9);
  color: var(--text-dim);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

html.dark .action-btn {
  background-color: var(--bg-input, #1f2937);
}

.btn-edit:hover {
  background-color: rgba(16, 185, 129, 0.15) !important;
  color: #10b981 !important;
}

.btn-view:hover {
  background-color: rgba(59, 130, 246, 0.15) !important;
  color: #3b82f6 !important;
}

.btn-delete:hover {
  background-color: rgba(239, 68, 68, 0.15) !important;
  color: #ef4444 !important;
}

.font-inter {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

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
  --el-table-header-bg-color: var(--bg-header);
  --el-table-header-text-color: var(--text-dim);
  --el-table-text-color: var(--text-main);
  --el-table-row-hover-bg-color: var(--bg-header);
  --el-table-expanded-cell-bg-color: transparent;
  --el-table-bg-color: var(--bg-table);
  --el-table-tr-bg-color: var(--bg-table);
  background-color: var(--bg-table);
  border-radius: 8px 8px 0 0;
}

:deep(.el-table th.el-table__cell) {
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--border-main);
  padding: 20px 0;
  background-color: var(--el-table-header-bg-color) !important;
}

:deep(.el-table td.el-table__cell) {
  border-bottom: 1px solid var(--border-main);
  font-size: 13px;
  padding: 20px 0;
  transition: background-color 0.2s ease;
  background-color: inherit;
}

:deep(.el-table .el-table-fixed-column--right), 
:deep(.el-table__fixed-right) {
  background-color: var(--bg-table) !important;
  z-index: 20 !important;
}
:deep(.el-table th.el-table__cell.el-table-fixed-column--right) {
  background-color: var(--bg-header) !important;
}
:deep(.el-table__row:hover .el-table-fixed-column--right),
:deep(.el-table__row:hover .el-table__fixed-right) {
  background-color: var(--bg-header) !important;
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
:deep(.custom-dialog) {
  border-radius: 16px !important;
  overflow: hidden;
}
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
  --text-id: #3b82f6;
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

/* Unscoped CSS for absolute dark mode overriding without Vue compiler interference */
html.dark .utilities-page .el-table .el-table-fixed-column--right,
html.dark .utilities-page .el-table .el-table__fixed-right,
html.dark .utilities-page .el-table th.el-table__cell.el-table-fixed-column--right {
  background-color: var(--bg-table) !important;
}

html.dark .utilities-page .el-table__row:hover .el-table-fixed-column--right,
html.dark .utilities-page .el-table__row:hover .el-table__fixed-right {
  background-color: var(--bg-header) !important;
}

html.dark .utilities-page .el-table {
  --el-table-header-bg-color: var(--bg-header) !important;
  --el-table-row-hover-bg-color: var(--bg-header) !important;
}
</style>

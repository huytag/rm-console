<template>
  <div class="utilities-page min-h-full p-6 font-inter">
    <!-- Filter Section -->
    <div class="filter-section hover-elevate p-6 rounded-2xl border border-main bg-card mb-6 transition-all duration-300 shadow-2xl">
      <div class="flex flex-wrap gap-4 items-end">
        <div class="w-full md:w-64">
          <label class="text-[10px] font-black text-dim uppercase tracking-widest mb-2 block transition-colors duration-200">Chọn phòng</label>
          <el-select v-model="filterForm.room_id" placeholder="Tất cả phòng" clearable class="w-full transition-transform duration-200">
            <el-option v-for="room in roomOptions" :key="room.id" :label="room.room_number || room.name" :value="room.id" />
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

        <el-button type="primary" @click="fetchData" :loading="loading" class="ml-8 h-8 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
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
        <Line :data="chartData" :options="chartOptions" />
      </div>
    </div>

    <!-- History Table Section -->
    <div class="history-section hover-elevate rounded-2xl border border-main bg-card overflow-hidden transition-all duration-300 shadow-2xl">
      <div class="px-6 py-5 flex items-center justify-between border-b border-main bg-header/20">
        <h3 class="text-sm font-black text-main uppercase tracking-widest">Lịch sử chốt chỉ số</h3>
        <el-button type="primary" size="small" @click="createUtility" class="shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
          <el-icon class="mr-1"><Plus /></el-icon> Thêm chỉ số
        </el-button>
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
          <el-table :data="historyData" style="width: 100%" class="theme-table border border-main rounded-lg overflow-hidden">
            
            <el-table-column prop="room_number" label="Phòng" width="100" />
            
            <el-table-column prop="service_name" label="Dịch vụ" width="120">
              <template #default="scope">
                <span :class="scope.row.service_name?.toLowerCase().includes('điện') ? 'text-blue-500 font-bold' : (scope.row.service_name?.toLowerCase().includes('nước') ? 'text-emerald-500 font-bold' : 'text-main font-bold')">
                  {{ scope.row.service_name || 'N/A' }}
                </span>
              </template>
            </el-table-column>
            
            <el-table-column prop="old_index" label="CS Cũ" align="right" width="100" />
            <el-table-column prop="new_index" label="CS Mới" align="right" width="100" />
            
            <el-table-column label="Sử dụng" align="right" width="100">
              <template #default="scope">
                <span class="font-bold">{{ (scope.row.new_index || 0) - (scope.row.old_index || 0) }}</span>
              </template>
            </el-table-column>
            
            <el-table-column prop="unit_price" label="Đơn giá" align="right" width="120">
              <template #default="scope">
                {{ formatPrice(scope.row.unit_price) }}
              </template>
            </el-table-column>
            
            <el-table-column prop="total_amount" label="Thành tiền" align="right" width="140">
              <template #default="scope">
                <span class="font-black text-rose-500">{{ formatPrice(scope.row.total_amount) }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="reading_date" label="Ngày chốt" align="center" min-width="120" />
            
            <el-table-column label="Minh chứng" align="center" width="110">
              <template #default="scope">
                <el-button 
                  v-if="scope.row.image" 
                  size="small" 
                  text 
                  type="primary"
                  @click="viewProof(scope.row.image)"
                >
                  Xem ảnh
                </el-button>
                <span v-else class="text-xs text-dim italic">Chưa có</span>
              </template>
            </el-table-column>

            <el-table-column label="Thao tác" align="center" width="120" fixed="right">
              <template #default="scope">
                <div class="flex items-center justify-center gap-3">
                  <button class="action-btn btn-edit" title="Chỉnh sửa" @click="editUtility(scope.row)">
                    <el-icon size="16"><Edit /></el-icon>
                  </button>
                  <el-popconfirm title="Bạn có chắc muốn xóa chỉ số này?" @confirm="deleteUtility(scope.row)" width="220" confirm-button-type="danger">
                    <template #reference>
                      <button class="action-btn btn-delete" title="Xóa">
                        <el-icon size="16"><Delete /></el-icon>
                      </button>
                    </template>
                  </el-popconfirm>
                </div>
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

    <!-- CRUD Form Dialog -->
    <el-dialog v-model="formDialogVisible" :title="dialogType === 'create' ? 'Thêm chỉ số' : 'Cập nhật chỉ số'" width="500px" class="custom-dialog">
      <el-form :model="utilityForm" label-position="top" class="p-4 grid grid-cols-2 gap-x-4 gap-y-2">
        <el-form-item v-if="dialogType === 'create'" label="Phòng" class="col-span-1">
          <el-select v-model="utilityForm.room_id" placeholder="Chọn phòng" class="w-full">
            <el-option v-for="room in roomOptions" :key="room.id" :label="room.room_number || room.name" :value="room.id" />
          </el-select>
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
import { ZoomIn, Picture, PictureFilled, Odometer, Warning, Plus, Edit, Delete } from '@element-plus/icons-vue'

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
const serviceOptions = ref([])
const historyData = ref([])

const dialogVisible = ref(false)
const currentImageProof = ref('')

const formDialogVisible = ref(false)
const dialogType = ref('create')
const utilityForm = reactive({
  id: null,
  room_id: '',
  service_id: '',
  old_index: 0,
  new_index: 0,
  unit_price: 0,
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
      room_number: item.room?.room_number || item.room_number || item.room_name || 'N/A',
      service_name: item.service?.name || item.name_service || item.service_name || 'N/A',
      old_index: Number(item.old_index) || 0,
      new_index: Number(item.new_index) || 0,
      unit_price: Number(item.unit_price) || 0,
      total_amount: Number(item.total_amount) || 0,
      reading_date: item.reading_date ? new Date(item.reading_date).toLocaleDateString('vi-VN') : (item.recorded_at || 'N/A'),
      image: item.image || item.image_proof || null
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

const createUtility = () => {
  dialogType.value = 'create'
  Object.assign(utilityForm, { id: null, room_id: '', service_id: '', old_index: 0, new_index: 0, unit_price: 0, image: null, reading_date: '' })
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
  --el-table-header-bg-color: var(--bg-card);
  --el-table-header-text-color: var(--text-dim);
  --el-table-text-color: var(--text-main);
  --el-table-row-hover-bg-color: #f1f5f9;
  --el-table-expanded-cell-bg-color: transparent;
  --el-table-bg-color: var(--bg-card);
  --el-table-tr-bg-color: var(--bg-card);
  background-color: var(--bg-card);
  border-radius: 8px;
}

:deep(.el-table th.el-table__cell) {
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--border-main);
  padding: 12px 0;
  background-color: var(--el-table-header-bg-color) !important;
}

:deep(.el-table td.el-table__cell) {
  border-bottom: 1px solid var(--border-main);
  font-size: 13px;
  padding: 12px 0;
  transition: background-color 0.2s ease;
  background-color: inherit;
}

:deep(.el-table .el-table-fixed-column--right), 
:deep(.el-table__fixed-right) {
  background-color: #f8fafc !important;
  z-index: 20 !important;
}
:deep(.el-table th.el-table__cell.el-table-fixed-column--right) {
  background-color: #f8fafc !important;
}
:deep(.el-table__row:hover .el-table-fixed-column--right),
:deep(.el-table__row:hover .el-table__fixed-right) {
  background-color: #f1f5f9 !important;
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

<style>
/* Unscoped CSS for absolute dark mode overriding without Vue compiler interference */
html.dark .utilities-page .el-table .el-table-fixed-column--right,
html.dark .utilities-page .el-table .el-table__fixed-right,
html.dark .utilities-page .el-table th.el-table__cell.el-table-fixed-column--right {
  background-color: #0f172a !important;
}

html.dark .utilities-page .el-table__row:hover .el-table-fixed-column--right,
html.dark .utilities-page .el-table__row:hover .el-table__fixed-right {
  background-color: #1e293b !important;
}

html.dark .utilities-page .el-table {
  --el-table-header-bg-color: #1e293b !important;
  --el-table-row-hover-bg-color: #1e293b !important;
}
</style>

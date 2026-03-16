<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-value">{{ stats.totalRooms }}</div>
            <div class="stat-label">Tổng phòng</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-value">{{ stats.emptyRooms }}</div>
            <div class="stat-label">Phòng trống</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-value">{{ stats.rentedRooms }}</div>
            <div class="stat-label">Đã cho thuê</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-value">{{ stats.unpaidInvoices }}</div>
            <div class="stat-label">Hóa đơn chưa thanh toán</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>Trạng thái phòng</span>
          </template>
          <div class="chart-container">
            <Pie :data="roomStatusData" :options="pieOptions" />
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header-custom">
              <span>Doanh thu (VNĐ)</span>
              <el-select v-model="selectedYear" size="small" @change="fetchRevenue">
                <el-option v-for="year in years" :key="year" :label="`Năm ${year}`" :value="year" />
              </el-select>
            </div>
          </template>
          <div class="chart-container">
            <Bar :data="revenueData" :options="barOptions" />
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>Danh sách phòng trống</span>
          </template>
          <el-table :data="emptyRooms" size="small" max-height="250">
            <el-table-column prop="room_number" label="Phòng" width="100" />
            <el-table-column prop="building.name" label="Tòa nhà" />
            <el-table-column label="Giá">
              <template #default="{ row }">
                {{ formatPrice(row.price) }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>Khách nợ tiền phòng</span>
          </template>
          <el-table :data="debtors" size="small" max-height="250">
            <el-table-column label="Phòng" width="80">
              <template #default="{ row }">
                {{ row.contract?.room?.room_number }}
              </template>
            </el-table-column>
            <el-table-column label="Khách">
              <template #default="{ row }">
                {{ row.contract?.tenant?.name }}
              </template>
            </el-table-column>
            <el-table-column label="Tháng/Năm" width="100">
              <template #default="{ row }">
                {{ row.month }}/{{ row.year }}
              </template>
            </el-table-column>
            <el-table-column label="Còn nợ">
              <template #default="{ row }">
                {{ formatPrice(row.total_amount - row.paid_amount) }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Pie, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import api from '../axios'

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend)

const stats = ref({
  totalRooms: 0,
  emptyRooms: 0,
  rentedRooms: 0,
  unpaidInvoices: 0,
})

const emptyRooms = ref([])
const debtors = ref([])
const selectedYear = ref(new Date().getFullYear())
const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)

const roomStatusData = ref({
  labels: ['Trống', 'Đang thuê', 'Bảo trì'],
  datasets: [{ data: [0, 0, 0], backgroundColor: ['#67c23a', '#f56c6c', '#e6a23c'] }],
})

const revenueData = ref({
  labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
  datasets: [{ label: 'Doanh thu (VNĐ)', data: Array(12).fill(0), backgroundColor: '#409eff' }],
})

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
}

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
  scales: {
    y: { beginAtZero: true },
  },
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

const fetchStats = async () => {
  try {
    const response = await api.get('/dashboard')
    stats.value = response.data.stats
  } catch (error) {
    console.error('Failed to load stats:', error)
  }
}

const fetchRoomStatus = async () => {
  try {
    const response = await api.get('/dashboard/room-status')
    roomStatusData.value = response.data
  } catch (error) {
    console.error('Failed to load room status:', error)
  }
}

const fetchRevenue = async () => {
  try {
    const response = await api.get('/dashboard/revenue', { params: { year: selectedYear.value } })
    revenueData.value = response.data
  } catch (error) {
    console.error('Failed to load revenue:', error)
  }
}

const fetchEmptyRooms = async () => {
  try {
    const response = await api.get('/dashboard/empty-rooms')
    emptyRooms.value = response.data.data
  } catch (error) {
    console.error('Failed to load empty rooms:', error)
  }
}

const fetchDebtors = async () => {
  try {
    const response = await api.get('/dashboard/debtors')
    debtors.value = response.data.data
  } catch (error) {
    console.error('Failed to load debtors:', error)
  }
}

onMounted(() => {
  fetchStats()
  fetchRoomStatus()
  fetchRevenue()
  fetchEmptyRooms()
  fetchDebtors()
})
</script>

<style scoped>
.dashboard {
  height: 100%;
}

.stat-card {
  text-align: center;
}

.stat-content {
  padding: 10px;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #409eff;
}

.stat-label {
  font-size: 14px;
  color: #606266;
  margin-top: 8px;
}

.chart-container {
  height: 250px;
}

.card-header-custom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

<template>
  <div class="rooms-container min-h-full p-6 bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-inter">
    <!-- 1. Toolbar & Filters -->
    <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 mb-8 flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <div class="flex flex-col">
          <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tòa nhà</label>
          <el-select v-model="activeBuilding" placeholder="Chọn tòa nhà" class="custom-select-v3">
            <el-option v-for="b in buildings" :key="b.id" :label="b.name" :value="b.id" />
          </el-select>
        </div>
        
        <div class="flex flex-col">
          <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tầng</label>
          <el-select v-model="selectedFloor" placeholder="Tất cả tầng" clearable class="custom-select-v3">
            <el-option v-for="f in floors" :key="f" :label="`Tầng ${f}`" :value="f" />
          </el-select>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <el-button
          type="primary"
          class="!rounded-xl !h-10 px-6 font-bold shadow-lg shadow-blue-100 dark:shadow-none"
          style="background-color: #3B82F6; border-color: #3B82F6;"
        >
          <el-icon class="mr-2"><Plus /></el-icon> Thêm phòng
        </el-button>
      </div>
    </div>

    <!-- 2. Status Legend & Quick Stats -->
    <div class="flex flex-wrap items-center justify-between gap-6 mb-8 px-2">
      <div class="flex items-center gap-6">
        <div class="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
          <span class="w-3 h-3 rounded-full bg-[#10b981]"></span> Trống
        </div>
        <div class="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
          <span class="w-3 h-3 rounded-full bg-[#3b82f6]"></span> Đã thuê
        </div>
        <div class="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
          <span class="w-3 h-3 rounded-full bg-[#ef4444]"></span> Nợ tiền
        </div>
        <div class="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
          <span class="w-3 h-3 rounded-full bg-[#facc15]"></span> Đặt cọc
        </div>
        <div class="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
          <span class="w-3 h-3 rounded-full bg-[#94a3b8]"></span> Bảo trì
        </div>
      </div>

      <div class="text-sm font-bold text-slate-600 dark:text-slate-300">
        Tổng số: <span class="text-primary">{{ rooms.length }}</span> phòng
      </div>
    </div>

    <!-- 3. Main Grid Grouped by Floor -->
    <div v-loading="loading" class="space-y-12">
      <div v-for="floor in sortedFloors" :key="floor" class="space-y-6">
        <div class="flex items-center gap-4">
          <h3 class="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Tầng {{ floor }}</h3>
          <div class="h-[1px] flex-1 bg-slate-200 dark:bg-slate-700"></div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          <!-- Room Card Component -->
          <div
            v-for="room in getRoomsByFloor(floor)"
            :key="room.id"
            class="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
            @click="openRoomDetail(room)"
          >
            <!-- Status Indicator Line -->
            <div 
              class="absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl"
              :style="{ backgroundColor: getStatusColor(room.status) }"
            ></div>

            <!-- Room Header -->
            <div class="flex justify-between items-start mb-6 mt-2">
              <div>
                <h4 class="text-xl font-black text-slate-800 dark:text-white group-hover:text-primary transition-colors">
                  {{ room.room_number }}
                </h4>
                <p class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-1">
                  {{ room.room_type || 'Phòng tiêu chuẩn' }}
                </p>
              </div>
            </div>

            <!-- Room Body -->
            <div class="space-y-4 mb-6">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center border border-slate-100 dark:border-slate-600">
                  <el-icon class="text-slate-400"><User /></el-icon>
                </div>
                <div>
                  <p class="text-sm font-bold text-slate-700 dark:text-slate-200 truncate max-w-[120px]">
                    {{ room.tenant_name || (room.status === 'empty' ? 'Đang trống' : '---') }}
                  </p>
                  <p class="text-[10px] text-slate-400 font-medium">Khách thuê</p>
                </div>
              </div>

              <div class="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span class="text-xs flex items-center gap-1.5"><el-icon><Wallet /></el-icon> {{ formatPrice(room.price) }}</span>
                <span class="text-xs font-bold flex items-center gap-1"><el-icon><UserFilled /></el-icon> 2/3</span>
              </div>
            </div>

            <!-- Quick Actions Footer -->
            <div class="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-700">
              <span class="text-[10px] font-black uppercase tracking-tight" :style="{ color: getStatusColor(room.status) }">
                {{ getStatusLabel(room.status) }}
              </span>
              <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-blue-600 text-slate-500 dark:text-slate-300 transition-colors flex items-center justify-center" title="Lập hóa đơn">
                  <el-icon><Document /></el-icon>
                </button>
                <button class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-blue-600 text-slate-500 dark:text-slate-300 transition-colors flex items-center justify-center" title="Chỉnh sửa">
                  <el-icon><EditPen /></el-icon>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../axios'
import { 
  Plus, 
  Refresh, 
  User, 
  UserFilled, 
  Wallet, 
  InfoFilled, 
  Warning, 
  Document, 
  EditPen 
} from '@element-plus/icons-vue'

const buildings = ref([])
const rooms = ref([])
const activeBuilding = ref(null)
const selectedFloor = ref(null)
const loading = ref(false)

const floors = computed(() => {
  if (!activeBuilding.value) return []
  const floorSet = new Set(
    rooms.value
      .filter(r => r.building_id === activeBuilding.value)
      .map(r => r.floor)
      .filter(Boolean)
  )
  return Array.from(floorSet).sort((a, b) => a - b)
})

const sortedFloors = computed(() => {
  if (selectedFloor.value) return [selectedFloor.value]
  return floors.value
})

const getRoomsByFloor = (floor) => {
  return rooms.value
    .filter(r => r.building_id === activeBuilding.value && r.floor === floor)
    .sort((a, b) => a.room_number.localeCompare(b.room_number))
}

const getStatusColor = (status) => {
  const colors = {
    empty: '#10b981',
    rented: '#3b82f6',
    overdue: '#ef4444',
    maintenance: '#94a3b8',
    deposit: '#facc15'
  }
  return colors[status] || '#94a3b8'
}

const getStatusLabel = (status) => {
  const labels = {
    empty: 'Phòng trống',
    rented: 'Đã thuê',
    overdue: 'Nợ tiền',
    maintenance: 'Bảo trì',
    deposit: 'Đặt cọc'
  }
  return labels[status] || 'Không xác định'
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(price)
}

const fetchBuildings = async () => {
  try {
    const response = await api.get('/buildings')
    buildings.value = response.data.data
  } catch (error) {
    console.error('Fetch error, using mock data')
    buildings.value = [{ id: 1, name: 'Tòa nhà chính' }]
  } finally {
    if (buildings.value.length > 0 && !activeBuilding.value) {
      activeBuilding.value = buildings.value[0].id
    }
  }
}

const fetchRooms = async () => {
  loading.value = true
  try {
    const response = await api.get('/rooms')
    rooms.value = response.data.data
  } catch (error) {
    console.error('Fetch error, using mock data')
    rooms.value = [
      { id: 1, building_id: 1, room_number: '101', floor: 1, status: 'overdue', tenant_name: 'Nguyễn Văn A', price: 3500000 },
      { id: 2, building_id: 1, room_number: '102', floor: 1, status: 'empty', tenant_name: null, price: 3000000 },
      { id: 3, building_id: 1, room_number: '103', floor: 1, status: 'rented', tenant_name: 'Trần Thị B', price: 3200000 },
      { id: 4, building_id: 1, room_number: '201', floor: 2, status: 'rented', tenant_name: 'Lê Văn C', price: 3000000 },
      { id: 5, building_id: 1, room_number: '202', floor: 2, status: 'maintenance', tenant_name: null, price: 3000000 },
      { id: 6, building_id: 1, room_number: '203', floor: 2, status: 'empty', tenant_name: null, price: 3000000 },
    ]
  } finally {
    loading.value = false
  }
}

const openRoomDetail = (room) => {
  console.log('Room clicked:', room)
}

onMounted(async () => {
  await Promise.all([fetchBuildings(), fetchRooms()])
})
</script>

<style scoped>
.custom-select-v3 {
  width: 160px;
}

.custom-select-v3 :deep(.el-input__wrapper) {
  background-color: #f8fafc !important;
  border-radius: 10px;
  height: 40px;
  box-shadow: none !important;
  border: 1px solid #e2e8f0 !important;
}

.custom-select-v3 :deep(.el-input__inner) {
  color: #1e293b !important;
  font-weight: 700 !important;
  font-family: 'Inter', sans-serif;
}

:deep(.dark) .custom-select-v3 :deep(.el-input__wrapper) {
  background-color: #1e293b !important;
  border-color: #334155 !important;
}

:deep(.dark) .custom-select-v3 :deep(.el-input__inner) {
  color: #ffffff !important;
}

:deep(.el-select__placeholder) {
  color: #94a3b8 !important;
}

.font-inter {
  font-family: 'Inter', sans-serif;
}
</style>

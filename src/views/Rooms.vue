<template>
  <div class="rooms-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>Sơ Đồ Phòng</span>
          <el-button type="primary" @click="refreshRooms">Làm mới</el-button>
        </div>
      </template>
      
      <div class="building-tabs">
        <el-tabs v-model="activeBuilding">
          <el-tab-pane
            v-for="building in buildings"
            :key="building.id"
            :label="building.name"
            :name="building.id"
          >
            <div class="floor-filter">
              <el-select v-model="selectedFloor" placeholder="Tất cả tầng" clearable>
                <el-option
                  v-for="floor in getFloors(building.id)"
                  :key="floor"
                  :label="`Tầng ${floor}`"
                  :value="floor"
                />
              </el-select>
            </div>
            
            <div class="rooms-grid">
              <div
                v-for="room in filteredRooms"
                :key="room.id"
                class="room-card"
                :class="getRoomClass(room.status)"
                @click="openRoomDetail(room)"
              >
                <div class="room-number">{{ room.room_number }}</div>
                <div class="room-price">{{ formatPrice(room.price) }}</div>
                <div class="room-status">{{ getStatusLabel(room.status) }}</div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../axios'
import { ElMessage } from 'element-plus'

const buildings = ref([])
const rooms = ref([])
const activeBuilding = ref(null)
const selectedFloor = ref(null)
const loading = ref(false)

const filteredRooms = computed(() => {
  let result = rooms.value.filter(r => r.building_id === activeBuilding.value)
  if (selectedFloor.value) {
    result = result.filter(r => r.floor === selectedFloor.value)
  }
  return result
})

const getFloors = (buildingId) => {
  const floors = new Set(
    rooms.value
      .filter(r => r.building_id === buildingId)
      .map(r => r.floor)
      .filter(Boolean)
  )
  return Array.from(floors).sort()
}

const getRoomClass = (status) => {
  const classes = {
    empty: 'room-empty',
    rented: 'room-rented',
    maintenance: 'room-maintenance',
  }
  return classes[status] || ''
}

const getStatusLabel = (status) => {
  const labels = {
    empty: 'Trống',
    rented: 'Đã thuê',
    maintenance: 'Bảo trì',
  }
  return labels[status] || status
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

const fetchBuildings = async () => {
  try {
    const response = await api.get('/buildings')
    buildings.value = response.data.data
    if (buildings.value.length > 0) {
      activeBuilding.value = buildings.value[0].id
    }
  } catch (error) {
    ElMessage.error('Failed to load buildings')
  }
}

const fetchRooms = async () => {
  loading.value = true
  try {
    const response = await api.get('/rooms')
    rooms.value = response.data.data
  } catch (error) {
    ElMessage.error('Failed to load rooms')
  } finally {
    loading.value = false
  }
}

const refreshRooms = () => {
  fetchRooms()
}

const openRoomDetail = (room) => {
  console.log('Open room detail:', room)
}

onMounted(() => {
  fetchBuildings()
  fetchRooms()
})
</script>

<style scoped>
.rooms-page {
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.building-tabs {
  min-height: 400px;
}

.floor-filter {
  margin-bottom: 20px;
}

.rooms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
}

.room-card {
  padding: 16px;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.room-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.room-empty {
  background: #f0f9eb;
  border-color: #67c23a;
}

.room-rented {
  background: #fef0f0;
  border-color: #f56c6c;
}

.room-maintenance {
  background: #fdf6ec;
  border-color: #e6a23c;
}

.room-number {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
}

.room-price {
  font-size: 14px;
  color: #606266;
  margin-bottom: 4px;
}

.room-status {
  font-size: 12px;
  font-weight: 500;
}
</style>

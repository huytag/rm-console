<template>
  <div class="buildings-container min-h-full p-8 bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-inter">
    <!-- 1. Global Stats Header -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <div class="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-5">
        <div class="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <el-icon size="28"><OfficeBuilding /></el-icon>
        </div>
        <div>
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tổng tòa nhà</p>
          <h3 class="text-2xl font-black text-slate-800 dark:text-white">{{ buildings.length }}</h3>
        </div>
      </div>
      
      <div class="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-5">
        <div class="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <el-icon size="28"><House /></el-icon>
        </div>
        <div>
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tổng số phòng</p>
          <h3 class="text-2xl font-black text-slate-800 dark:text-white">{{ totalRooms }}</h3>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-5">
        <div class="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
          <el-icon size="28"><PieChart /></el-icon>
        </div>
        <div>
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tỷ lệ lấp đầy</p>
          <h3 class="text-2xl font-black text-slate-800 dark:text-white">{{ occupancyRate }}%</h3>
        </div>
      </div>
    </div>

    <!-- 2. Google Maps View -->
    <div class="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden mb-10 h-[400px] relative group">
      <div class="absolute top-4 left-4 z-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur px-4 py-2 rounded-xl shadow-lg border border-slate-200 dark:border-slate-600">
        <p class="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
          <el-icon class="text-rose-500"><LocationFilled /></el-icon> Bản đồ vị trí tòa nhà
        </p>
      </div>
      <!-- Iframe giả lập Google Maps cho demo -->
      <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.863981044334!2d105.78031841424536!3d21.03812779283313!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab354920c233%3A0x5d0313c39613e61e!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBDw7RuZyBuZ2jhu4cgLSDEkEhRR0hO!5e0!3m2!1svi!2s!4v1652165000000!5m2!1svi!2s" 
        width="100%" 
        height="100%" 
        style="border:0;" 
        allowfullscreen="" 
        loading="lazy" 
        referrerpolicy="no-referrer-when-downgrade"
        class="grayscale-[0.2] contrast-[1.1] dark:invert-[0.9] dark:hue-rotate-180"
      ></iframe>
    </div>

    <!-- 3. Building List Header -->
    <div class="flex items-center justify-between mb-8 px-2">
      <h2 class="text-xl font-black text-slate-800 dark:text-white tracking-tight uppercase">Danh sách tòa nhà</h2>
      <el-button type="primary" class="!rounded-2xl !h-11 px-8 font-black shadow-xl shadow-blue-200 dark:shadow-none hover:scale-105 transition-transform">
        <el-icon class="mr-2"><Plus /></el-icon> Thêm tòa nhà mới
      </el-button>
    </div>

    <!-- 4. Building Grid -->
    <div v-loading="loading" class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8">
      <div 
        v-for="b in buildings" 
        :key="b.id" 
        class="group bg-white dark:bg-slate-800 rounded-[32px] border border-slate-100 dark:border-slate-700 p-2 shadow-sm hover:shadow-2xl hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-500"
      >
        <div class="flex flex-col md:flex-row gap-6 p-4">
          <!-- Building Image/Thumb -->
          <div class="w-full md:w-40 h-40 rounded-[24px] bg-slate-100 dark:bg-slate-700 overflow-hidden relative">
            <img :src="b.image || 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=400'" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
              <el-button type="primary" size="small" circle @click="viewOnMap(b)">
                <el-icon><Location /></el-icon>
              </el-button>
            </div>
          </div>

          <!-- Building Info -->
          <div class="flex-1 flex flex-col">
            <div class="flex justify-between items-start mb-2">
              <h4 class="text-lg font-black text-slate-800 dark:text-white leading-tight truncate max-w-[200px]">
                {{ b.name }}
              </h4>
              <div class="flex gap-1">
                <el-button size="small" circle class="!border-none !bg-slate-50 dark:!bg-slate-700"><el-icon><Edit /></el-icon></el-button>
                <el-button size="small" circle type="danger" plain class="!border-none"><el-icon><Delete /></el-icon></el-button>
              </div>
            </div>
            
            <p class="text-xs text-slate-400 dark:text-slate-500 font-medium mb-4 flex items-center gap-1">
              <el-icon><Location /></el-icon> {{ b.address }}
            </p>

            <!-- Stats Badge -->
            <div class="grid grid-cols-2 gap-3 mb-4">
              <div class="bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Doanh thu dự tính</p>
                <p class="text-sm font-black text-emerald-600 dark:text-emerald-400">{{ formatPrice(b.estimated_revenue) }}</p>
              </div>
              <div class="bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Trạng thái phòng</p>
                <p class="text-sm font-black text-blue-600 dark:text-blue-400">{{ b.occupied_rooms }}/{{ b.total_rooms }}</p>
              </div>
            </div>

            <!-- Occupancy Progress -->
            <div class="mt-auto">
              <div class="flex justify-between items-center mb-1.5">
                <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tỷ lệ lấp đầy</span>
                <span class="text-[10px] font-black text-blue-600">{{ Math.round((b.occupied_rooms / b.total_rooms) * 100) }}%</span>
              </div>
              <div class="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-1000"
                  :style="{ width: `${(b.occupied_rooms / b.total_rooms) * 100}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Footer Action -->
        <div class="mt-2 px-4 pb-4">
          <router-link :to="'/rooms?building=' + b.id" class="w-full h-12 rounded-2xl bg-slate-800 dark:bg-slate-700 hover:bg-blue-600 transition-all flex items-center justify-center gap-2 text-white text-xs font-black uppercase tracking-widest">
            Quản lý sơ đồ phòng <el-icon><ArrowRight /></el-icon>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../axios'
import { 
  OfficeBuilding, 
  House, 
  PieChart, 
  LocationFilled, 
  Plus, 
  Location, 
  Edit, 
  Delete, 
  ArrowRight 
} from '@element-plus/icons-vue'

const buildings = ref([])
const loading = ref(false)

const totalRooms = computed(() => buildings.value.reduce((acc, b) => acc + (b.total_rooms || 0), 0))
const occupiedRooms = computed(() => buildings.value.reduce((acc, b) => acc + (b.occupied_rooms || 0), 0))
const occupancyRate = computed(() => totalRooms.value ? Math.round((occupiedRooms.value / totalRooms.value) * 100) : 0)

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(price)
}

const fetchBuildings = async () => {
  loading.value = true
  try {
    const response = await api.get('/buildings')
    buildings.value = response.data.data
  } catch (error) {
    console.error('Fetch buildings error, using mock data')
    // Mock data với doanh thu và số phòng cho từng tòa
    buildings.value = [
      { 
        id: 1, 
        name: 'Tòa nhà Blue Moon', 
        address: '123 Cầu Giấy, Hà Nội', 
        total_rooms: 20, 
        occupied_rooms: 18, 
        estimated_revenue: 72000000,
        image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=400'
      },
      { 
        id: 2, 
        name: 'Green House - Kim Mã', 
        address: '45 Kim Mã, Ba Đình', 
        total_rooms: 15, 
        occupied_rooms: 10, 
        estimated_revenue: 45000000,
        image: 'https://images.unsplash.com/photo-1560448204-61dc36dc98c8?auto=format&fit=crop&q=80&w=400'
      },
      { 
        id: 3, 
        name: 'Sunlight Apartment', 
        address: '88 Láng Hạ, Đống Đa', 
        total_rooms: 30, 
        occupied_rooms: 25, 
        estimated_revenue: 110000000,
        image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=400'
      }
    ]
  } finally {
    loading.value = false
  }
}

const viewOnMap = (building) => {
  console.log('Viewing building on map:', building.name)
  // Logic mở Google Maps link hoặc zoom map iframe
}

onMounted(() => {
  fetchBuildings()
})
</script>

<style scoped>
.font-inter {
  font-family: 'Inter', sans-serif;
}

/* Custom scrollbar cho các card nếu cần */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
</style>

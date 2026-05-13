<template>
  <div class="buildings-container min-h-full p-8 bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-inter">
    <!-- 1. Global Stats Header -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <div class="stat-card card-blue p-6 rounded-3xl border border-main flex items-center gap-5">
        <div class="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <el-icon size="28"><OfficeBuilding /></el-icon>
        </div>
        <div>
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tổng tòa nhà</p>
          <h3 class="text-2xl font-black text-slate-800 dark:text-white">{{ buildings.length }}</h3>
        </div>
      </div>
      
      <div class="stat-card card-emerald p-6 rounded-3xl border border-main flex items-center gap-5">
        <div class="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <el-icon size="28"><House /></el-icon>
        </div>
        <div>
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tổng số phòng</p>
          <h3 class="text-2xl font-black text-slate-800 dark:text-white">{{ totalRooms }}</h3>
        </div>
      </div>

      <div class="stat-card card-amber p-6 rounded-3xl border border-main flex items-center gap-5">
        <div class="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
          <el-icon size="28"><PieChart /></el-icon>
        </div>
        <div>
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tỷ lệ lấp đầy</p>
          <h3 class="text-2xl font-black text-slate-800 dark:text-white">{{ occupancyRate }}%</h3>
        </div>
      </div>
    </div>


    <!-- 3. Building List Header -->
    <div class="flex items-center justify-between mb-8 px-2">
      <h2 class="text-xl font-black text-slate-800 dark:text-white tracking-tight uppercase">Danh sách tòa nhà</h2>
      <el-button type="primary" 
                class="!rounded-2xl !h-11 px-8 font-black shadow-xl shadow-blue-200 dark:shadow-none hover:scale-105 transition-all active:scale-95"
                style="background-color: #3B82F6; border-color: #3B82F6;"
                @click="showCreateDialog"
                >
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
          </div>

          <!-- Building Info -->
          <div class="flex-1 flex flex-col">
            <div class="flex justify-between items-start mb-2">
              <h4 class="text-lg font-black text-slate-800 dark:text-white leading-tight truncate max-w-[200px]">
                {{ b.name }}
              </h4>
              <div class="flex gap-1">
                <el-button size="small" circle class="!border-none !bg-slate-50 dark:!bg-slate-700"><el-icon><Edit /></el-icon></el-button>
                <el-button size="small" circle type="danger" plain class="!border-none" @click="handleDelete(b)"><el-icon><Delete /></el-icon></el-button>
              </div>
            </div>
            
            <p class="text-xs text-slate-400 dark:text-slate-400 font-medium mb-4 flex items-center gap-1">
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

  <!-- Dialog Thêm tòa nhà -->
  <el-dialog 
    v-model="dialogVisible" 
    title="Thêm tòa nhà mới" 
    width="550px"
    class="theme-dialog-v3"
    append-to-body
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-position="top" class="mt-2">
      <div class="grid grid-cols-1 gap-4">
        <el-form-item label="Tên tòa nhà" prop="name" required>
          <el-input v-model="form.name" placeholder="Ví dụ: Tòa nhà Blue Moon..." />
        </el-form-item>
      </div>

      <el-form-item label="Địa chỉ" prop="address" required>
        <el-input v-model="form.address" placeholder="Số nhà, Tên đường, Quận/Huyện..." />
      </el-form-item>

      <div class="grid grid-cols-2 gap-4">
        <el-form-item label="Tổng số phòng" prop="total_rooms" required>
          <el-input-number v-model="form.total_rooms" :min="1" class="!w-full" />
        </el-form-item>
        <el-form-item label="Doanh thu dự tính (VNĐ)" prop="estimated_revenue" required>
          <el-input v-model.number="form.estimated_revenue" placeholder="Ví dụ: 50000000">
            <template #append>VNĐ</template>
          </el-input>
        </el-form-item>
      </div>

      <el-form-item label="Link ảnh tòa nhà" prop="image">
        <el-input v-model="form.image" placeholder="https://images.unsplash.com/..." />
      </el-form-item>
      
      <el-form-item label="Mô tả chi tiết" prop="description">
        <el-input v-model="form.description" type="textarea" :rows="3" placeholder="Nhập các thông tin bổ sung về tòa nhà..." />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="flex justify-end gap-3 px-4 pb-4 mt-4">
        <el-button @click="dialogVisible = false" class="theme-btn-cancel">Hủy bỏ</el-button>
        <el-button type="primary" @click="submitForm" class="theme-btn-submit">
          Tạo tòa nhà ngay
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  OfficeBuilding, 
  House, 
  PieChart, 
  Plus, 
  Location, 
  Edit, 
  Delete, 
  ArrowRight 
} from '@element-plus/icons-vue'

const buildings = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const formRef = ref(null)

const rules = {
  name: [{ required: true, message: 'Vui lòng nhập tên tòa nhà', trigger: 'blur' }],
  address: [{ required: true, message: 'Vui lòng nhập địa chỉ', trigger: 'blur' }],
  total_rooms: [{ required: true, message: 'Vui lòng nhập số phòng', trigger: 'blur' }],
  estimated_revenue: [{ required: true, message: 'Vui lòng nhập doanh thu dự tính', trigger: 'blur' }],
}

const form = ref({
  name: '',
  address: '',
  total_rooms: 10,
  estimated_revenue: null,
  image: '',
  description: ''
})

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

const showCreateDialog = () => {
  form.value = {
    name: '',
    address: '',
    total_rooms: 10,
    estimated_revenue: null,
    image: '',
    description: ''
  }
  dialogVisible.value = true
}

const submitForm = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  console.log('Submit building:', form.value)
  // Thực hiện gọi API thêm tòa nhà ở đây
  dialogVisible.value = false
  ElMessage.success('Khởi tạo tòa nhà thành công')
}

const handleDelete = async (building) => {
  try {
    await ElMessageBox.confirm(
      `Bạn có chắc chắn muốn xóa tòa nhà "${building.name}" không? Toàn bộ dữ liệu phòng và khách thuê liên quan sẽ bị ảnh hưởng.`,
      'Cảnh báo xóa',
      {
        confirmButtonText: 'Xác nhận xóa',
        cancelButtonText: 'Hủy bỏ',
        type: 'warning',
        buttonSize: 'default',
        customClass: 'theme-message-box'
      }
    )
    
    // Thực hiện gọi API xóa ở đây
    console.log('Deleting building:', building.id)
    ElMessage.success(`Đã xóa tòa nhà "${building.name}" thành công`)
    
    // Cập nhật lại danh sách sau khi xóa (giả lập)
    buildings.value = buildings.value.filter(b => b.id !== building.id)
    
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Có lỗi xảy ra khi xóa tòa nhà')
    }
  }
}


onMounted(() => {
  fetchBuildings()
})
</script>

<style scoped>
.font-inter {
  font-family: 'Inter', sans-serif;
}

.stat-card {
  transition: all 0.3s ease;
  backdrop-filter: blur(12px);
}

.card-blue { background-color: rgba(59, 130, 246, 0.05); border-color: rgba(59, 130, 246, 0.1); }
.card-emerald { background-color: rgba(16, 185, 129, 0.05); border-color: rgba(16, 185, 129, 0.1); }
.card-amber { background-color: rgba(245, 158, 11, 0.05); border-color: rgba(245, 158, 11, 0.1); }

.dark .card-blue { background-color: rgba(59, 130, 246, 0.1); border-color: rgba(59, 130, 246, 0.2); }
.dark .card-emerald { background-color: rgba(16, 185, 129, 0.1); border-color: rgba(16, 185, 129, 0.2); }
.dark .card-amber { background-color: rgba(245, 158, 11, 0.1); border-color: rgba(245, 158, 11, 0.2); }

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.1);
}

.card-blue:hover { background-color: rgba(59, 130, 246, 0.15); border-color: rgba(59, 130, 246, 0.3); }
.card-emerald:hover { background-color: rgba(16, 185, 129, 0.15); border-color: rgba(16, 185, 129, 0.3); }
.card-amber:hover { background-color: rgba(245, 158, 11, 0.15); border-color: rgba(245, 158, 11, 0.3); }

/* Custom scrollbar cho các card nếu cần */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

/* Dialog Theme Customization */
:deep(.theme-dialog-v3) {
  border-radius: 24px;
  overflow: hidden;
  background-color: #ffffff;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
}

:deep(.dark) :deep(.theme-dialog-v3) {
  background-color: #1e293b !important;
  border: 1px solid #334155;
}

:deep(.theme-dialog-v3 .el-dialog__header) {
  padding: 24px 32px;
  margin-right: 0;
  border-bottom: 1px solid #f1f5f9;
}

:deep(.dark) :deep(.theme-dialog-v3 .el-dialog__header) {
  border-bottom-color: #334155;
}

:deep(.theme-dialog-v3 .el-dialog__title) {
  font-weight: 900;
  font-size: 1.25rem;
  color: #1e293b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

:deep(.dark) :deep(.theme-dialog-v3 .el-dialog__title) {
  color: #ffffff;
}

:deep(.theme-dialog-v3 .el-dialog__body) {
  padding: 32px;
}

:deep(.theme-dialog-v3 .el-form-item__label) {
  font-weight: 800;
  color: #64748b;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
}

:deep(.dark) :deep(.theme-dialog-v3 .el-form-item__label) {
  color: #94a3b8;
}

:deep(.theme-dialog-v3 .el-input__wrapper) {
  background-color: #f8fafc !important;
  box-shadow: none !important;
  border: 1px solid #e2e8f0 !important;
  border-radius: 12px;
  padding: 8px 12px;
}

:deep(.dark) :deep(.theme-dialog-v3 .el-input__wrapper) {
  background-color: #0f172a !important;
  border-color: #334155 !important;
}

:deep(.theme-dialog-v3 .el-input__inner) {
  font-weight: 600;
  color: #1e293b;
}

:deep(.dark) :deep(.theme-dialog-v3 .el-input__inner) {
  color: #ffffff;
}

.theme-btn-cancel {
  border-radius: 12px;
  height: 44px;
  padding: 0 24px;
  font-weight: 700;
  border: 1px solid #e2e8f0;
  background: transparent;
  color: #64748b;
}

.dark .theme-btn-cancel {
  border-color: #334155;
  color: #94a3b8;
}

.theme-btn-submit {
  border-radius: 12px;
  height: 44px;
  padding: 0 24px;
  font-weight: 700;
  background-color: #3b82f6 !important;
  border: none !important;
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
}
</style>

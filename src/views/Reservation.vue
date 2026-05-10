<template>
  <div class="reservation-page min-h-full p-6 font-inter">
    
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Tổng tiền cọc (Toàn bộ) -->
      <div class="card-item flex items-center gap-4 p-5 rounded-2xl border border-main">
        <div class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style="background-color: var(--stat-primary-bg);">
          <el-icon size="24" style="color: #3B82F6;"><Wallet /></el-icon>
        </div>
        <div>
          <p class="text-xs font-bold uppercase tracking-widest mb-1 text-dim">Tổng tiền cọc</p>
          <p class="text-2xl font-black text-main">{{ formatPrice(totalDeposit) }}</p>
        </div>
      </div>

      <!-- Đã cọc (Confirmed) -->
      <div class="card-item flex items-center gap-4 p-5 rounded-2xl border border-main">
        <div class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style="background-color: var(--stat-success-bg);">
          <el-icon size="24" style="color: #10B981;"><CircleCheck /></el-icon>
        </div>
        <div>
          <p class="text-xs font-bold uppercase tracking-widest mb-1 text-dim">Đã cọc</p>
          <p class="text-2xl font-black text-main">{{ stats.confirmed }}</p>
        </div>
      </div>

      <!-- Chờ duyệt (Pending) -->
      <div class="card-item flex items-center gap-4 p-5 rounded-2xl border border-main">
        <div class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style="background-color: var(--stat-warning-bg);">
          <el-icon size="24" style="color: #f59e0b;"><Timer /></el-icon>
        </div>
        <div>
          <p class="text-xs font-bold uppercase tracking-widest mb-1 text-dim">Chờ duyệt</p>
          <p class="text-2xl font-black text-main">{{ stats.pending }}</p>
        </div>
      </div>

      <!-- Quá hạn (Expired) -->
      <div class="card-item flex items-center gap-4 p-5 rounded-2xl border border-main">
        <div class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style="background-color: var(--stat-error-bg);">
          <el-icon size="24" style="color: #ef4444;"><Warning /></el-icon>
        </div>
        <div>
          <p class="text-xs font-bold uppercase tracking-widest mb-1 text-dim">Quá hạn/Hủy</p>
          <p class="text-2xl font-black text-main">{{ stats.expired + stats.cancelled }}</p>
        </div>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="flex flex-wrap items-center justify-between mb-6 gap-4">
      <div class="flex items-center gap-4">
        <!-- Building select -->
        <el-select
          v-model="filters.building"
          placeholder="Chọn tòa nhà"
          clearable
          class="reservation-select"
          style="width: 200px;"
        >
          <el-option v-for="b in buildings" :key="b.id" :label="b.name" :value="b.id" />
        </el-select>

        <!-- Date picker -->
        <el-date-picker
          v-model="filters.expected_checkin"
          type="date"
          placeholder="Ngày nhận phòng dự kiến"
          class="reservation-datepicker"
          format="DD/MM/YYYY"
          style="width: 240px;"
        />
      </div>

      <button
        class="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-105"
        style="background-color: #3B82F6;"
        @click="showCreateDialog"
      >
        <el-icon><Plus /></el-icon>
        Thêm mới
      </button>
    </div>

    <!-- Table Section -->
    <div class="table-container rounded-2xl border border-main overflow-hidden shadow-2xl">
      <div class="overflow-x-auto">
        <table class="w-full text-sm border-collapse">
          <thead class="table-head">
            <tr class="border-b border-main">
              <th class="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-dim">ID</th>
              <th class="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-dim">Phòng</th>
              <th class="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-dim">Khách hàng</th>
              <th class="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-dim">Số điện thoại</th>
              <th class="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-dim">Kết thúc giữ</th>
              <th class="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-dim">Nhận phòng</th>
              <th class="px-6 py-5 text-right text-[11px] font-black uppercase tracking-widest text-dim">Tiền cọc</th>
              <th class="px-6 py-5 text-center text-[11px] font-black uppercase tracking-widest text-dim">Thanh toán</th>
              <th class="px-6 py-5 text-center text-[11px] font-black uppercase tracking-widest text-dim">Trạng thái</th>
            </tr>
          </thead>
          <tbody v-if="!loading" class="table-body">
            <tr
              v-for="(row, index) in paginatedReservations"
              :key="row.id"
              class="table-row transition-colors border-b last:border-0 border-row"
            >
              <!-- ID -->
              <td class="px-6 py-5">
                <span class="font-bold text-xs text-id">#RES-{{ String(row.id).padStart(4, '0') }}</span>
              </td>

              <!-- Phòng -->
              <td class="px-6 py-5">
                <p class="font-bold text-main text-sm mb-0.5">{{ row.room?.room_number || row.room_number }}</p>
                <p class="text-[11px] text-dim font-medium mt-0.5">{{ row.building_name || 'Landmark 81' }}</p>
              </td>

              <!-- Khách hàng -->
              <td class="px-6 py-5">
                <p class="font-bold text-main text-sm">{{ row.customer_name }}</p>
              </td>

              <!-- Số điện thoại -->
              <td class="px-6 py-5">
                <p class="text-muted font-medium text-sm">{{ formatPhone(row.customer_phone) }}</p>
              </td>

              <!-- Kết thúc giữ -->
              <td class="px-6 py-5">
                <span class="font-bold text-main text-xs">{{ formatDateStr(row.expired_at) }}</span>
              </td>

              <!-- Nhận phòng -->
              <td class="px-6 py-5">
                <span class="font-bold text-main text-xs">{{ formatDateStr(row.check_in_date || row.expired_at) }}</span>
              </td>

              <!-- Tiền cọc -->
              <td class="px-6 py-5 text-right">
                <span class="font-black text-main text-sm">{{ formatPriceWithoutCurrency(row.deposit_amount) }}</span>
              </td>

              <!-- Thanh toán -->
              <td class="px-6 py-5">
                <div class="flex items-center justify-center gap-2">
                  <el-icon size="16" style="color: var(--text-dim);">
                    <CreditCard v-if="row.payment_method === 'Chuyển khoản' || !row.payment_method" />
                    <WalletFilled v-else />
                  </el-icon>
                  <span class="font-bold text-muted text-[11px] uppercase">{{ row.payment_method || 'Chuyển khoản' }}</span>
                </div>
              </td>

              <!-- Trạng thái -->
              <td class="px-6 py-5 text-center">
                <span
                  class="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                  :style="getStatusStyle(row.status)"
                >
                  {{ getStatusLabel(row.status) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination-bar px-6 py-4 flex items-center justify-between border-t border-main">
        <span class="text-xs font-bold text-dim uppercase tracking-widest">Tổng cộng <span class="text-main">{{ filteredReservations.length }}</span> phiếu giữ chỗ</span>
        <div class="flex items-center gap-2">
          <button class="w-8 h-8 rounded-lg flex items-center justify-center text-dim hover:text-main" :disabled="currentPage === 1" @click="currentPage--"><el-icon><ArrowLeft /></el-icon></button>
          <button 
            v-for="page in visiblePages" 
            :key="page"
            class="w-8 h-8 rounded-lg text-xs font-black transition-all"
            :class="page === currentPage ? 'bg-blue-600 text-white' : 'text-dim hover:text-main'"
            @click="currentPage = page"
          >
            {{ page }}
          </button>
          <button class="w-8 h-8 rounded-lg flex items-center justify-center text-dim hover:text-main" :disabled="currentPage === totalPages" @click="currentPage++">
            <el-icon><ArrowRight /></el-icon>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Dialog Thêm cọc -->
    <el-dialog v-model="dialogVisible" title="Thêm đặt cọc" width="500px" class="reservation-dialog">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="130px">
        <el-form-item label="Phòng" prop="room_id">
          <el-select v-model="form.room_id" style="width: 100%;" placeholder="Chọn phòng">
            <el-option
              v-for="room in emptyRooms"
              :key="room.id"
              :label="`${room.room_number} - ${formatPrice(room.price)}`"
              :value="room.id"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="Tên khách hàng" prop="customer_name">
          <el-input v-model="form.customer_name" />
        </el-form-item>
        
        <el-form-item label="Số điện thoại" prop="customer_phone">
          <el-input v-model="form.customer_phone" />
        </el-form-item>
        
        <el-form-item label="Email" prop="customer_email">
          <el-input v-model="form.customer_email" type="email" />
        </el-form-item>
        
        <el-form-item label="Tiền cọc" prop="deposit_amount">
          <el-input-number v-model="form.deposit_amount" :min="0" :step="100000" style="width: 100%;" />
        </el-form-item>
        
        <el-form-item label="Hết hạn" prop="expired_at">
          <el-date-picker
            v-model="form.expired_at"
            type="date"
            format="DD/MM/YYYY"
            value-format="YYYY-MM-DD"
            :disabled-date="disabledDate"
            style="width: 100%;"
          />
        </el-form-item>
        
        <el-form-item label="Ghi chú" prop="notes">
          <el-input v-model="form.notes" type="textarea" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="dialogVisible = false" class="btn-cancel">Hủy</el-button>
        <el-button type="primary" @click="submitForm" class="btn-confirm">Lưu</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import api from '../axios'
import { ElMessage } from 'element-plus'
import { Plus, Wallet, CreditCard, WalletFilled, ArrowLeft, ArrowRight, CircleCheck, Timer, Warning } from '@element-plus/icons-vue'

// Mock Data
const mockReservations = [
  { id: 921, room_number: 'L81-2204', building_name: 'Landmark 81', customer_name: 'Nguyễn Văn An', customer_phone: '0901 234 567', expired_at: '2023-11-15', check_in_date: '2023-11-20', deposit_amount: 10000000, payment_method: 'Chuyển khoản', status: 'confirmed' },
  { id: 922, room_number: 'SC-0512', building_name: 'Sunrise City', customer_name: 'Trần Thị Bé', customer_phone: '0988 777 666', expired_at: '2023-11-16', check_in_date: '2023-11-22', deposit_amount: 5000000, payment_method: 'Tiền mặt', status: 'pending' },
  { id: 925, room_number: 'L81-1210', building_name: 'Landmark 81', customer_name: 'Phạm Minh Tuấn', customer_phone: '0933 111 222', expired_at: '2023-11-10', check_in_date: '2023-11-15', deposit_amount: 15000000, payment_method: 'Chuyển khoản', status: 'cancelled' },
  { id: 930, room_number: 'LM-0801', building_name: 'Landmark 81', customer_name: 'Lê Hoàng Long', customer_phone: '0912 345 678', expired_at: '2023-11-18', check_in_date: '2023-11-20', deposit_amount: 8000000, payment_method: 'Chuyển khoản', status: 'confirmed' },
  { id: 931, room_number: 'SC-1004', building_name: 'Sunrise City', customer_name: 'Vũ Thị Hoa', customer_phone: '0987 654 321', expired_at: '2023-11-20', check_in_date: '2023-11-25', deposit_amount: 6000000, payment_method: 'Tiền mặt', status: 'pending' },
  { id: 935, room_number: 'L81-1502', building_name: 'Landmark 81', customer_name: 'Đặng Thái Sơn', customer_phone: '0909 000 111', expired_at: '2023-11-12', check_in_date: '2023-11-16', deposit_amount: 12000000, payment_method: 'Chuyển khoản', status: 'expired' }
]

const reservations = ref(mockReservations)
const buildings = ref([{ id: 1, name: 'Landmark 81' }, { id: 2, name: 'Sunrise City' }])
const emptyRooms = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const formRef = ref(null)
const currentPage = ref(1)
const pageSize = ref(10)

const filters = reactive({ building: null, expected_checkin: null, status: null })
const form = reactive({ room_id: null, customer_name: '', customer_phone: '', customer_email: '', deposit_amount: 0, expired_at: '', notes: '' })

const rules = {
  room_id: [{ required: true, message: 'Vui lòng chọn phòng', trigger: 'change' }],
  customer_name: [{ required: true, message: 'Vui lòng nhập tên', trigger: 'blur' }],
  customer_phone: [{ required: true, message: 'Vui lòng nhập số điện thoại', trigger: 'blur' }],
  deposit_amount: [{ required: true, message: 'Vui lòng nhập tiền cọc', trigger: 'blur' }],
  expired_at: [{ required: true, message: 'Vui lòng chọn ngày hết hạn', trigger: 'change' }],
}

const stats = computed(() => ({
  confirmed: reservations.value.filter(r => r.status === 'confirmed').length,
  pending: reservations.value.filter(r => r.status === 'pending').length,
  cancelled: reservations.value.filter(r => r.status === 'cancelled').length,
  expired: reservations.value.filter(r => r.status === 'expired').length,
}))

const totalDeposit = computed(() => reservations.value.filter(r => ['confirmed', 'pending'].includes(r.status)).reduce((s, r) => s + (r.deposit_amount || 0), 0))

const filteredReservations = computed(() => {
  let result = reservations.value
  if (filters.building) result = result.filter(r => r.building_id === filters.building || r.building_name?.includes(buildings.value.find(b => b.id === filters.building)?.name))
  return result
})

const totalPages = computed(() => Math.ceil(filteredReservations.value.length / pageSize.value) || 1)
const paginatedReservations = computed(() => filteredReservations.value.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value))
const visiblePages = computed(() => {
  const pages = []
  for (let i = 1; i <= Math.min(totalPages.value, 5); i++) pages.push(i)
  return pages
})

const formatPriceWithoutCurrency = (p) => new Intl.NumberFormat('vi-VN').format(p || 0)
const formatPrice = (p) => formatPriceWithoutCurrency(p) + 'đ'
const formatDateStr = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '---'
const formatPhone = (phone) => phone ? phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3') : ''
const disabledDate = (time) => time.getTime() < Date.now() - 86400000
const getStatusLabel = (s) => ({ pending: 'CHỜ DUYỆT', confirmed: 'ĐÃ CỌC', cancelled: 'ĐÃ HỦY', expired: 'QUÁ HẠN' }[s] || s.toUpperCase())

const getStatusStyle = (s) => {
  const styles = {
    confirmed: 'color: #10B981; background-color: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2);',
    pending: 'color: #F59E0B; background-color: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.2);',
    cancelled: 'color: #EF4444; background-color: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2);',
    expired: 'color: #EF4444; background-color: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2);',
  }
  return styles[s] || 'color: #9CA3AF; background-color: rgba(156, 163, 175, 0.1);'
}

const fetchData = async () => {
  loading.value = true
  try {
    const params = { page: currentPage.value, per_page: pageSize.value }
    const response = await api.get('/reservations', { params })
    const data = response.data?.data || response.data || response
    if (data && Array.isArray(data) && data.length > 0) reservations.value = data
  } catch (error) { console.error('API Error:', error) }
  finally { loading.value = false }
}

const fetchEmptyRooms = async () => {
  try {
    const response = await api.get('/rooms', { params: { status: 'empty', per_page: 100 } })
    const data = response.data?.data || response.data || response
    emptyRooms.value = Array.isArray(data) ? data : []
  } catch (error) { console.error('Failed to load rooms') }
}

const showCreateDialog = () => { dialogVisible.value = true }
const submitForm = async () => { 
  const valid = await formRef.value.validate().catch(() => false)
  if (valid) { ElMessage.success('Thành công'); dialogVisible.value = false } 
}

onMounted(() => { fetchData(); fetchEmptyRooms() })
</script>

<style>
/* Global Theme Variables */
:root {
  --bg-page: #f8fafc;
  --bg-card: #ffffff;
  --bg-table-head: #f8fafc;
  --bg-table-body: #ffffff;
  --text-main: #1e293b;
  --text-dim: #64748b;
  --text-muted: #94a3b8;
  --border-main: #e2e8f0;
  --border-row: #f1f5f9;
  --stat-primary-bg: rgba(59, 130, 246, 0.1);
  --stat-success-bg: rgba(16, 185, 129, 0.1);
  --stat-warning-bg: rgba(245, 158, 11, 0.1);
  --stat-error-bg: rgba(239, 68, 68, 0.1);
  --action-btn-bg: #f1f5f9;
  --text-id: #3B82F6;
  --card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

html.dark {
  --bg-page: #111827;
  --bg-card: #1f2937;
  --bg-table-head: #1f2937;
  --bg-table-body: #111827;
  --text-main: #ffffff;
  --text-dim: #9ca3af;
  --text-muted: #6b7280;
  --border-main: #374151;
  --border-row: #374151;
  --stat-primary-bg: rgba(59, 130, 246, 0.15);
  --stat-success-bg: rgba(16, 185, 129, 0.15);
  --stat-warning-bg: rgba(245, 158, 11, 0.15);
  --stat-error-bg: rgba(239, 68, 68, 0.15);
  --action-btn-bg: #374151;
  --text-id: #6b7280;
  --card-shadow: none;
}
</style>

<style scoped>
.reservation-page {
  background-color: var(--bg-page) !important;
  color: var(--text-main);
  transition: all 0.3s ease;
}

.text-main { color: var(--text-main); }
.text-dim { color: var(--text-dim); }
.text-muted { color: var(--text-muted); }
.text-id { color: var(--text-id); }
.border-main { border-color: var(--border-main); }
.border-row { border-color: var(--border-row); }

.card-item {
  background-color: var(--bg-card);
  border-color: var(--border-main);
  box-shadow: var(--card-shadow);
}

.table-container {
  background-color: var(--bg-page);
  border-color: var(--border-main);
}

.table-head {
  background-color: var(--bg-table-head);
}

.table-body {
  background-color: var(--bg-table-body);
}

.table-row:hover {
  background-color: var(--bg-card);
}

.pagination-bar {
  background-color: var(--bg-table-head);
}

/* Custom Elements Styling */
:deep(.reservation-select .el-input__wrapper),
:deep(.reservation-datepicker .el-input__wrapper) {
  background-color: var(--bg-card) !important;
  border: 1px solid var(--border-main) !important;
  box-shadow: none !important;
  border-radius: 10px;
  height: 40px;
}

:deep(.reservation-select .el-input__inner),
:deep(.reservation-datepicker .el-input__inner) {
  color: var(--text-main) !important;
  font-weight: 500;
}

/* Dialog Styles */
:deep(.reservation-dialog .el-dialog) {
  background-color: var(--bg-card) !important;
  border-radius: 20px;
  border: 1px solid var(--border-main);
}

:deep(.reservation-dialog .el-dialog__title) {
  color: var(--text-main) !important;
  font-weight: 800;
}

:deep(.reservation-dialog .el-form-item__label) {
  color: var(--text-dim) !important;
  font-weight: 600;
}

:deep(.reservation-dialog .el-input__wrapper) {
  background-color: var(--bg-page) !important;
  border: 1px solid var(--border-main) !important;
  box-shadow: none !important;
}

:deep(.reservation-dialog .el-input__inner) {
  color: var(--text-main) !important;
}

.btn-cancel {
  background-color: var(--action-btn-bg) !important;
  border: none !important;
  color: var(--text-main) !important;
  border-radius: 10px !important;
}

.btn-confirm {
  background-color: #3b82f6 !important;
  border: none !important;
  color: #fff !important;
  border-radius: 10px !important;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
.animate-pulse {
  animation: pulse 1.5s ease-in-out infinite;
}

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background: var(--border-main);
  border-radius: 10px;
}
</style>

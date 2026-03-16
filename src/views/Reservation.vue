<template>
  <div class="reservation-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>Quản lý đặt cọc giữ phòng</span>
          <div class="header-actions">
            <el-button type="warning" @click="showExpired">
              Cọc quá hạn
            </el-button>
            <el-button type="primary" @click="showCreateDialog">
              Thêm đặt cọc
            </el-button>
          </div>
        </div>
      </template>
      
      <div class="filters">
        <el-select v-model="filters.status" placeholder="Trạng thái" clearable style="width: 150px; margin-right: 10px;">
          <el-option label="Chờ xác nhận" value="pending" />
          <el-option label="Đã xác nhận" value="confirmed" />
          <el-option label="Đã hủy" value="cancelled" />
        </el-select>
        
        <el-button type="primary" @click="fetchData">Lọc</el-button>
      </div>
      
      <el-table :data="reservations" v-loading="loading">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column label="Phòng" width="100">
          <template #default="{ row }">
            {{ row.room?.room_number }}
          </template>
        </el-table-column>
        <el-table-column prop="customer_name" label="Khách hàng" />
        <el-table-column prop="customer_phone" label="Số điện thoại" width="130" />
        <el-table-column label="Tiền cọc" width="130">
          <template #default="{ row }">
            {{ formatPrice(row.deposit_amount) }}
          </template>
        </el-table-column>
        <el-table-column label="Hết hạn" width="120">
          <template #default="{ row }">
            <span :class="{ 'text-danger': isExpired(row) }">
              {{ formatDate(row.expired_at) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="Trạng thái" width="130">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status, row)">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Thao tác" width="180" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="row.status === 'pending'"
              type="success"
              size="small"
              @click="confirmReservation(row)"
            >
              Xác nhận
            </el-button>
            <el-button
              v-if="row.status === 'pending'"
              type="danger"
              size="small"
              @click="cancelReservation(row)"
            >
              Hủy
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.perPage"
          :total="pagination.total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next"
          @size-change="fetchData"
          @current-change="fetchData"
        />
      </div>
    </el-card>
    
    <el-dialog v-model="dialogVisible" title="Thêm đặt cọc" width="500px">
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
        <el-button @click="dialogVisible = false">Hủy</el-button>
        <el-button type="primary" @click="submitForm">Lưu</el-button>
      </template>
    </el-dialog>
    
    <el-dialog v-model="expiredDialogVisible" title="Danh sách cọc quá hạn" width="700px">
      <el-table :data="expiredReservations" v-loading="expiredLoading">
        <el-table-column prop="customer_name" label="Khách hàng" />
        <el-table-column prop="customer_phone" label="Số điện thoại" />
        <el-table-column label="Phòng">
          <template #default="{ row }">
            {{ row.room?.room_number }}
          </template>
        </el-table-column>
        <el-table-column label="Tiền cọc">
          <template #default="{ row }">
            {{ formatPrice(row.deposit_amount) }}
          </template>
        </el-table-column>
        <el-table-column label="Hết hạn">
          <template #default="{ row }">
            {{ formatDate(row.expired_at) }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '../axios'
import { ElMessage, ElMessageBox } from 'element-plus'

const reservations = ref([])
const emptyRooms = ref([])
const expiredReservations = ref([])
const loading = ref(false)
const expiredLoading = ref(false)
const dialogVisible = ref(false)
const expiredDialogVisible = ref(false)
const formRef = ref(null)

const filters = reactive({
  status: null,
})

const pagination = reactive({
  page: 1,
  perPage: 20,
  total: 0,
})

const form = reactive({
  room_id: null,
  customer_name: '',
  customer_phone: '',
  customer_email: '',
  deposit_amount: 0,
  expired_at: '',
  notes: '',
})

const rules = {
  room_id: [{ required: true, message: 'Vui lòng chọn phòng', trigger: 'change' }],
  customer_name: [{ required: true, message: 'Vui lòng nhập tên', trigger: 'blur' }],
  customer_phone: [{ required: true, message: 'Vui lòng nhập số điện thoại', trigger: 'blur' }],
  deposit_amount: [{ required: true, message: 'Vui lòng nhập tiền cọc', trigger: 'blur' }],
  expired_at: [{ required: true, message: 'Vui lòng chọn ngày hết hạn', trigger: 'change' }],
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN')
}

const disabledDate = (time) => {
  return time.getTime() < Date.now() - 86400000
}

const isExpired = (reservation) => {
  return new Date(reservation.expired_at) < new Date() && reservation.status === 'pending'
}

const getStatusType = (status, reservation) => {
  if (isExpired(reservation)) return 'danger'
  const types = { pending: 'warning', confirmed: 'success', cancelled: 'info', expired: 'danger' }
  return types[status] || 'info'
}

const getStatusLabel = (status) => {
  const labels = { pending: 'Chờ xác nhận', confirmed: 'Đã xác nhận', cancelled: 'Đã hủy', expired: 'Quá hạn' }
  return labels[status] || status
}

const fetchData = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      per_page: pagination.perPage,
      ...(filters.status && { status: filters.status }),
    }
    const response = await api.get('/reservations', { params })
    reservations.value = response.data.data.data
    pagination.total = response.data.data.total
  } catch (error) {
    ElMessage.error('Failed to load reservations')
  } finally {
    loading.value = false
  }
}

const fetchEmptyRooms = async () => {
  try {
    const response = await api.get('/rooms', { params: { status: 'empty', per_page: 100 } })
    emptyRooms.value = response.data.data.data
  } catch (error) {
    console.error('Failed to load rooms')
  }
}

const showExpired = async () => {
  expiredDialogVisible.value = true
  expiredLoading.value = true
  try {
    const response = await api.get('/reservations/expired')
    expiredReservations.value = response.data.data
  } catch (error) {
    ElMessage.error('Failed to load expired reservations')
  } finally {
    expiredLoading.value = false
  }
}

const showCreateDialog = () => {
  Object.assign(form, {
    room_id: null,
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    deposit_amount: 0,
    expired_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: '',
  })
  dialogVisible.value = true
}

const submitForm = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  
  try {
    await api.post('/reservations', form)
    ElMessage.success('Thêm đặt cọc thành công')
    dialogVisible.value = false
    fetchData()
  } catch (error) {
    ElMessage.error('Failed to save')
  }
}

const confirmReservation = async (reservation) => {
  try {
    await ElMessageBox.confirm('Xác nhận đặt cọc này?', 'Xác nhận', { type: 'info' })
    await api.put(`/reservations/${reservation.id}/confirm`)
    ElMessage.success('Xác nhận thành công')
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Failed to confirm')
    }
  }
}

const cancelReservation = async (reservation) => {
  try {
    await ElMessageBox.confirm('Hủy đặt cọc này?', 'Xác nhận', { type: 'warning' })
    await api.put(`/reservations/${reservation.id}/cancel`)
    ElMessage.success('Hủy thành công')
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Failed to cancel')
    }
  }
}

onMounted(() => {
  fetchData()
  fetchEmptyRooms()
})
</script>

<style scoped>
.reservation-page {
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.filters {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.text-danger {
  color: #f56c6c;
  font-weight: bold;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>

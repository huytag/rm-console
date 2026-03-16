<template>
  <div class="invoices-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>Danh Sách Hóa Đơn</span>
          <div class="header-actions">
            <el-select
              v-model="filters.status"
              placeholder="Trạng thái"
              clearable
              style="width: 150px; margin-right: 10px;"
            >
              <el-option label="Chưa thanh toán" value="unpaid" />
              <el-option label="Đã thanh toán" value="paid" />
              <el-option label="Thanh toán một phần" value="partial" />
            </el-select>
            <el-button type="primary" @click="generateInvoices">
              Tạo hóa đơn tháng
            </el-button>
          </div>
        </div>
      </template>
      
      <el-table :data="filteredInvoices" v-loading="loading">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column label="Phòng" width="120">
          <template #default="{ row }">
            {{ row.contract?.room?.room_number }}
          </template>
        </el-table-column>
        <el-table-column label="Tháng/Năm" width="120">
          <template #default="{ row }">
            {{ row.month }}/{{ row.year }}
          </template>
        </el-table-column>
        <el-table-column label="Tiền phòng" width="130">
          <template #default="{ row }">
            {{ formatPrice(row.room_price) }}
          </template>
        </el-table-column>
        <el-table-column label="Tổng tiền" width="130">
          <template #default="{ row }">
            {{ formatPrice(row.total_amount) }}
          </template>
        </el-table-column>
        <el-table-column label="Đã trả" width="130">
          <template #default="{ row }">
            {{ formatPrice(row.paid_amount) }}
          </template>
        </el-table-column>
        <el-table-column label="Trạng thái" width="140">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Hạn thanh toán" width="120">
          <template #default="{ row }">
            {{ row.due_date }}
          </template>
        </el-table-column>
        <el-table-column label="Thao tác" fixed="right" width="250">
          <template #default="{ row }">
            <el-button
              v-if="row.status !== 'paid'"
              type="primary"
              size="small"
              @click="showPaymentQR(row)"
            >
              Thanh toán QR
            </el-button>
            <el-button
              v-if="row.status !== 'paid'"
              type="success"
              size="small"
              @click="approvePayment(row)"
            >
              Duyệt
            </el-button>
            <el-button
              type="info"
              size="small"
              @click="exportPdf(row)"
            >
              PDF
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- QR Payment Dialog -->
      <el-dialog v-model="qrVisible" title="Thanh toán qua VietQR" width="400px" center>
        <div class="qr-payment-container" v-loading="qrLoading">
          <div v-if="currentInvoice?.payment_qr" class="qr-content">
            <p class="payment-info">Số tiền: {{ formatPrice(currentInvoice.total_amount) }}</p>
            <el-image :src="currentInvoice.payment_qr" class="qr-image" />
            <p class="qr-instruction">Dùng ứng dụng ngân hàng để quét mã QR</p>
          </div>
          <div v-else class="qr-empty">
            <el-button type="primary" @click="generateQR">Tạo mã QR thanh toán</el-button>
          </div>
        </div>
      </el-dialog>
      
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.perPage"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next"
          @size-change="fetchInvoices"
          @current-change="fetchInvoices"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../axios'
import { ElMessage, ElMessageBox } from 'element-plus'

const invoices = ref([])
const loading = ref(false)
const filters = ref({
  status: null,
})

const pagination = ref({
  page: 1,
  perPage: 10,
  total: 0,
})

const filteredInvoices = computed(() => {
  let result = invoices.value
  if (filters.value.status) {
    result = result.filter(i => i.status === filters.value.status)
  }
  return result
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

const getStatusType = (status) => {
  const types = {
    unpaid: 'danger',
    paid: 'success',
    partial: 'warning',
  }
  return types[status] || 'info'
}

const getStatusLabel = (status) => {
  const labels = {
    unpaid: 'Chưa thanh toán',
    paid: 'Đã thanh toán',
    partial: 'Thanh toán một phần',
  }
  return labels[status] || status
}

const fetchInvoices = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.value.page,
      per_page: pagination.value.perPage,
      ...(filters.value.status && { status: filters.value.status }),
    }
    const response = await api.get('/invoices', { params })
    invoices.value = response.data.data
    pagination.value.total = response.data.total
  } catch (error) {
    ElMessage.error('Failed to load invoices')
  } finally {
    loading.value = false
  }
}

const approvePayment = async (invoice) => {
  try {
    await ElMessageBox.confirm(
      'Xác nhận duyệt thanh toán cho hóa đơn này?',
      'Xác nhận',
      { type: 'success' }
    )
    
    await api.put(`/invoices/${invoice.id}/approve`)
    ElMessage.success('Duyệt thanh toán thành công')
    fetchInvoices()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Failed to approve payment')
    }
  }
}

const exportPdf = (invoice) => {
  window.open(`/api/invoices/${invoice.id}/pdf`, '_blank')
}

const generateInvoices = async () => {
  try {
    const now = new Date()
    await api.post('/invoices/generate', {
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    })
    ElMessage.success('Đã tạo hóa đơn tháng')
    fetchInvoices()
  } catch (error) {
    ElMessage.error('Failed to generate invoices')
  }
}

const qrVisible = ref(false)
const qrLoading = ref(false)
const currentInvoice = ref(null)

const showPaymentQR = (invoice) => {
  currentInvoice.value = invoice
  qrVisible.value = true
}

const generateQR = async () => {
  if (!currentInvoice.value) return
  qrLoading.value = true
  try {
    const response = await api.post(`/invoices/${currentInvoice.value.id}/generate-qr`)
    currentInvoice.value.payment_qr = response.data.data.qr_url
    ElMessage.success('Đã tạo mã QR')
  } catch (error) {
    ElMessage.error('Không thể tạo mã QR')
  } finally {
    qrLoading.value = false
  }
}

onMounted(() => {
  fetchInvoices()
})
</script>

<style scoped>
.invoices-page {
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  align-items: center;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.qr-payment-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  min-height: 200px;
  justify-content: center;
}

.qr-content {
  text-align: center;
}

.payment-info {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 15px;
  color: #3b82f6;
}

.qr-image {
  width: 250px;
  height: 250px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 15px;
}

.qr-instruction {
  color: #64748b;
  font-size: 13px;
}
</style>

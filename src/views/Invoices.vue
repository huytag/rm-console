<template>
  <div class="invoices-page min-h-full p-6 font-inter">
    <!-- Top Bar -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-black text-main">Danh Sách Hóa Đơn</h1>
      <div class="flex items-center gap-4">
        <el-select
          v-model="filters.status"
          placeholder="Tất cả trạng thái"
          clearable
          class="theme-select"
          style="width: 180px;"
          @change="fetchInvoices"
        >
          <el-option label="Chờ thanh toán" value="unpaid" />
          <el-option label="Đã thanh toán" value="paid" />
          <el-option label="Quá hạn" value="overdue" />
          <el-option label="Thanh toán 1 phần" value="partial" />
        </el-select>

        <el-date-picker
          v-model="filterDate"
          type="month"
          placeholder="Chọn tháng/năm"
          format="MM/YYYY"
          value-format="YYYY-MM"
          class="theme-date-picker"
          style="width: 180px;"
          @change="handleDateChange"
        />
        
        <button
          class="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-105"
          style="background-color: #3B82F6;"
          @click="generateMonthlyInvoices"
        >
          <el-icon><Refresh /></el-icon>
          Tạo hóa đơn tháng
        </button>
      </div>
    </div>

    <!-- Table Section -->
    <div class="rounded-2xl border border-main overflow-hidden shadow-2xl bg-table" v-loading="loading">
      <div class="overflow-x-auto">
        <table class="w-full text-sm border-collapse">
          <thead class="bg-header">
            <tr class="border-b border-main">
              <th class="px-5 py-4 text-left text-[11px] font-black uppercase tracking-widest text-dim">ID</th>
              <th class="px-5 py-4 text-left text-[11px] font-black uppercase tracking-widest text-dim">Phòng / Tòa nhà</th>
              <th class="px-5 py-4 text-center text-[11px] font-black uppercase tracking-widest text-dim">Tháng / Năm</th>
              <th class="px-5 py-4 text-right text-[11px] font-black uppercase tracking-widest text-dim">Tiền phòng</th>
              <th class="px-5 py-4 text-right text-[11px] font-black uppercase tracking-widest text-dim">Tổng tiền</th>
              <th class="px-5 py-4 text-right text-[11px] font-black uppercase tracking-widest text-dim">Đã trả</th>
              <th class="px-5 py-4 text-center text-[11px] font-black uppercase tracking-widest text-dim">Trạng thái</th>
              <th class="px-5 py-4 text-left text-[11px] font-black uppercase tracking-widest text-dim">Hạn trả</th>
              <th class="px-5 py-4 text-center text-[11px] font-black uppercase tracking-widest text-dim">Thao tác</th>
            </tr>
          </thead>
          <tbody class="bg-table">
            <tr
              v-for="row in invoices"
              :key="row.id"
              class="table-row-hover transition-colors border-b last:border-0 border-main"
            >
              <!-- ID -->
              <td class="px-5 py-4">
                <span class="font-bold text-xs text-id">{{ row.invoice_code || `#HD-${String(row.id).padStart(4, '0')}` }}</span>
              </td>

              <!-- Phòng -->
              <td class="px-5 py-4">
                <p class="font-bold text-main text-sm mb-0.5">{{ row.contract?.room?.room_number || row.room_number || '---' }}</p>
                <p class="text-[11px] text-dim font-medium">{{ row.contract?.room?.building?.name || row.building_name || 'N/A' }}</p>
              </td>

              <!-- Tháng/Năm -->
              <td class="px-5 py-4 text-center text-main font-bold">{{ row.month }}/{{ row.year }}</td>

              <!-- Tiền phòng -->
              <td class="px-5 py-4 text-right text-dim font-medium">{{ formatPrice(row.room_price) }}</td>

              <!-- Tổng tiền -->
              <td class="px-5 py-4 text-right">
                <span class="text-main font-black text-sm">{{ formatPrice(row.total_amount) }}</span>
              </td>

              <!-- Đã trả -->
              <td class="px-5 py-4 text-right">
                <span class="text-main font-black text-sm">{{ formatPrice(row.paid_amount) }}</span>
              </td>

              <!-- Trạng thái -->
              <td class="px-5 py-4 text-center">
                <span
                  class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                  :style="getStatusStyle(row.status)"
                >
                  {{ getStatusLabel(row.status) }}
                </span>
              </td>

              <!-- Hạn thanh toán -->
              <td class="px-5 py-4">
                <span class="text-xs font-bold text-dim">{{ row.due_date }}</span>
              </td>

              <!-- Thao tác -->
              <td class="px-5 py-4 text-center">
                <div class="flex items-center justify-center gap-3">
                  <button class="action-btn btn-view" title="Xem chi tiết" @click="openInvoiceDetails(row)">
                    <el-icon size="16"><View /></el-icon>
                  </button>
                  <button class="action-btn btn-print" title="Xác nhận thanh toán" @click="showPaymentQR(row)" v-if="row.status !== 'paid'">
                    <el-icon size="16"><Money /></el-icon>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between px-6 py-4 bg-header border-t border-main">
        <p class="text-xs font-bold text-dim uppercase tracking-widest">
          Tổng cộng <span class="text-main">{{ pagination.total }}</span> hóa đơn
        </p>

        <div class="flex items-center gap-4">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :total="pagination.total"
            layout="prev, pager, next"
            @current-change="fetchInvoices"
            class="custom-pagination"
          />
        </div>
      </div>
    </div>

    <!-- QR Payment Dialog -->
    <el-dialog v-model="qrVisible" title="Xác nhận thanh toán" width="450px" center class="theme-dialog">
      <div class="flex flex-col items-center justify-center p-2" v-loading="qrLoading">
        <div v-if="qrData" class="text-center w-full">
          <p class="font-bold text-lg mb-2 text-blue-500">Số tiền: {{ formatPrice(qrData.amount) }}</p>
          <img :src="qrData.qr_url" class="w-[250px] h-[250px] rounded-xl mb-4 mx-auto object-contain border-main border-2" />
          <div class="bg-section p-4 rounded-xl mb-6 text-left border border-main">
            <p class="text-xs text-dim mb-1 font-bold uppercase">Nội dung chuyển khoản</p>
            <p class="text-sm font-black text-main">{{ qrData.content }}</p>
          </div>
          <el-button type="primary" class="!w-full !rounded-xl !h-12 font-bold" @click="confirmPayment">
            Đã chuyển khoản thành công
          </el-button>
        </div>
      </div>
    </el-dialog>

    <!-- Invoice Details Dialog -->
    <el-dialog
      v-model="invoiceDetailsVisible"
      title="Chi tiết Hóa đơn"
      width="750px"
      class="invoice-details-dialog theme-dialog"
      :align-center="true"
    >
      <div v-if="selectedInvoice" class="p-4 overflow-y-auto max-h-[75vh]" v-loading="detailsLoading">
        <div class="grid grid-cols-2 gap-8">
          <!-- Left Column -->
          <div class="flex flex-col gap-6">
            <div class="detail-item">
              <label class="text-[10px] font-black uppercase tracking-widest text-dim">Mã Hóa đơn</label>
              <p class="font-black text-blue-500 text-lg">{{ selectedInvoice.invoice_code || `#HD-${String(selectedInvoice.id).padStart(4, '0')}` }}</p>
            </div>
            <div class="detail-item">
              <label class="text-[10px] font-black uppercase tracking-widest text-dim">Khách thuê</label>
              <p class="text-main font-bold">{{ selectedInvoice.contract?.tenant?.name || 'N/A' }}</p>
              <p class="text-xs text-dim">{{ selectedInvoice.contract?.tenant?.phone || '' }}</p>
            </div>
            <div class="detail-item">
              <label class="text-[10px] font-black uppercase tracking-widest text-dim">Thời gian</label>
              <p class="text-main font-bold">Tháng {{ selectedInvoice.month }} / {{ selectedInvoice.year }}</p>
            </div>
            <div class="detail-item">
              <label class="text-[10px] font-black uppercase tracking-widest text-dim">Giá phòng</label>
              <p class="text-main font-black">{{ formatPrice(selectedInvoice.room_price) }}</p>
            </div>
          </div>

          <!-- Right Column -->
          <div class="flex flex-col gap-6">
            <div class="detail-item">
              <label class="text-[10px] font-black uppercase tracking-widest text-dim">Trạng thái</label>
              <div class="mt-1">
                <span
                  class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                  :style="getStatusStyle(selectedInvoice.status)"
                >
                  {{ getStatusLabel(selectedInvoice.status) }}
                </span>
              </div>
            </div>
            <div class="detail-item">
              <label class="text-[10px] font-black uppercase tracking-widest text-dim">Hạn thanh toán</label>
              <p class="text-rose-500 font-bold">{{ selectedInvoice.due_date }}</p>
            </div>
            <div class="detail-item">
              <label class="text-[10px] font-black uppercase tracking-widest text-dim">Tổng tiền thanh toán</label>
              <p class="text-emerald-500 font-black text-xl">{{ formatPrice(selectedInvoice.total_amount) }}</p>
            </div>
            <div class="detail-item">
              <label class="text-[10px] font-black uppercase tracking-widest text-dim">Đã thanh toán</label>
              <p class="text-main font-black">{{ formatPrice(selectedInvoice.paid_amount) }}</p>
            </div>
          </div>
        </div>

        <!-- Utilities Section -->
        <div class="mt-8 pt-6 border-t border-main" v-if="selectedInvoice.utilities?.length">
          <label class="text-[10px] font-black uppercase tracking-widest text-dim block mb-4">Chi tiết Dịch vụ & Tiện ích</label>
          <div class="space-y-3">
            <div v-for="u in selectedInvoice.utilities" :key="u.service.name" class="bg-section border border-main rounded-xl p-4 flex justify-between items-center">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <el-icon><Lightning v-if="u.service.name.includes('điện')" /><Odometer v-else /></el-icon>
                </div>
                <div>
                  <p class="text-sm font-black text-main uppercase">{{ u.service.name }}</p>
                  <p class="text-[10px] text-dim font-bold">Chỉ số: {{ u.old_index }} → {{ u.new_index }} ({{ u.new_index - u.old_index }} {{ u.service.unit }})</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-black text-main">{{ formatPrice(u.total_amount) }}</p>
                <p class="text-[10px] text-dim font-medium">{{ formatPrice(u.unit_price) }} / {{ u.service.unit }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Payments Section -->
        <div class="mt-8 pt-6 border-t border-main" v-if="selectedInvoice.payments?.length">
          <label class="text-[10px] font-black uppercase tracking-widest text-dim block mb-4">Lịch sử thanh toán</label>
          <div class="space-y-2">
            <div v-for="p in selectedInvoice.payments" :key="p.id" class="flex justify-between items-center text-xs p-2 rounded-lg bg-header border border-main">
              <span class="text-dim font-bold">{{ formatDate(p.paid_at) }}</span>
              <span class="text-main font-black">{{ formatPrice(p.amount) }}</span>
              <span class="text-[10px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">{{ p.method }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Refresh, View, Printer, Lightning, Odometer, Money, ArrowRight } from '@element-plus/icons-vue'

// ========== STATE ==========
const invoices = ref([])
const loading = ref(false)
const detailsLoading = ref(false)
const filters = ref({ status: null, month: null, year: null })
const filterDate = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const pagination = ref({ total: 0 })

const invoiceDetailsVisible = ref(false)
const selectedInvoice = ref(null)

const qrVisible = ref(false)
const qrLoading = ref(false)
const qrData = ref(null)

// ========== METHODS ==========
const formatPrice = (price) => {
  if (price === null || price === undefined) return '0đ'
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ'
}

const formatDate = (dateStr) => {
  if (!dateStr) return '---'
  return new Date(dateStr).toLocaleDateString('vi-VN')
}

const getStatusLabel = (status) => {
  const labels = {
    unpaid: 'Chờ thanh toán',
    paid: 'Đã thanh toán',
    partial: 'Thanh toán 1 phần',
    overdue: 'Quá hạn'
  }
  return labels[status] || status
}

const getStatusStyle = (status) => {
  const styles = {
    paid: 'color: #10B981; background-color: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2);',
    unpaid: 'color: #F59E0B; background-color: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.2);',
    overdue: 'color: #EF4444; background-color: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2);',
    partial: 'color: #3B82F6; background-color: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2);',
  }
  return styles[status] || 'color: #9CA3AF; background-color: rgba(156, 163, 175, 0.1);'
}

const handleDateChange = (val) => {
  if (val) {
    const [year, month] = val.split('-')
    filters.value.year = parseInt(year)
    filters.value.month = parseInt(month)
  } else {
    filters.value.year = null
    filters.value.month = null
  }
  fetchInvoices()
}

const fetchInvoices = async () => {
  loading.value = true
  try {
    // Lưu ý: api (axios instance) đã được cấu hình interceptor để trả về response.data
    const response = await api.get('/invoices', {
      params: {
        page: currentPage.value,
        per_page: pageSize.value,
        status: filters.value.status,
        month: filters.value.month,
        year: filters.value.year
      }
    })
    
    // response lúc này chính là object { success: true, data: { ... } } hoặc { ... } trực tiếp
    const payload = response.data || response;
    
    // invoices.value phải là mảng nằm trong data.data hoặc chính là payload
    invoices.value = payload.data || (Array.isArray(payload) ? payload : []);
    
    // Cập nhật tổng số bản ghi cho phân trang
    pagination.value.total = payload.total || payload.meta?.total || (Array.isArray(payload) ? payload.length : 0);
    
    if (invoices.value.length === 0) {
      console.warn("API trả về danh sách trống");
    }
  } catch (error) {
    console.error("Fetch invoices error:", error);
    ElMessage.error('Lỗi khi tải danh sách hóa đơn');
  } finally {
    loading.value = false
  }
}

const openInvoiceDetails = async (invoice) => {
  selectedInvoice.value = invoice
  invoiceDetailsVisible.value = true
  detailsLoading.value = true
  try {
    const response = await api.get(`/invoices/${invoice.id}`)
    selectedInvoice.value = response.data || response
  } catch (error) {
    ElMessage.error('Không thể lấy chi tiết hóa đơn')
  } finally {
    detailsLoading.value = false
  }
}

const showPaymentQR = async (invoice) => {
  selectedInvoice.value = invoice
  qrVisible.value = true
  qrLoading.value = true
  try {
    // Cập nhật đúng route và method theo api.php của backend
    const response = await api.post(`/invoices/${invoice.id}/generate-qr`)
    qrData.value = response.data || response
  } catch (error) {
    ElMessage.error('Không thể tạo mã QR thanh toán')
  } finally {
    qrLoading.value = false
  }
}

const confirmPayment = async () => {
  try {
    await ElMessageBox.confirm('Xác nhận bạn đã chuyển khoản thành công?', 'Xác nhận', {
      confirmButtonText: 'Đã chuyển',
      cancelButtonText: 'Kiểm tra lại',
      type: 'success'
    })
    
    // Cập nhật đúng route theo api.php của backend
    const response = await api.post(`/invoices/${selectedInvoice.value.id}/approve`, {
      amount: selectedInvoice.value.total_amount,
      method: 'bank_transfer',
      note: 'Thanh toán qua QR'
    })
    
    const isSuccess = response.success || response.status === 'success';

    if (isSuccess) {
      ElMessage.success('Xác nhận thanh toán thành công!')
      qrVisible.value = false
      fetchInvoices()
    }
  } catch (error) {
    if (error !== 'cancel') ElMessage.error('Lỗi khi xác nhận thanh toán')
  }
}

const generateMonthlyInvoices = async () => {
  try {
    const now = new Date()
    await ElMessageBox.confirm(`Tạo hóa đơn tự động cho Tháng ${now.getMonth() + 1}/${now.getFullYear()}?`, 'Xác nhận', {
      type: 'info'
    })
    
    loading.value = true
    const response = await api.post('/invoices/generate', {
      month: now.getMonth() + 1,
      year: now.getFullYear()
    })
    
    const isSuccess = response.success || response.status === 'success';

    if (isSuccess) {
      const genCount = (response.data?.total_generated) || response.total_generated || 0;
      ElMessage.success(`Đã tạo thành công ${genCount} hóa đơn mới!`)
      fetchInvoices()
    }
  } catch (error) {
    if (error !== 'cancel') ElMessage.error('Lỗi khi tạo hóa đơn tháng')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchInvoices()
})
</script>

<style>
/* Global Theme Variables for this page */
:root {
  --bg-page: #f8fafc;
  --bg-table: #ffffff;
  --bg-header: #f8fafc;
  --bg-section: #f1f5f9;
  --bg-sub-section: #ffffff;
  --text-main: #1e293b;
  --text-dim: #64748b;
  --border-main: #e2e8f0;
  --select-bg: #ffffff;
  --btn-secondary-bg: #f1f5f9;
  --btn-secondary-text: #475569;
  --text-id: #3B82F6;
}

html.dark {
  --bg-page: #111827;
  --bg-table: #111827;
  --bg-header: #1f2937;
  --bg-section: rgba(17, 24, 39, 0.4);
  --bg-sub-section: rgba(31, 41, 55, 0.3);
  --text-main: #ffffff;
  --text-dim: #9ca3af;
  --border-main: #374151;
  --select-bg: #1f2937;
  --btn-secondary-bg: #374151;
  --btn-secondary-text: #d1d5db;
  --text-id: #6b7280;
}
</style>

<style scoped>
.font-inter { font-family: 'Inter', sans-serif; }
.invoices-page { background-color: var(--bg-page); color: var(--text-main); }
.table-row-hover:hover { background-color: var(--bg-header); }
.text-main { color: var(--text-main); }
.text-dim { color: var(--text-dim); }
.bg-table { background-color: var(--bg-table); }
.bg-header { background-color: var(--bg-header); }
.bg-section { background-color: var(--bg-section); }
.text-id { color: var(--text-id); }
.border-main { border-color: var(--border-main); }

.action-btn {
  width: 32px; height: 32px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  background-color: var(--btn-secondary-bg); color: var(--text-dim);
  border: none; cursor: pointer; transition: all 0.2s ease;
}
.btn-view:hover { background-color: rgba(59, 130, 246, 0.15) !important; color: #3b82f6 !important; }
.btn-print:hover { background-color: rgba(16, 185, 129, 0.15) !important; color: #10b981 !important; }

/* Custom Pagination */
:deep(.custom-pagination .el-pager li) { background: transparent; color: var(--text-dim); font-weight: 800; }
:deep(.custom-pagination .el-pager li.is-active) { color: #3b82f6; font-size: 16px; }

/* Dialog Theme */
:deep(.theme-dialog .el-dialog) { background-color: var(--bg-table) !important; border: 1px solid var(--border-main); border-radius: 24px; overflow: hidden; }
:deep(.theme-dialog .el-dialog__header) { padding: 24px 32px; border-bottom: 1px solid var(--border-main); margin: 0; }
:deep(.theme-dialog .el-dialog__title) { color: var(--text-main) !important; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; }

/* Theme Select & Date Picker */
:deep(.theme-select .el-input__wrapper),
:deep(.theme-date-picker .el-input__wrapper) {
  background-color: var(--bg-table) !important;
  box-shadow: 0 0 0 1px var(--border-main) inset !important;
  border-radius: 12px;
  padding: 8px 12px;
}
:deep(.theme-select .el-input__inner),
:deep(.theme-date-picker .el-input__inner) {
  color: var(--text-main) !important;
  font-weight: 600;
}
:deep(.el-picker__popper) {
  background-color: var(--bg-table) !important;
  border: 1px solid var(--border-main) !important;
}
</style>

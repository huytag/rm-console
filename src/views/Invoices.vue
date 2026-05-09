<template>
  <div class="invoices-page min-h-full p-6 font-inter" style="background-color: #111827;">
    <!-- Top Bar -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-black text-white">Danh Sách Hóa Đơn</h1>
      <div class="flex items-center gap-4">
        <el-select
          v-model="filters.status"
          placeholder="Tất cả trạng thái"
          clearable
          class="dark-select"
          style="width: 180px;"
        >
          <el-option label="Chờ thanh toán" value="unpaid" />
          <el-option label="Đã thanh toán" value="paid" />
          <el-option label="Quá hạn" value="overdue" />
          <el-option label="Thanh toán 1 phần" value="partial" />
        </el-select>
        
        <button
          class="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-105"
          style="background-color: #3B82F6;"
          @click="generateInvoices"
        >
          <el-icon><Plus /></el-icon>
          Tạo hóa đơn tháng
        </button>
      </div>
    </div>

    <!-- Table Section -->
    <div class="rounded-2xl border overflow-hidden shadow-2xl" style="background-color: #111827; border-color: #374151;">
      <div class="overflow-x-auto">
        <table class="w-full text-sm border-collapse">
          <thead style="background-color: #1f2937;">
            <tr style="border-bottom: 1px solid #374151;">
              <th class="px-5 py-4 text-left text-[11px] font-black uppercase tracking-widest text-gray-500">ID</th>
              <th class="px-5 py-4 text-left text-[11px] font-black uppercase tracking-widest text-gray-500">Phòng / Tòa nhà</th>
              <th class="px-5 py-4 text-center text-[11px] font-black uppercase tracking-widest text-gray-500">Tháng / Năm</th>
              <th class="px-5 py-4 text-right text-[11px] font-black uppercase tracking-widest text-gray-500">Tiền phòng</th>
              <th class="px-5 py-4 text-right text-[11px] font-black uppercase tracking-widest text-gray-500">Tổng tiền</th>
              <th class="px-5 py-4 text-right text-[11px] font-black uppercase tracking-widest text-gray-500">Đã trả</th>
              <th class="px-5 py-4 text-center text-[11px] font-black uppercase tracking-widest text-gray-500">Trạng thái</th>
              <th class="px-5 py-4 text-left text-[11px] font-black uppercase tracking-widest text-gray-500">Hạn trả</th>
              <th class="px-5 py-4 text-center text-[11px] font-black uppercase tracking-widest text-gray-500">Thao tác</th>
            </tr>
          </thead>
          <tbody v-if="!loading" style="background-color: #111827;">
            <tr
              v-for="(row, index) in paginatedInvoices"
              :key="row.id"
              class="table-row-hover transition-colors"
              :style="index !== paginatedInvoices.length - 1 ? 'border-bottom: 1px solid #374151;' : ''"
            >
              <!-- ID -->
              <td class="px-5 py-4">
                <span class="font-bold text-xs text-gray-400">{{ row.invoice_code || `#HD-${String(row.id).padStart(4, '0')}` }}</span>
              </td>

              <!-- Phòng -->
              <td class="px-5 py-4">
                <p class="font-bold text-white text-sm mb-0.5">{{ row.contract?.room?.room_number || row.room_number }}</p>
                <p class="text-[11px] text-gray-500 font-medium">{{ row.building_name || 'N/A' }}</p>
              </td>

              <!-- Tháng/Năm -->
              <td class="px-5 py-4 text-center text-white font-bold">{{ row.month }}/{{ row.year }}</td>

              <!-- Tiền phòng -->
              <td class="px-5 py-4 text-right text-gray-300 font-medium">{{ formatPrice(row.room_price) }}</td>

              <!-- Tổng tiền -->
              <td class="px-5 py-4 text-right">
                <span class="text-white font-black text-sm">{{ formatPrice(row.total_amount) }}</span>
              </td>

              <!-- Đã trả -->
              <td class="px-5 py-4 text-right">
                <span class="text-white font-black text-sm">{{ formatPrice(row.paid_amount) }}</span>
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
                <span class="text-xs font-bold text-gray-400">{{ row.due_date }}</span>
              </td>

              <!-- Thao tác -->
              <td class="px-5 py-4 text-center">
                <div class="flex items-center justify-center gap-3">
                  <button class="text-gray-500 hover:text-blue-500 transition-colors" title="Xem chi tiết" @click="openInvoiceDetails(row)">
                    <el-icon size="16"><View /></el-icon>
                  </button>
                  <button class="text-gray-500 hover:text-emerald-500 transition-colors" title="In hóa đơn" @click="exportPdf(row)">
                    <el-icon size="16"><Printer /></el-icon>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between px-6 py-4" style="background-color: #1f2937; border-top: 1px solid #374151;">
        <p class="text-xs font-bold text-gray-500 uppercase tracking-widest">
          Tổng cộng <span class="text-white">{{ filteredInvoices.length }}</span> hóa đơn
        </p>

        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <span class="text-[11px] font-bold text-gray-500 uppercase">Hiển thị</span>
            <el-select v-model="pageSize" style="width: 100px;" class="dark-select-mini">
              <el-option label="10/trang" :value="10" />
              <el-option label="20/trang" :value="20" />
            </el-select>
          </div>

          <div class="flex items-center gap-1">
            <button
              class="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30 text-gray-500 hover:text-white"
              :disabled="currentPage === 1"
              @click="currentPage--"
            >
              <el-icon><ArrowLeft /></el-icon>
            </button>

            <button
              v-for="page in visiblePages"
              :key="page"
              class="w-8 h-8 rounded-lg text-xs font-black transition-all"
              :class="page === currentPage ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-white'"
              @click="currentPage = page"
            >
              {{ page }}
            </button>

            <button
              class="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30 text-gray-500 hover:text-white"
              :disabled="currentPage === totalPages"
              @click="currentPage++"
            >
              <el-icon><ArrowRight /></el-icon>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- QR Payment Dialog -->
    <el-dialog v-model="qrVisible" title="Thanh toán qua VietQR" width="400px" center class="dark-dialog">
      <div class="flex flex-col items-center justify-center p-2 min-h-[200px]" v-loading="qrLoading">
        <div v-if="currentInvoice?.payment_qr" class="text-center w-full">
          <p class="font-bold text-lg mb-4 text-blue-500">Số tiền: {{ formatPrice(currentInvoice.total_amount) }}</p>
          <img :src="currentInvoice.payment_qr" class="w-[250px] h-[250px] rounded-xl mb-4 mx-auto object-contain" style="border: 2px solid #374151;" />
          <p class="text-sm" style="color: #9CA3AF;">Dùng ứng dụng ngân hàng để quét mã QR</p>
        </div>
        <div v-else class="flex flex-col items-center justify-center w-full h-full">
          <button class="px-6 py-2.5 rounded-xl font-bold text-white transition-all hover:opacity-90" style="background-color: #3B82F6;" @click="generateQR">
            Tạo mã QR thanh toán
          </button>
        </div>
      </div>
    </el-dialog>

    <!-- Invoice Details Dialog -->
    <el-dialog
      v-model="invoiceDetailsVisible"
      title="Chi tiết Hóa đơn"
      width="700px"
      class="invoice-details-dialog"
      :align-center="true"
    >
      <div v-if="selectedInvoice" class="p-4 overflow-y-auto max-h-[75vh]">
        <div class="grid grid-cols-2 gap-8">
          <!-- Left Column -->
          <div class="flex flex-col gap-6">
            <div class="detail-item">
              <label>Mã Hóa đơn</label>
              <p class="font-black text-blue-500 text-lg">{{ selectedInvoice.invoice_code || `#HD-${String(selectedInvoice.id).padStart(4, '0')}` }}</p>
            </div>
            <div class="detail-item">
              <label>Mã Hợp đồng</label>
              <p class="text-white font-bold">#HĐ-{{ String(selectedInvoice.contract_id || 982).padStart(4, '0') }}</p>
            </div>
            <div class="detail-item">
              <label>Thời gian</label>
              <p class="text-white font-bold">Tháng {{ selectedInvoice.month }} / {{ selectedInvoice.year }}</p>
            </div>
            <div class="detail-item">
              <label>Giá phòng</label>
              <p class="text-white font-black">{{ formatPrice(selectedInvoice.room_price) }}</p>
            </div>
            <div class="detail-item">
              <label>Tổng tiền</label>
              <p class="text-emerald-400 font-black text-xl">{{ formatPrice(selectedInvoice.total_amount) }}</p>
            </div>
          </div>

          <!-- Right Column -->
          <div class="flex flex-col gap-6">
            <div class="detail-item">
              <label>Trạng thái</label>
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
              <label>Hạn chót thanh toán</label>
              <p class="text-rose-500 font-bold">{{ selectedInvoice.due_date }}</p>
            </div>
            <div class="detail-item">
              <label>Số tiền đã trả</label>
              <p class="text-white font-black">{{ formatPrice(selectedInvoice.paid_amount) }}</p>
            </div>
            <div class="detail-item">
              <label>Hình thức thanh toán</label>
              <p class="text-white font-bold">{{ selectedInvoice.payment_method || 'Chuyển khoản ngân hàng' }}</p>
            </div>
            <div class="detail-item">
              <label>Ngày tạo / Cập nhật</label>
              <p class="text-xs text-gray-400 font-medium mt-1">
                Tạo: {{ selectedInvoice.created_at || '01/10/2023' }} <br/>
                Sửa: {{ selectedInvoice.updated_at || '05/10/2023' }}
              </p>
            </div>
          </div>
        </div>

        <div class="mt-8 pt-6 border-t border-gray-800">
          <label class="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-4">Thông tin Điện & Nước</label>
          <div class="grid grid-cols-1 gap-4">
            <!-- Điện Section -->
            <div class="bg-gray-900/40 border border-gray-800 rounded-2xl p-5">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center text-yellow-500 shadow-lg shadow-yellow-500/10">
                    <el-icon size="24"><Lightning /></el-icon>
                  </div>
                  <div>
                    <h4 class="text-white font-black text-base uppercase tracking-wider">Chỉ số Điện</h4>
                    <p class="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-0.5">Tiêu thụ: <span class="text-yellow-500">{{ (selectedInvoice.elec_current || 1250) - (selectedInvoice.elec_previous || 1120) }} kWh</span></p>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-gray-800/30 p-3 rounded-xl border border-gray-700/50">
                  <span class="text-[10px] font-black text-gray-500 uppercase block mb-1">Chỉ số Đầu (Tháng trước)</span>
                  <p class="text-white font-black text-lg">{{ selectedInvoice.elec_previous || 1120 }} <span class="text-xs text-gray-500 font-medium ml-1">kWh</span></p>
                </div>
                <div class="bg-gray-800/30 p-3 rounded-xl border border-gray-700/50">
                  <span class="text-[10px] font-black text-gray-500 uppercase block mb-1">Chỉ số Cuối (Tháng này)</span>
                  <p class="text-yellow-500 font-black text-lg">{{ selectedInvoice.elec_current || 1250 }} <span class="text-xs text-gray-500 font-medium ml-1">kWh</span></p>
                </div>
              </div>
            </div>

            <!-- Nước Section -->
            <div class="bg-gray-900/40 border border-gray-800 rounded-2xl p-5">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 shadow-lg shadow-blue-500/10">
                    <el-icon size="24"><Odometer /></el-icon>
                  </div>
                  <div>
                    <h4 class="text-white font-black text-base uppercase tracking-wider">Chỉ số Nước</h4>
                    <p class="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-0.5">Tiêu thụ: <span class="text-blue-400">{{ (selectedInvoice.water_current || 85) - (selectedInvoice.water_previous || 78) }} m³</span></p>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-gray-800/30 p-3 rounded-xl border border-gray-700/50">
                  <span class="text-[10px] font-black text-gray-500 uppercase block mb-1">Chỉ số Đầu (Tháng trước)</span>
                  <p class="text-white font-black text-lg">{{ selectedInvoice.water_previous || 78 }} <span class="text-xs text-gray-500 font-medium ml-1">m³</span></p>
                </div>
                <div class="bg-gray-800/30 p-3 rounded-xl border border-gray-700/50">
                  <span class="text-[10px] font-black text-gray-500 uppercase block mb-1">Chỉ số Cuối (Tháng này)</span>
                  <p class="text-blue-400 font-black text-lg">{{ selectedInvoice.water_current || 85 }} <span class="text-xs text-gray-500 font-medium ml-1">m³</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8 pt-6 border-t border-gray-800">
          <div class="detail-item">
            <label class="mb-2 block">Ghi chú</label>
            <div class="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
              <p class="text-sm text-gray-300 italic">
                {{ selectedInvoice.notes || "Không có ghi chú nào cho hóa đơn này." }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-3 p-4">
          <el-button @click="invoiceDetailsVisible = false" class="dark-btn-secondary">Đóng</el-button>
          <el-button type="success" @click="showPaymentQR(selectedInvoice)" v-if="selectedInvoice.status !== 'paid'" class="dark-btn-success">
            Thanh toán QR
          </el-button>
          <el-button type="primary" @click="exportPdf(selectedInvoice)" class="dark-btn-primary">
            <el-icon class="mr-2"><Printer /></el-icon> In hóa đơn
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import api from '../axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, ArrowLeft, ArrowRight, View, Printer, Lightning, Odometer } from '@element-plus/icons-vue'

// ========== MOCK DATA ==========
const mockInvoices = [
  { id: 21, invoice_code: 'HD-0021', room_number: 'Phòng 101', building_name: 'Blue Moon', month: 10, year: 2023, room_price: 3500000, total_amount: 4250000, paid_amount: 4250000, status: 'paid', due_date: '05/10/2023' },
  { id: 22, invoice_code: 'HD-0022', room_number: 'Phòng 203', building_name: 'Green House', month: 10, year: 2023, room_price: 2800000, total_amount: 3120000, paid_amount: 0, status: 'unpaid', due_date: '05/10/2023' },
  { id: 23, invoice_code: 'HD-0023', room_number: 'Phòng 302', building_name: 'Sunlight Apartment', month: 9, year: 2023, room_price: 4500000, total_amount: 5400000, paid_amount: 1000000, status: 'overdue', due_date: '05/09/2023' },
  { id: 24, invoice_code: 'HD-0024', room_number: 'Phòng 105', building_name: 'Blue Moon', month: 10, year: 2023, room_price: 3000000, total_amount: 3800000, paid_amount: 3800000, status: 'paid', due_date: '05/10/2023' },
  { id: 25, invoice_code: 'HD-0025', room_number: 'Phòng 404', building_name: 'Green House', month: 10, year: 2023, room_price: 2500000, total_amount: 2950000, paid_amount: 0, status: 'unpaid', due_date: '05/10/2023' },
  { id: 26, invoice_code: 'HD-0026', room_number: 'Phòng 201', building_name: 'Blue Moon', month: 10, year: 2023, room_price: 3200000, total_amount: 3500000, paid_amount: 0, status: 'unpaid', due_date: '05/10/2023' },
  { id: 27, invoice_code: 'HD-0027', room_number: 'Phòng 305', building_name: 'Sunlight Apartment', month: 9, year: 2023, room_price: 4000000, total_amount: 4800000, paid_amount: 2000000, status: 'partial', due_date: '05/09/2023' },
  { id: 28, invoice_code: 'HD-0028', room_number: 'Phòng 202', building_name: 'Green House', month: 10, year: 2023, room_price: 3000000, total_amount: 3300000, paid_amount: 0, status: 'unpaid', due_date: '05/10/2023' },
  { id: 29, invoice_code: 'HD-0029', room_number: 'Phòng 401', building_name: 'Sunlight Apartment', month: 10, year: 2023, room_price: 4200000, total_amount: 4600000, paid_amount: 4600000, status: 'paid', due_date: '05/10/2023' },
  { id: 30, invoice_code: 'HD-0030', room_number: 'Phòng 102', building_name: 'Blue Moon', month: 10, year: 2023, room_price: 3500000, total_amount: 4000000, paid_amount: 0, status: 'unpaid', due_date: '05/10/2023' },
  { id: 31, invoice_code: 'HD-0031', room_number: 'Phòng 303', building_name: 'Green House', month: 10, year: 2023, room_price: 2800000, total_amount: 3200000, paid_amount: 0, status: 'unpaid', due_date: '05/10/2023' },
]

// ========== STATE ==========
const invoices = ref(mockInvoices)
const loading = ref(false)

const filters = ref({
  status: null,
})

const currentPage = ref(1)
const pageSize = ref(10)
const invoiceDetailsVisible = ref(false)
const selectedInvoice = ref(null)

// ========== COMPUTED ==========
const filteredInvoices = computed(() => {
  let result = invoices.value
  if (filters.value.status) {
    result = result.filter(i => i.status === filters.value.status)
  }
  return result
})

const totalPages = computed(() => Math.ceil(filteredInvoices.value.length / pageSize.value) || 1)

const paginatedInvoices = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredInvoices.value.slice(start, start + pageSize.value)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  for (let i = 1; i <= Math.min(total, 5); i++) pages.push(i)
  return pages
})

// Reset page to 1 when page size changes
watch(pageSize, () => {
  currentPage.value = 1
})

// ========== METHODS ==========
const formatPrice = (price) => {
  if (!price) return '0đ'
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ'
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

const fetchInvoices = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      per_page: pageSize.value,
      ...(filters.value.status && { status: filters.value.status }),
    }
    const response = await api.get('/invoices', { params })
    const apiData = response.data?.data || response.data || response
    if (apiData && Array.isArray(apiData) && apiData.length > 0) {
      invoices.value = apiData
    }
  } catch (error) {
    // Keep mock data if failed
  } finally {
    loading.value = false
  }
}

const approvePayment = async (invoice) => {
  try {
    await ElMessageBox.confirm(
      'Xác nhận duyệt thanh toán cho hóa đơn này?',
      'Xác nhận',
      { type: 'warning' }
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

// ========== QR DIALOG ==========
const qrVisible = ref(false)
const qrLoading = ref(false)
const currentInvoice = ref(null)

const viewDetail = (invoice) => {
  ElMessage.info(`Xem chi tiết hóa đơn: ${invoice.invoice_code}`)
}

const openInvoiceDetails = (invoice) => {
  selectedInvoice.value = invoice;
  invoiceDetailsVisible.value = true;
};

const showPaymentQR = async (invoice) => {
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
.font-inter {
  font-family: 'Inter', sans-serif;
}

.table-row-hover:hover {
  background-color: rgba(55, 65, 81, 0.5);
}

/* Custom Select Dark */
.dark-select :deep(.el-input__wrapper) {
  background-color: #1F2937 !important;
  border: 1px solid #374151 !important;
  box-shadow: none !important;
  border-radius: 8px;
  height: 40px;
}
.dark-select :deep(.el-input__inner) {
  color: #F9FAFB !important;
  font-weight: 500;
}
.dark-select :deep(.el-select__placeholder) {
  color: #9CA3AF !important;
}

.dark-select-mini :deep(.el-input__wrapper) {
  background-color: #111827 !important;
  border: 1px solid #374151 !important;
  box-shadow: none !important;
  border-radius: 8px;
  height: 32px;
}
.dark-select-mini :deep(.el-input__inner) {
  color: #F9FAFB !important;
  font-weight: 500;
  font-size: 13px;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
.animate-pulse {
  animation: pulse 1.5s ease-in-out infinite;
}

/* Override Element Plus Dialog for Dark Theme */
.dark-dialog :deep(.el-dialog) {
  background-color: #1F2937 !important;
  border: 1px solid #374151;
  border-radius: 12px;
}
.dark-dialog :deep(.el-dialog__title) {
  color: #F9FAFB !important;
  font-weight: bold;
}
.dark-dialog :deep(.el-dialog__headerbtn .el-dialog__close) {
  color: #9CA3AF !important;
}

/* Modal Styles */
:deep(.invoice-details-dialog) {
  background-color: #1f2937 !important;
  border-radius: 20px;
  border: 1px solid #374151;
}

:deep(.invoice-details-dialog .el-dialog__title) {
  color: #fff !important;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.detail-item label {
  display: block;
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #6b7280;
  margin-bottom: 4px;
}

.dark-btn-secondary {
  background-color: #374151 !important;
  border: none !important;
  color: #d1d5db !important;
  border-radius: 10px !important;
  font-weight: bold !important;
}

.dark-btn-primary {
  background-color: #3b82f6 !important;
  border: none !important;
  color: #fff !important;
  border-radius: 10px !important;
  font-weight: bold !important;
}

.dark-btn-success {
  background-color: #10b981 !important;
  border: none !important;
  color: #fff !important;
  border-radius: 10px !important;
  font-weight: bold !important;
}

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background: #374151;
  border-radius: 10px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
</style>

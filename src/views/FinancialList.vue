<template>
  <div class="financial-page min-h-full p-6 font-inter">
    <!-- Top Bar -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-black text-main">Quản lý Thu Chi</h1>
      <button
        class="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-105"
        style="background-color: #3B82F6;"
        @click="showCreateDialog"
      >
        <el-icon><Plus /></el-icon>
        Thêm phiếu thu/chi
      </button>
    </div>

    <!-- Filter Bar -->
    <div class="p-6 rounded-2xl border mb-8 bg-card border-main">
      <div class="flex flex-wrap items-end gap-5">
        <div class="flex flex-col gap-1.5">
          <label class="text-[10px] font-black uppercase tracking-widest text-dim">Loại giao dịch</label>
          <el-select v-model="filters.type" placeholder="Tất cả" clearable size="large" class="theme-select-custom" style="width: 160px;">
            <el-option label="Thu" value="income" />
            <el-option label="Chi" value="expense" />
          </el-select>
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-[10px] font-black uppercase tracking-widest text-dim">Khoảng thời gian</label>
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="—"
            start-placeholder="Từ ngày"
            end-placeholder="Đến ngày"
            format="DD/MM/YYYY"
            value-format="YYYY-MM-DD"
            size="large"
            class="theme-datepicker-custom"
            style="width: 260px;"
            @change="handleDateChange"
          />
        </div>

        <button
          class="flex items-center justify-center px-6 rounded-xl text-sm font-bold transition-all hover:opacity-80 active:scale-95"
          style="background-color: rgba(16, 185, 129, 0.15); color: #10b981; height: 40px;"
          @click="fetchData"
        >
          Lọc kết quả
        </button>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Income Card -->
      <div class="p-6 rounded-2xl border relative overflow-hidden transition-all hover:scale-[1.02] bg-income-card border-income-card">
        <p class="text-[10px] font-black uppercase tracking-widest mb-2" style="color: #10B981;">Tổng thu</p>
        <div class="flex items-baseline gap-1 mb-2">
          <span class="text-3xl font-black text-main">{{ formatPriceOnly(summary.total_income) }}</span>
          <span class="text-lg font-medium underline text-dim">đ</span>
        </div>
        <div class="flex items-center gap-1.5 text-xs font-bold" style="color: #10B981;">
          <el-icon><Top /></el-icon>
          <span>Tăng 12% so với tháng trước</span>
        </div>
      </div>

      <!-- Expense Card -->
      <div class="p-6 rounded-2xl border relative overflow-hidden transition-all hover:scale-[1.02] bg-expense-card border-expense-card">
        <p class="text-[10px] font-black uppercase tracking-widest mb-2" style="color: #EF4444;">Tổng chi</p>
        <div class="flex items-baseline gap-1 mb-2">
          <span class="text-3xl font-black text-main">{{ formatPriceOnly(summary.total_expense) }}</span>
          <span class="text-lg font-medium underline text-dim">đ</span>
        </div>
        <div class="flex items-center gap-1.5 text-xs font-bold" style="color: #EF4444;">
          <el-icon><Bottom /></el-icon>
          <span>Giảm 5% so với tháng trước</span>
        </div>
      </div>

      <!-- Balance Card -->
      <div class="p-6 rounded-2xl border relative overflow-hidden transition-all hover:scale-[1.02] bg-balance-card border-balance-card">
        <p class="text-[10px] font-black uppercase tracking-widest mb-2" style="color: #3B82F6;">Số dư</p>
        <div class="flex items-baseline gap-1 mb-2">
          <span class="text-3xl font-black text-main">{{ formatPriceOnly(summary.total_income - summary.total_expense) }}</span>
          <span class="text-lg font-medium underline text-dim">đ</span>
        </div>
        <div class="flex items-center gap-1.5 text-xs font-bold" style="color: #3B82F6;">
          <el-icon><Wallet /></el-icon>
          <span>Khả dụng trong ví</span>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="rounded-2xl border border-main overflow-hidden shadow-2xl bg-table">
      <div class="overflow-x-auto">
        <table class="w-full text-sm border-collapse whitespace-nowrap">
          <thead class="bg-header">
            <tr class="border-b border-main">
              <th class="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-dim">ID</th>
              <th class="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-dim">Ngày giao dịch</th>
              <th class="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-dim">Loại</th>
              <th class="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-dim">Nội dung thanh toán</th>
              <th class="px-6 py-5 text-right text-[11px] font-black uppercase tracking-widest text-dim">Số tiền (VNĐ)</th>
              <th class="px-6 py-5 text-center text-[11px] font-black uppercase tracking-widest text-dim">Thao tác</th>
            </tr>
          </thead>
          <tbody v-if="!loading" class="bg-table">
            <tr
              v-for="(row, index) in entries"
              :key="row.id"
              class="table-row-hover transition-colors border-b last:border-0 border-main"
            >
              <!-- ID -->
              <td class="px-6 py-5">
                <span class="font-bold text-xs text-id">
                  {{ row.type === 'income' ? '#PT' : '#PC' }}-{{ String(row.id).padStart(4, '0') }}
                </span>
              </td>

              <!-- Ngày -->
              <td class="px-6 py-5 text-main font-bold text-sm">{{ formatDate(row.entry_date) }}</td>

              <!-- Loại -->
              <td class="px-6 py-5">
                <span
                  class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                  :style="row.type === 'income' 
                    ? 'background-color: rgba(16, 185, 129, 0.1); color: #10B981;' 
                    : 'background-color: rgba(239, 68, 68, 0.1); color: #EF4444;'"
                >
                  {{ row.type === 'income' ? 'Thu' : 'Chi' }}
                </span>
              </td>

              <!-- Nội dung -->
              <td class="px-6 py-5">
                <p class="font-bold text-main text-sm mb-0.5">{{ row.description }}</p>
                <p class="text-[11px] text-dim font-medium">{{ row.room?.room_number || row.room_number || 'Chung' }}</p>
              </td>

              <!-- Số tiền -->
              <td class="px-6 py-5 text-right">
                <span class="text-main font-black text-sm">{{ formatPriceOnly(row.amount) }}đ</span>
              </td>

              <!-- Thao tác -->
              <td class="px-6 py-5 text-center">
                <div class="flex items-center justify-center gap-3">
                  <button class="action-btn btn-view" title="Xem chi tiết" @click="openDetails(row)">
                    <el-icon size="16"><View /></el-icon>
                  </button>
                  <button class="action-btn btn-edit" title="Sửa" @click="editEntry(row)">
                    <el-icon size="16"><Edit /></el-icon>
                  </button>
                  <button class="action-btn btn-print" title="In phiếu" @click="printEntry(row)">
                    <el-icon size="16"><Printer /></el-icon>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 flex items-center justify-between bg-header border-t border-main">
        <span class="text-[11px] font-bold text-dim uppercase tracking-widest">
          Tổng cộng <span class="text-main">{{ pagination.total }}</span> giao dịch
        </span>
        <div class="flex items-center gap-4">
          <el-pagination
            v-model:current-page="pagination.page"
            v-model:page-size="pagination.perPage"
            :page-sizes="[10, 20, 50]"
            :total="pagination.total"
            layout="sizes, prev, pager, next"
            class="custom-pagination"
            @current-change="fetchData"
            @size-change="fetchData"
          />
        </div>
      </div>
    </div>

    <!-- ===== ADD RECEIPT/PAYMENT DIALOG ===== -->
    <el-dialog 
      v-model="dialogVisible" 
      :title="isEdit ? 'Cập nhật Phiếu Thu/Chi' : 'Khởi tạo Phiếu Thu/Chi mới'" 
      width="90%" style="max-width: 750px" 
      class="theme-dialog-v3"
      append-to-body
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-position="top" class="mt-2">
        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="Loại phiếu" prop="type" required>
            <el-select v-model="form.type" class="!w-full">
              <el-option label="Phiếu Thu (Income)" value="income" />
              <el-option label="Phiếu Chi (Expense)" value="expense" />
            </el-select>
          </el-form-item>
          <el-form-item label="Số tiền" prop="amount" required>
            <el-input v-model.number="form.amount" placeholder="Nhập số tiền...">
              <template #append>đ</template>
            </el-input>
          </el-form-item>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <el-form-item label="Ngày thu/chi" prop="entry_date" required>
            <el-date-picker
              v-model="form.entry_date"
              type="date"
              format="DD/MM/YYYY"
              value-format="YYYY-MM-DD"
              class="!w-full"
            />
          </el-form-item>
          <el-form-item label="Tên tòa nhà" prop="building_name" required>
            <el-input v-model="form.building_name" placeholder="Ví dụ: Blue Moon..." />
          </el-form-item>
          <el-form-item label="Mã phòng" prop="room_number" required>
            <el-input v-model="form.room_number" placeholder="Ví dụ: P.102..." />
          </el-form-item>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="Tên khách thuê" prop="tenant_name" required>
            <el-input v-model="form.tenant_name" placeholder="Họ và tên khách..." />
          </el-form-item>
          <el-form-item label="Mã hóa đơn liên quan" prop="invoice_code" required>
            <el-input v-model="form.invoice_code" placeholder="HĐ-0012..." />
          </el-form-item>
        </div>

        <el-form-item label="Nội dung phiếu" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="Mô tả chi tiết nội dung thu/chi..." />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="flex justify-end gap-3 px-4 pb-4 mt-4">
          <el-button @click="dialogVisible = false" class="theme-btn-cancel-v3">Hủy bỏ</el-button>
          <el-button type="primary" @click="submitForm" class="theme-btn-submit-v3" :loading="isSubmitting">
            Lưu phiếu giao dịch
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- Details Modal -->
    <el-dialog
      v-model="detailsVisible"
      title="Chi tiết Phiếu Thu/Chi"
      width="90%" style="max-width: 600px"
      class="financial-details-dialog theme-dialog-custom"
      :align-center="true"
    >
      <div v-if="selectedEntry" class="p-4">
        <div class="grid grid-cols-2 gap-6">
          <div class="detail-item">
            <label>Mã Phiếu</label>
            <p class="font-black text-blue-500 text-lg">
              {{ selectedEntry.type === 'income' ? '#PT' : '#PC' }}-{{ String(selectedEntry.id).padStart(4, '0') }}
            </p>
          </div>
          <div class="detail-item">
            <label>Loại giao dịch</label>
            <div class="mt-1">
              <span
                class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                :style="selectedEntry.type === 'income' 
                  ? 'background-color: rgba(16, 185, 129, 0.1); color: #10B981;' 
                  : 'background-color: rgba(239, 68, 68, 0.1); color: #EF4444;'"
              >
                {{ selectedEntry.type === 'income' ? 'Thu (Income)' : 'Chi (Expense)' }}
              </span>
            </div>
          </div>
          <div class="detail-item">
            <label>Số tiền</label>
            <p class="text-main font-black text-xl">{{ formatPriceOnly(selectedEntry.amount) }}đ</p>
          </div>
          <div class="detail-item">
            <label>Ngày giao dịch</label>
            <p class="text-main font-bold">{{ formatDate(selectedEntry.entry_date) }}</p>
          </div>
          <div class="detail-item">
            <label>Phòng / Tòa nhà</label>
            <p class="text-main font-bold">
              {{ selectedEntry.room?.room_number || selectedEntry.room_number || 'Chung' }}
              <span v-if="selectedEntry.building_name || selectedEntry.room?.building?.name" class="text-dim font-medium ml-1">
                ({{ selectedEntry.building_name || selectedEntry.room?.building?.name }})
              </span>
            </p>
          </div>
          <div class="detail-item">
            <label>Khách thuê</label>
            <p class="text-main font-bold">{{ selectedEntry.tenant_name || selectedEntry.tenant?.name || '---' }}</p>
          </div>
          <div class="detail-item">
            <label>Mã Hóa đơn liên quan</label>
            <p class="text-dim font-bold">{{ selectedEntry.invoice_code || '---' }}</p>
          </div>
          <div class="detail-item">
            <label>Ngày tạo / Cập nhật</label>
            <p class="text-xs text-dim font-medium mt-1">
              Tạo: {{ selectedEntry.created_at || '10/10/2023' }} <br/>
              Sửa: {{ selectedEntry.updated_at || '12/10/2023' }}
            </p>
          </div>
        </div>

        <div class="mt-8 pt-6 border-t border-main">
          <div class="detail-item">
            <label class="mb-2 block">Nội dung phiếu</label>
            <div class="bg-section rounded-xl p-4 border border-main">
              <p class="text-sm text-dim italic">
                {{ selectedEntry.description || "Không có nội dung chi tiết." }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-3 p-4">
          <el-button @click="detailsVisible = false" class="theme-btn-secondary">Đóng</el-button>
          <el-button type="primary" @click="printEntry(selectedEntry)" class="theme-btn-primary">
            <el-icon class="mr-2"><Printer /></el-icon> In phiếu
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '../axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Top, Bottom, Wallet, Edit, Printer, View } from '@element-plus/icons-vue'

// ========== STATE ==========
const entries = ref([])
const rooms = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const detailsVisible = ref(false)
const selectedEntry = ref(null)
const isEdit = ref(false)
const formRef = ref(null)
const isSubmitting = ref(false)

const filters = reactive({
  type: null,
})

const dateRange = ref(null)
const summary = ref({
  total_income: 0,
  total_expense: 0,
})

const pagination = reactive({
  page: 1,
  perPage: 10,
  total: 0,
})

const form = reactive({
  type: 'income',
  amount: 0,
  description: '',
  room_id: null,
  room_number: '',
  building_name: '',
  tenant_name: '',
  invoice_code: '',
  entry_date: new Date().toISOString().split('T')[0],
})

const rules = {
  type: [{ required: true, message: 'Vui lòng chọn loại', trigger: 'change' }],
  amount: [{ required: true, message: 'Vui lòng nhập số tiền', trigger: 'blur' }],
  entry_date: [{ required: true, message: 'Vui lòng chọn ngày', trigger: 'change' }],
  building_name: [{ required: true, message: 'Vui lòng nhập tên tòa nhà', trigger: 'blur' }],
  room_number: [{ required: true, message: 'Vui lòng nhập mã phòng', trigger: 'blur' }],
  tenant_name: [{ required: true, message: 'Vui lòng nhập tên khách thuê', trigger: 'blur' }],
  invoice_code: [{ required: true, message: 'Vui lòng nhập mã hóa đơn', trigger: 'blur' }],
}

const formatPriceOnly = (price) => {
  return new Intl.NumberFormat('vi-VN').format(price)
}

const formatDate = (date) => {
  if (!date) return '---'
  const d = new Date(date)
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

const handleDateChange = (value) => {
  filters.start_date = value?.[0]
  filters.end_date = value?.[1]
}

const fetchData = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      per_page: pagination.perPage,
      ...(filters.type && { type: filters.type }),
      ...(dateRange.value?.[0] && { start_date: dateRange.value[0] }),
      ...(dateRange.value?.[1] && { end_date: dateRange.value[1] }),
    }
    const response = await api.get('/financial', { params })
    const data = response.data?.data || response.data || response
    const payload = response.data || response
    entries.value = Array.isArray(data) ? data : []
    pagination.total = payload?.total || data.length || 0
    if (payload?.summary) {
      summary.value = payload.summary
    }
  } catch (error) {
    entries.value = []
    pagination.total = 0
    summary.value = { total_income: 0, total_expense: 0 }
    ElMessage.error('Không thể tải danh sách thu chi từ máy chủ')
  } finally {
    loading.value = false
  }
}

const fetchRooms = async () => {
  try {
    const response = await api.get('/rooms', { params: { per_page: 100 } })
    const data = response.data?.data || response.data || response
    rooms.value = Array.isArray(data) ? data : []
  } catch (error) {
  }
}

const showCreateDialog = () => {
  isEdit.value = false
  Object.assign(form, {
    type: 'income',
    amount: 0,
    description: '',
    room_id: null,
    room_number: '',
    building_name: '',
    tenant_name: '',
    invoice_code: '',
    entry_date: new Date().toISOString().split('T')[0],
  })
  dialogVisible.value = true
}

const openDetails = (row) => {
  selectedEntry.value = row
  detailsVisible.value = true
}

const editEntry = (row) => {
  isEdit.value = true
  Object.assign(form, {
    id: row.id,
    type: row.type,
    amount: row.amount,
    description: row.description,
    room_id: row.room_id,
    room_number: row.room_number || '',
    building_name: row.building_name || '',
    tenant_name: row.tenant_name || '',
    invoice_code: row.invoice_code || '',
    entry_date: row.entry_date,
  })
  dialogVisible.value = true
}

const submitForm = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  isSubmitting.value = true
  try {
    if (isEdit.value) {
      await api.put(`/financial/${form.id}`, form)
      ElMessage.success('Cập nhật thành công')
    } else {
      await api.post('/financial', form)
      ElMessage.success('Thêm mới thành công')
    }
    dialogVisible.value = false
    fetchData()
  } catch (error) {
    ElMessage.error(error.response?.data?.message || 'Lỗi khi lưu dữ liệu')
  } finally {
    isSubmitting.value = false
  }
}

const printEntry = (row) => {
  const typeLabel = row.type === 'income' ? 'Phiếu Thu' : 'Phiếu Chi';
  ElMessage.info(`Đang chuẩn bị in ${typeLabel}: ${typeLabel === 'Phiếu Thu' ? '#PT' : '#PC'}-${String(row.id).padStart(4, '0')}`);
};

onMounted(() => {
  fetchData()
  fetchRooms()
})
</script>

<style>
:root {
  --bg-page: #f8fafc;
  --bg-card: #ffffff;
  --bg-table: #ffffff;
  --bg-header: #f8fafc;
  --bg-section: #f1f5f9;
  --bg-income-card: rgba(16, 185, 129, 0.05);
  --bg-expense-card: rgba(239, 68, 68, 0.05);
  --bg-balance-card: rgba(59, 130, 246, 0.05);
  --border-main: #e2e8f0;
  --border-income: rgba(16, 185, 129, 0.1);
  --border-expense: rgba(239, 68, 68, 0.1);
  --border-balance: rgba(59, 130, 246, 0.1);
  --text-main: #1e293b;
  --text-dim: #64748b;
  --select-bg: #ffffff;
  --btn-secondary-bg: #f1f5f9;
  --btn-secondary-text: #475569;
  --text-id: #3B82F6;
}

html.dark {
  --bg-page: #111827;
  --bg-card: #1f2937;
  --bg-table: #111827;
  --bg-header: #1f2937;
  --bg-section: rgba(31, 41, 55, 0.5);
  --bg-income-card: rgba(16, 185, 129, 0.08);
  --bg-expense-card: rgba(239, 68, 68, 0.08);
  --bg-balance-card: rgba(59, 130, 246, 0.08);
  --border-main: #374151;
  --border-income: rgba(16, 185, 129, 0.2);
  --border-expense: rgba(239, 68, 68, 0.2);
  --border-balance: rgba(59, 130, 246, 0.2);
  --text-main: #ffffff;
  --text-dim: #9ca3af;
  --select-bg: #111827;
  --btn-secondary-bg: #374151;
  --btn-secondary-text: #d1d5db;
  --text-id: #6b7280;
}
</style>

<style scoped>
.financial-page {
  background-color: var(--bg-page);
  color: var(--text-main);
  transition: all 0.3s ease;
}

.text-main { color: var(--text-main); }
.text-dim { color: var(--text-dim); }
.bg-card { background-color: var(--bg-card); }
.bg-table { background-color: var(--bg-table); }
.bg-header { background-color: var(--bg-header); }
.bg-section { background-color: var(--bg-section); }
.text-id { color: var(--text-id); }
.border-main { border-color: var(--border-main); }

.bg-income-card { background-color: var(--bg-income-card); }
.border-income-card { border-color: var(--border-income); }
.bg-expense-card { background-color: var(--bg-expense-card); }
.border-expense-card { border-color: var(--border-expense); }
.bg-balance-card { background-color: var(--bg-balance-card); }
.border-balance-card { border-color: var(--border-balance); }

.font-inter {
  font-family: 'Inter', sans-serif;
}

.table-row-hover:hover {
  background-color: var(--bg-header);
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--btn-secondary-bg);
  color: var(--text-dim);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-view:hover {
  background-color: rgba(59, 130, 246, 0.15) !important;
  color: #3b82f6 !important;
}

.btn-edit:hover {
  background-color: rgba(16, 185, 129, 0.15) !important;
  color: #10b981 !important;
}

.btn-print:hover {
  background-color: rgba(245, 158, 11, 0.15) !important;
  color: #f59e0b !important;
}

/* Custom Select Theme */
.theme-select-custom :deep(.el-input__wrapper) {
  background-color: var(--select-bg) !important;
  border: 1px solid var(--border-main) !important;
  box-shadow: none !important;
  border-radius: 8px;
}
.theme-select-custom :deep(.el-input__inner) {
  color: var(--text-main) !important;
  font-weight: 500;
}

/* Custom DatePicker Theme */
.theme-datepicker-custom :deep(.el-range-input) {
  background-color: transparent !important;
  color: var(--text-main) !important;
}
.theme-datepicker-custom :deep(.el-input__wrapper) {
  background-color: var(--select-bg) !important;
  border: 1px solid var(--border-main) !important;
  box-shadow: none !important;
  border-radius: 8px;
}
.theme-datepicker-custom :deep(.el-range-separator) {
  color: var(--text-dim) !important;
}

/* Dialog Theme */
:deep(.theme-dialog-custom .el-dialog) {
  background-color: var(--bg-card) !important;
  border-radius: 16px;
  border: 1px solid var(--border-main);
}
:deep(.theme-dialog-custom .el-dialog__title) {
  color: var(--text-main) !important;
  font-weight: 900;
}
:deep(.theme-dialog-custom .el-form-item__label) {
  color: var(--text-dim) !important;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
:deep(.theme-dialog-custom .el-input__wrapper),
:deep(.theme-dialog-custom .el-textarea__inner) {
  background-color: var(--bg-page) !important;
  box-shadow: none !important;
  border: 1px solid var(--border-main) !important;
  color: var(--text-main) !important;
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

.theme-btn-secondary {
  background-color: var(--btn-secondary-bg) !important;
  border: none !important;
  color: var(--btn-secondary-text) !important;
  border-radius: 10px !important;
  font-weight: bold !important;
}

.theme-btn-primary {
  background-color: #3b82f6 !important;
  border: none !important;
  color: #fff !important;
  border-radius: 10px !important;
  font-weight: bold !important;
}

/* Dialog Theme Customization (Shared style v3) */
:deep(.theme-dialog-v3) {
  border-radius: 24px !important;
  overflow: hidden;
  background-color: var(--bg-card) !important;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.2) !important;
}

:deep(.theme-dialog-v3 .el-dialog__header) {
  padding: 24px 32px;
  margin-right: 0;
  border-bottom: 1px solid var(--border-main);
}

:deep(.theme-dialog-v3 .el-dialog__title) {
  font-weight: 900;
  font-size: 1.25rem;
  color: var(--text-main);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

:deep(.theme-dialog-v3 .el-dialog__body) {
  padding: 32px;
}

:deep(.theme-dialog-v3 .el-form-item__label) {
  font-weight: 800;
  color: var(--text-dim);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
}

:deep(.theme-dialog-v3 .el-input__wrapper) {
  background-color: var(--bg-page) !important;
  box-shadow: none !important;
  border: 1px solid var(--border-main) !important;
  border-radius: 12px;
  padding: 8px 12px;
}

:deep(.theme-dialog-v3 .el-input__inner) {
  font-weight: 600;
  color: var(--text-main);
}

.theme-btn-cancel-v3 {
  border-radius: 12px;
  height: 44px;
  padding: 0 24px;
  font-weight: 700;
  border: 1px solid var(--border-main);
  background: transparent;
  color: var(--text-dim);
}

.theme-btn-submit-v3 {
  border-radius: 12px;
  height: 44px;
  padding: 0 24px;
  font-weight: 700;
  background-color: #3b82f6 !important;
  border: none !important;
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
}
</style>

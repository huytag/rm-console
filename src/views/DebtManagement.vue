<template>
  <div class="debt-management-page min-h-full p-6 font-inter">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-black text-main">Quản lý Công nợ</h1>
    </div>

    <!-- Stat Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Total Debt -->
      <div class="stat-card p-6 rounded-2xl border border-main bg-card flex flex-col justify-between h-[150px] group">
        <div class="flex justify-between items-start">
          <p class="text-[10px] font-black uppercase tracking-widest text-dim">Tổng công nợ</p>
          <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-500/10 text-blue-500">
            <el-icon size="20"><Wallet /></el-icon>
          </div>
        </div>
        <div>
          <h2 class="text-2xl font-black text-main mb-2">1.250.000.000đ</h2>
          <span class="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
            <el-icon><Top /></el-icon> +4.5% so với tháng trước
          </span>
        </div>
      </div>

      <!-- Overdue Debt -->
      <div class="stat-card p-6 rounded-2xl border border-rose-500/30 bg-card flex flex-col justify-between h-[150px] relative overflow-hidden group">
        <div class="flex justify-between items-start">
          <p class="text-[10px] font-black uppercase tracking-widest text-dim">Nợ quá hạn</p>
          <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-rose-500/10 text-rose-500">
            <el-icon size="20"><Warning /></el-icon>
          </div>
        </div>
        <div>
          <h2 class="text-2xl font-black text-rose-500 mb-2">450.000.000đ</h2>
          <span class="text-[10px] font-bold text-rose-500 flex items-center gap-1">
            <el-icon><Calendar /></el-icon> Cần xử lý ngay
          </span>
        </div>
        <div class="absolute -right-2 -bottom-2 opacity-[0.03] text-rose-500">
          <el-icon size="80"><Warning /></el-icon>
        </div>
      </div>

      <!-- In-term Debt -->
      <div class="stat-card p-6 rounded-2xl border border-main bg-card flex flex-col justify-between h-[150px] group">
        <div class="flex justify-between items-start">
          <p class="text-[10px] font-black uppercase tracking-widest text-dim">Nợ trong hạn</p>
          <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-500/10 text-slate-400">
            <el-icon size="20"><Clock /></el-icon>
          </div>
        </div>
        <div>
          <h2 class="text-2xl font-black text-main mb-2">800.000.000đ</h2>
          <span class="text-[10px] font-bold text-dim flex items-center gap-1">
            <el-icon><CircleCheck /></el-icon> Đang trong tiến độ
          </span>
        </div>
      </div>

      <!-- Debtor Count -->
      <div class="stat-card p-6 rounded-2xl border border-main bg-card flex flex-col justify-between h-[150px] group">
        <div class="flex justify-between items-start">
          <p class="text-[10px] font-black uppercase tracking-widest text-dim">Số khách nợ</p>
          <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-500/10 text-amber-500">
            <el-icon size="20"><UserFilled /></el-icon>
          </div>
        </div>
        <div>
          <h2 class="text-2xl font-black text-main mb-2">24 khách</h2>
          <span class="text-[10px] font-bold text-dim flex items-center gap-1">
            <el-icon><House /></el-icon> Trên tổng 150 phòng
          </span>
        </div>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="bg-card/40 p-5 rounded-2xl border border-main mb-8">
      <div class="flex flex-wrap items-end gap-x-8 gap-y-6">
        <div class="flex flex-col gap-2 w-64">
          <span class="text-[10px] font-black uppercase text-dim tracking-widest">Tòa nhà</span>
          <el-select v-model="filters.building" placeholder="Tất cả tòa nhà" class="theme-select-custom w-full">
            <el-option label="Tất cả tòa nhà" :value="null" />
            <el-option label="Tòa nhà Blue Moon" value="blue-moon" />
            <el-option label="Sunrise Tower" value="sunrise" />
          </el-select>
        </div>
        <div class="flex flex-col gap-2 w-64">
          <span class="text-[10px] font-black uppercase text-dim tracking-widest">Trạng thái</span>
          <el-select v-model="filters.status" placeholder="Tất cả trạng thái" class="theme-select-custom w-full">
            <el-option label="Tất cả trạng thái" :value="null" />
            <el-option label="Quá hạn" value="overdue" />
            <el-option label="Chờ thanh toán" value="pending" />
          </el-select>
        </div>
        <div class="flex flex-col gap-2 w-80">
          <span class="text-[10px] font-black uppercase text-dim tracking-widest">Khoảng thời gian</span>
          <el-date-picker
            v-model="filters.dateRange"
            type="daterange"
            range-separator="-"
            start-placeholder="Ngày bắt đầu"
            end-placeholder="Ngày kết thúc"
            class="theme-datepicker-custom w-full"
          />
        </div>
        <div class="flex items-center gap-3 ml-auto">
          <button 
            class="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-105 hover:bg-blue-500 hover:shadow-lg active:scale-95 bg-blue-600 shadow-lg shadow-blue-500/20"
            @click="showCreateDialog"
          >
            <el-icon><Plus /></el-icon> Thêm công nợ
          </button>
          <button
            class="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105 hover:shadow-lg active:scale-95"
            style="background-color: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3);"
          >
            <el-icon><ChatLineRound /></el-icon> Gửi nhắc nợ đồng loạt
          </button>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="rounded-2xl border border-main overflow-hidden shadow-2xl bg-table">
      <div class="overflow-x-auto">
        <table class="w-full text-sm border-collapse">
          <thead class="bg-header">
            <tr class="border-b border-main">
              <th class="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-dim">ID</th>
              <th class="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-dim">Khách thuê / Phòng</th>
              <th class="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-dim">Tòa nhà</th>
              <th class="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-dim">Nội dung</th>
              <th class="px-6 py-5 text-right text-[10px] font-black uppercase tracking-widest text-dim">Số tiền nợ</th>
              <th class="px-6 py-5 text-center text-[10px] font-black uppercase tracking-widest text-dim">Ngày đến hạn</th>
              <th class="px-6 py-5 text-center text-[10px] font-black uppercase tracking-widest text-dim">Trạng thái</th>
              <th class="px-6 py-5 text-center text-[10px] font-black uppercase tracking-widest text-dim">Thao tác</th>
            </tr>
          </thead>
          <tbody class="bg-table">
            <tr v-for="(row, idx) in paginatedDebts" :key="idx" class="table-row-hover border-b last:border-0 border-main transition-colors">
              <td class="px-6 py-5">
                <span class="text-[11px] font-black text-id tracking-widest">#CN-{{ row.id }}</span>
              </td>
              <td class="px-6 py-5">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-xs font-black text-white shrink-0">
                    {{ getInitials(row.tenant) }}
                  </div>
                  <div class="flex flex-col">
                    <span class="text-sm font-bold text-main">{{ row.tenant }}</span>
                    <span class="text-[10px] font-bold text-dim">Phòng {{ row.room }}</span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-5">
                <span class="text-xs font-medium text-dim leading-relaxed">{{ row.building }}</span>
              </td>
              <td class="px-6 py-5">
                <span class="text-xs font-medium text-dim leading-relaxed whitespace-pre-line">{{ row.content }}</span>
              </td>
              <td class="px-6 py-5 text-right">
                <span class="text-sm font-black text-main">{{ formatPrice(row.amount) }}</span>
              </td>
              <td class="px-6 py-5 text-center">
                <span class="text-xs font-bold text-rose-500" v-if="row.status === 'overdue'">{{ row.dueDate }}</span>
                <span class="text-xs font-bold text-dim" v-else>{{ row.dueDate }}</span>
              </td>
              <td class="px-6 py-5 text-center">
                <span 
                  class="inline-block px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border"
                  :class="row.status === 'overdue' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'"
                >
                  {{ row.status === 'overdue' ? 'Quá hạn' : 'Chờ thanh toán' }}
                </span>
              </td>
              <td class="px-6 py-5 text-center">
                <div class="flex items-center justify-center gap-3">
                  <button class="action-btn btn-remind" title="Gửi nhắc nợ">
                    <el-icon size="18"><Bell /></el-icon>
                  </button>
                  <button class="action-btn btn-view" title="Xem chi tiết">
                    <el-icon size="18"><View /></el-icon>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="px-6 py-4 flex items-center justify-between bg-header border-t border-main">
        <span class="text-[10px] font-bold text-dim uppercase tracking-widest">Tổng cộng <span class="text-main">{{ totalCount }}</span> bản ghi</span>
        <div class="flex items-center gap-4">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50]"
            :total="totalCount"
            layout="sizes, prev, pager, next"
            class="custom-pagination"
          />
        </div>
      </div>
    </div>

    <!-- ===== ADD/EDIT DEBT DIALOG ===== -->
    <el-dialog 
      v-model="dialogVisible" 
      :title="isEdit ? 'Cập nhật Công nợ' : 'Ghi nhận Công nợ mới'" 
      width="750px"
      class="theme-dialog-v3"
      append-to-body
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-position="top" class="mt-2">
        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="Tên khách thuê" prop="tenant" required>
            <el-input v-model="form.tenant" placeholder="Nguyễn Văn A..." />
          </el-form-item>
          <el-form-item label="Số tiền nợ" prop="amount" required>
            <el-input v-model.number="form.amount" placeholder="Nhập số tiền...">
              <template #append>đ</template>
            </el-input>
          </el-form-item>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="Tên tòa nhà" prop="building" required>
            <el-input v-model="form.building" placeholder="Tòa nhà Blue Moon..." />
          </el-form-item>
          <el-form-item label="Mã phòng" prop="room" required>
            <el-input v-model="form.room" placeholder="Phòng 101..." />
          </el-form-item>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="Ngày đến hạn" prop="dueDate" required>
            <el-date-picker v-model="form.dueDate" type="date" placeholder="Chọn ngày" class="!w-full theme-datepicker-v3" format="DD/MM/YYYY" value-format="DD/MM/YYYY" />
          </el-form-item>
          <el-form-item label="Trạng thái" prop="status" required>
            <el-select v-model="form.status" class="!w-full">
              <el-option label="Chờ thanh toán" value="pending" />
              <el-option label="Quá hạn" value="overdue" />
            </el-select>
          </el-form-item>
        </div>

        <el-form-item label="Nội dung nợ" prop="content">
          <el-input v-model="form.content" type="textarea" :rows="3" placeholder="Lý do nợ, chi tiết các khoản..." />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="flex justify-end gap-3 px-4 pb-4 mt-4">
          <el-button @click="dialogVisible = false" class="theme-btn-cancel-v3">Hủy bỏ</el-button>
          <el-button type="primary" @click="submitForm" class="theme-btn-submit-v3">
            {{ isEdit ? 'Lưu thay đổi' : 'Ghi nhận công nợ' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  Search, Bell, Setting, Wallet, Warning, Clock, UserFilled, Top, 
  Calendar, CircleCheck, House, Plus, ChatLineRound, View, ArrowLeft, ArrowRight
} from '@element-plus/icons-vue'

const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)

const filters = reactive({
  building: null,
  status: null,
  dateRange: null
})

const debts = ref([
  { id: '0102', tenant: 'Nguyễn Văn A', room: '101', building: 'Tòa nhà Blue Moon', content: 'Tiền phòng &\nDịch vụ T10', amount: 5500000, dueDate: '15/10/2023', status: 'overdue' },
  { id: '0103', tenant: 'Trần Thị H', room: '204', building: 'Tòa nhà Blue Moon', content: 'Phát sinh hư hỏng', amount: 1200000, dueDate: '30/10/2023', status: 'pending' },
  { id: '0104', tenant: 'Lê Văn M', room: '305', building: 'Sunrise Tower', content: 'Tiền điện nước T09', amount: 850000, dueDate: '10/10/2023', status: 'overdue' },
])

const currentPage = ref(1)
const pageSize = ref(10)

const totalCount = ref(0)
import { watch } from 'vue'
watch(debts, (newVal) => {
  totalCount.value = newVal.length
}, { immediate: true })

const paginatedDebts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return debts.value.slice(start, start + pageSize.value)
})

const form = reactive({
  tenant: '',
  room: '',
  building: '',
  content: '',
  amount: 0,
  dueDate: '',
  status: 'pending'
})

const rules = {
  tenant: [{ required: true, message: 'Vui lòng nhập tên khách thuê', trigger: 'blur' }],
  amount: [{ required: true, message: 'Vui lòng nhập số tiền', trigger: 'blur' }],
  building: [{ required: true, message: 'Vui lòng nhập tên tòa nhà', trigger: 'blur' }],
  room: [{ required: true, message: 'Vui lòng nhập mã phòng', trigger: 'blur' }],
  dueDate: [{ required: true, message: 'Vui lòng chọn ngày đến hạn', trigger: 'change' }],
  status: [{ required: true, message: 'Vui lòng chọn trạng thái', trigger: 'change' }],
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND',
    maximumFractionDigits: 0 
  }).format(price || 0)
}

const getInitials = (name) => {
  if (!name) return '??'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(-2)
}

const showCreateDialog = () => {
  isEdit.value = false
  Object.assign(form, {
    tenant: '',
    room: '',
    building: '',
    content: '',
    amount: 0,
    dueDate: '',
    status: 'pending'
  })
  dialogVisible.value = true
}

const submitForm = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  ElMessage.success(isEdit.value ? 'Cập nhật công nợ thành công' : 'Thêm công nợ mới thành công')
  dialogVisible.value = false
}
</script>

<style>
:root {
  --bg-page: #f8fafc;
  --bg-card: #ffffff;
  --bg-table: #ffffff;
  --bg-header: #f8fafc;
  --bg-input: #ffffff;
  --text-main: #1e293b;
  --text-dim: #64748b;
  --border-main: #e2e8f0;
  --text-id: #3B82F6;
}

html.dark {
  --bg-page: #0f172a;
  --bg-card: #1e293b;
  --bg-table: #0f172a;
  --bg-header: #1e293b;
  --bg-input: #1f2937;
  --text-main: #f8fafc;
  --text-dim: #94a3b8;
  --border-main: #334155;
  --text-id: #60a5fa;
}
</style>

<style scoped>
.debt-management-page {
  background-color: var(--bg-page);
  color: var(--text-main);
  transition: all 0.3s ease;
}

.text-main { color: var(--text-main); }
.text-dim { color: var(--text-dim); }
.text-id { color: var(--text-id); }
.bg-card { background-color: var(--bg-card); }
.bg-table { background-color: var(--bg-table); }
.bg-header { background-color: var(--bg-header); }
.border-main { border-color: var(--border-main); }

.font-inter {
  font-family: 'Inter', sans-serif;
}

.stat-card {
  transition: all 0.3s ease;
}
.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.3);
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
  background-color: var(--bg-input);
  color: var(--text-dim);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-remind:hover {
  background-color: rgba(245, 158, 11, 0.15) !important;
  color: #f59e0b !important;
}

.btn-view:hover {
  background-color: rgba(59, 130, 246, 0.15) !important;
  color: #3b82f6 !important;
}

/* Custom Select/Datepicker Theme */
:deep(.theme-select-custom .el-input__wrapper),
:deep(.theme-datepicker-custom.el-range-editor.el-input__wrapper) {
  background-color: var(--bg-page) !important;
  box-shadow: none !important;
  border: 1px solid var(--border-main) !important;
  border-radius: 12px !important;
}

:deep(.el-input__inner) {
  color: var(--text-main) !important;
  font-size: 13px !important;
  font-weight: 500 !important;
}

:deep(.el-range-input) {
  color: var(--text-main) !important;
  font-weight: 500 !important;
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

:deep(.theme-dialog-v3 .el-input__wrapper),
:deep(.theme-datepicker-v3.el-input__wrapper) {
  background-color: var(--bg-page) !important;
  box-shadow: none !important;
  border: 1px solid var(--border-main) !important;
  border-radius: 12px !important;
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

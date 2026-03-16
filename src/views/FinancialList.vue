<template>
  <div class="financial-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>Quản lý Thu Chi</span>
          <el-button type="primary" @click="showCreateDialog">
            Thêm mới
          </el-button>
        </div>
      </template>
      
      <div class="filters">
        <el-select v-model="filters.type" placeholder="Loại" clearable style="width: 120px; margin-right: 10px;">
          <el-option label="Thu" value="income" />
          <el-option label="Chi" value="expense" />
        </el-select>
        
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="đến"
          start-placeholder="Từ ngày"
          end-placeholder="Đến ngày"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          style="width: 280px; margin-right: 10px;"
          @change="handleDateChange"
        />
        
        <el-button type="primary" @click="fetchData">Lọc</el-button>
      </div>
      
      <div class="summary-cards">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-card class="summary-card income">
              <div class="summary-content">
                <div class="summary-label">Tổng thu</div>
                <div class="summary-value">{{ formatPrice(summary.total_income) }}</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="summary-card expense">
              <div class="summary-content">
                <div class="summary-label">Tổng chi</div>
                <div class="summary-value">{{ formatPrice(summary.total_expense) }}</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="summary-card balance">
              <div class="summary-content">
                <div class="summary-label">Số dư</div>
                <div class="summary-value">{{ formatPrice(summary.total_income - summary.total_expense) }}</div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      
      <el-table :data="entries" v-loading="loading" style="margin-top: 20px;">
        <el-table-column label="Ngày" width="120">
          <template #default="{ row }">
            {{ formatDate(row.entry_date) }}
          </template>
        </el-table-column>
        <el-table-column label="Loại" width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === 'income' ? 'success' : 'danger'">
              {{ row.type === 'income' ? 'Thu' : 'Chi' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="Số tiền" width="150">
          <template #default="{ row }">
            <span :class="row.type === 'income' ? 'text-success' : 'text-danger'">
              {{ row.type === 'income' ? '+' : '-' }}{{ formatPrice(row.amount) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="Nội dung" />
        <el-table-column label="Phòng" width="100">
          <template #default="{ row }">
            {{ row.room?.room_number || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="Thao tác" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="danger" size="small" @click="deleteEntry(row)">
              Xóa
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
    
    <el-dialog v-model="dialogVisible" :title="isEdit ? 'Sửa' : 'Thêm mới'" width="500px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="Loại" prop="type">
          <el-select v-model="form.type" style="width: 100%;">
            <el-option label="Thu" value="income" />
            <el-option label="Chi" value="expense" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="Số tiền" prop="amount">
          <el-input-number v-model="form.amount" :min="0" :step="10000" style="width: 100%;" />
        </el-form-item>
        
        <el-form-item label="Nội dung" prop="description">
          <el-input v-model="form.description" type="textarea" />
        </el-form-item>
        
        <el-form-item label="Phòng" prop="room_id">
          <el-select v-model="form.room_id" clearable style="width: 100%;">
            <el-option
              v-for="room in rooms"
              :key="room.id"
              :label="room.room_number"
              :value="room.id"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="Ngày" prop="entry_date">
          <el-date-picker
            v-model="form.entry_date"
            type="date"
            format="DD/MM/YYYY"
            value-format="YYYY-MM-DD"
            style="width: 100%;"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="dialogVisible = false">Hủy</el-button>
        <el-button type="primary" @click="submitForm">Lưu</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '../axios'
import { ElMessage, ElMessageBox } from 'element-plus'

const entries = ref([])
const rooms = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)

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
  perPage: 20,
  total: 0,
})

const form = reactive({
  type: 'income',
  amount: 0,
  description: '',
  room_id: null,
  entry_date: new Date().toISOString().split('T')[0],
})

const rules = {
  type: [{ required: true, message: 'Vui lòng chọn loại', trigger: 'change' }],
  amount: [{ required: true, message: 'Vui lòng nhập số tiền', trigger: 'blur' }],
  description: [{ required: true, message: 'Vui lòng nhập nội dung', trigger: 'blur' }],
  entry_date: [{ required: true, message: 'Vui lòng chọn ngày', trigger: 'change' }],
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN')
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
    entries.value = response.data.data.data
    pagination.total = response.data.data.total
    summary.value = response.data.summary
  } catch (error) {
    ElMessage.error('Failed to load data')
  } finally {
    loading.value = false
  }
}

const fetchRooms = async () => {
  try {
    const response = await api.get('/rooms', { params: { per_page: 100 } })
    rooms.value = response.data.data.data
  } catch (error) {
    console.error('Failed to load rooms')
  }
}

const showCreateDialog = () => {
  isEdit.value = false
  Object.assign(form, {
    type: 'income',
    amount: 0,
    description: '',
    room_id: null,
    entry_date: new Date().toISOString().split('T')[0],
  })
  dialogVisible.value = true
}

const submitForm = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  
  try {
    await api.post('/financial', form)
    ElMessage.success('Thêm mới thành công')
    dialogVisible.value = false
    fetchData()
  } catch (error) {
    ElMessage.error('Failed to save')
  }
}

const deleteEntry = async (entry) => {
  try {
    await ElMessageBox.confirm('Bạn có chắc chắn muốn xóa?', 'Xác nhận', { type: 'warning' })
    await api.delete(`/financial/${entry.id}`)
    ElMessage.success('Xóa thành công')
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Failed to delete')
    }
  }
}

onMounted(() => {
  fetchData()
  fetchRooms()
})
</script>

<style scoped>
.financial-page {
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filters {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.summary-cards {
  margin-top: 20px;
}

.summary-card {
  text-align: center;
}

.summary-card.income {
  border-left: 4px solid #67c23a;
}

.summary-card.expense {
  border-left: 4px solid #f56c6c;
}

.summary-card.balance {
  border-left: 4px solid #409eff;
}

.summary-value {
  font-size: 24px;
  font-weight: bold;
  margin-top: 8px;
}

.text-success {
  color: #67c23a;
}

.text-danger {
  color: #f56c6c;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>

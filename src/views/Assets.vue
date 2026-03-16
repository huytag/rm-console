<template>
  <div class="assets-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>Quản lý tài sản</span>
          <el-button type="primary" @click="showCreateDialog">Thêm tài sản</el-button>
        </div>
      </template>
      
      <div class="filters">
        <el-select v-model="filters.room_id" placeholder="Lọc theo phòng" clearable style="width: 200px; margin-right: 10px;">
          <el-option
            v-for="room in rooms"
            :key="room.id"
            :label="`${room.room_number} - ${room.building?.name}`"
            :value="room.id"
          />
        </el-select>
        
        <el-select v-model="filters.condition" placeholder="Tình trạng" clearable style="width: 150px; margin-right: 10px;">
          <el-option label="Mới" value="new" />
          <el-option label="Tốt" value="good" />
          <el-option label="Trung bình" value="fair" />
          <el-option label="Kém" value="poor" />
          <el-option label="Hỏng" value="broken" />
        </el-select>
        
        <el-button type="primary" @click="fetchData">Lọc</el-button>
      </div>
      
      <el-table :data="assets" v-loading="loading">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="name" label="Tên tài sản" />
        <el-table-column prop="category" label="Loại" width="120" />
        <el-table-column label="Phòng" width="120">
          <template #default="{ row }">
            {{ row.room?.room_number || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="Tình trạng" width="120">
          <template #default="{ row }">
            <el-tag :type="getConditionType(row.condition)">
              {{ getConditionLabel(row.condition) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Giá mua" width="130">
          <template #default="{ row }">
            {{ row.purchase_price ? formatPrice(row.purchase_price) : '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="description" label="Mô tả" />
        <el-table-column label="Thao tác" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="editAsset(row)">Sửa</el-button>
            <el-button type="danger" size="small" @click="deleteAsset(row)">Xóa</el-button>
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
    
    <el-dialog v-model="dialogVisible" :title="isEdit ? 'Sửa tài sản' : 'Thêm tài sản'" width="500px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="Tên tài sản" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        
        <el-form-item label="Loại" prop="category">
          <el-select v-model="form.category" style="width: 100%;">
            <el-option label="Điện tử" value="Điện tử" />
            <el-option label="Nội thất" value="Nội thất" />
            <el-option label="Thiết bị vệ sinh" value="Thiết bị vệ sinh" />
            <el-option label="Khác" value="Khác" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="Phòng" prop="room_id">
          <el-select v-model="form.room_id" clearable style="width: 100%;">
            <el-option
              v-for="room in rooms"
              :key="room.id"
              :label="`${room.room_number} - ${room.building?.name}`"
              :value="room.id"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="Tình trạng" prop="condition">
          <el-select v-model="form.condition" style="width: 100%;">
            <el-option label="Mới" value="new" />
            <el-option label="Tốt" value="good" />
            <el-option label="Trung bình" value="fair" />
            <el-option label="Kém" value="poor" />
            <el-option label="Hỏng" value="broken" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="Ngày mua" prop="purchase_date">
          <el-date-picker
            v-model="form.purchase_date"
            type="date"
            format="DD/MM/YYYY"
            value-format="YYYY-MM-DD"
            style="width: 100%;"
          />
        </el-form-item>
        
        <el-form-item label="Giá mua" prop="purchase_price">
          <el-input-number v-model="form.purchase_price" :min="0" :step="100000" style="width: 100%;" />
        </el-form-item>
        
        <el-form-item label="Mô tả" prop="description">
          <el-input v-model="form.description" type="textarea" />
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

const assets = ref([])
const rooms = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)

const filters = reactive({
  room_id: null,
  condition: null,
})

const pagination = reactive({
  page: 1,
  perPage: 20,
  total: 0,
})

const form = reactive({
  name: '',
  category: '',
  condition: 'new',
  room_id: null,
  description: '',
  purchase_date: '',
  purchase_price: 0,
})

const rules = {
  name: [{ required: true, message: 'Vui lòng nhập tên', trigger: 'blur' }],
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

const getConditionType = (condition) => {
  const types = { new: 'success', good: 'success', fair: 'warning', poor: 'danger', broken: 'danger' }
  return types[condition] || 'info'
}

const getConditionLabel = (condition) => {
  const labels = { new: 'Mới', good: 'Tốt', fair: 'Trung bình', poor: 'Kém', broken: 'Hỏng' }
  return labels[condition] || condition
}

const fetchData = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      per_page: pagination.perPage,
      ...(filters.room_id && { room_id: filters.room_id }),
      ...(filters.condition && { condition: filters.condition }),
    }
    const response = await api.get('/assets', { params })
    assets.value = response.data.data.data
    pagination.total = response.data.data.total
  } catch (error) {
    ElMessage.error('Failed to load assets')
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
    name: '', category: '', condition: 'new', room_id: null,
    description: '', purchase_date: '', purchase_price: 0,
  })
  dialogVisible.value = true
}

const editAsset = (asset) => {
  isEdit.value = true
  Object.assign(form, {
    id: asset.id,
    name: asset.name,
    category: asset.category,
    condition: asset.condition,
    room_id: asset.room_id,
    description: asset.description,
    purchase_date: asset.purchase_date,
    purchase_price: asset.purchase_price,
  })
  dialogVisible.value = true
}

const submitForm = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  
  try {
    if (isEdit.value) {
      await api.put(`/assets/${form.id}`, form)
      ElMessage.success('Cập nhật thành công')
    } else {
      await api.post('/assets', form)
      ElMessage.success('Thêm mới thành công')
    }
    dialogVisible.value = false
    fetchData()
  } catch (error) {
    ElMessage.error('Failed to save')
  }
}

const deleteAsset = async (asset) => {
  try {
    await ElMessageBox.confirm('Bạn có chắc chắn muốn xóa?', 'Xác nhận', { type: 'warning' })
    await api.delete(`/assets/${asset.id}`)
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
.assets-page {
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

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>

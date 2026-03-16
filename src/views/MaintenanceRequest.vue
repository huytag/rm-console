<template>
  <div class="maintenance-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>Yêu cầu sửa chữa / bảo trì</span>
          <el-button type="primary" @click="dialogVisible = true">Gửi yêu cầu mới</el-button>
        </div>
      </template>

      <el-table :data="requests" stripe style="width: 100%">
        <el-table-column prop="created_at" label="Ngày gửi" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column prop="title" label="Tiêu đề" />
        <el-table-column prop="priority" label="Ưu tiên" width="120">
          <template #default="scope">
            <el-tag :type="getPriorityType(scope.row.priority)">
              {{ scope.row.priority.toUpperCase() }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="Trạng thái" width="150">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusLabel(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Thao tác" width="120">
          <template #default="scope">
            <el-button link type="primary" @click="viewDetail(scope.row)">Chi tiết</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" title="Gửi yêu cầu sửa chữa" width="50%">
      <el-form :model="form" label-width="120px">
        <el-form-item label="Tiêu đề">
          <el-input v-model="form.title" placeholder="VD: Hư vòi nước, Hư máy lạnh..." />
        </el-form-item>
        <el-form-item label="Mô tả chi tiết">
          <el-input v-model="form.description" type="textarea" :rows="4" />
        </el-form-item>
        <el-form-item label="Phòng">
          <el-select v-model="form.room_id" placeholder="Chọn phòng">
            <el-option v-for="room in userRooms" :key="room.id" :label="room.name" :value="room.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="Mức độ ưu tiên">
          <el-radio-group v-model="form.priority">
            <el-radio label="low">Thấp</el-radio>
            <el-radio label="medium">Vừa</el-radio>
            <el-radio label="high">Cao</el-radio>
            <el-radio label="urgent">Khẩn cấp</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Hình ảnh">
          <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            multiple
            v-model:file-list="fileList"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Hủy</el-button>
          <el-button type="primary" :loading="submitting" @click="submitRequest">
            Gửi yêu cầu
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import api from '../axios'
import { ElMessage } from 'element-plus'

const requests = ref([])
const userRooms = ref([])
const dialogVisible = ref(false)
const submitting = ref(false)
const fileList = ref([])

const form = ref({
  title: '',
  description: '',
  room_id: null,
  priority: 'medium',
})

const fetchRequests = async () => {
  try {
    const res = await api.get('/maintenance')
    requests.value = res.data.data
  } catch (error) {
    console.error(error)
  }
}

const submitRequest = async () => {
  if (!form.value.title || !form.value.description) {
    ElMessage.warning('Vui lòng điền đầy đủ thông tin')
    return
  }

  submitting.value = true
  const formData = new FormData()
  formData.append('title', form.value.title)
  formData.append('description', form.value.description)
  formData.append('room_id', form.value.room_id)
  formData.append('priority', form.value.priority)
  
  fileList.value.forEach(file => {
    formData.append('images[]', file.raw)
  })

  try {
    await api.post('/maintenance', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    ElMessage.success('Gửi yêu cầu thành công')
    dialogVisible.value = false
    fetchRequests()
    resetForm()
  } catch (error) {
    ElMessage.error('Có lỗi xảy ra')
  } finally {
    submitting.value = false
  }
}

const resetForm = () => {
  form.value = { title: '', description: '', room_id: null, priority: 'medium' }
  fileList.value = []
}

const formatDate = (date) => new Date(date).toLocaleString('vi-VN')

const getPriorityType = (p) => {
  const types = { low: 'info', medium: 'primary', high: 'warning', urgent: 'danger' }
  return types[p] || 'info'
}

const getStatusType = (s) => {
  const types = { pending: 'info', in_progress: 'warning', completed: 'success', cancelled: 'danger' }
  return types[s] || 'info'
}

const getStatusLabel = (s) => {
  const labels = { pending: 'Đang chờ', in_progress: 'Đang xử lý', completed: 'Hoàn thành', cancelled: 'Đã hủy' }
  return labels[s] || s
}

onMounted(() => {
  fetchRequests()
  // Mocking user rooms for now - in reality, fetch from API
  userRooms.value = [{ id: 1, name: 'Phòng 101' }] 
})
</script>

<style scoped>
.maintenance-container {
  padding: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

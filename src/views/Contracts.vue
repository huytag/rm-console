<template>
  <div class="contracts-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>Danh Sách Hợp Đồng</span>
        </div>
      </template>
      
      <el-table :data="contracts" v-loading="loading">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column label="Phòng" width="120">
          <template #default="{ row }">
            {{ row.room?.room_number }}
          </template>
        </el-table-column>
        <el-table-column label="Người thuê">
          <template #default="{ row }">
            {{ row.tenant?.name }}
          </template>
        </el-table-column>
        <el-table-column label="Số điện thoại" width="120">
          <template #default="{ row }">
            {{ row.tenant?.phone }}
          </template>
        </el-table-column>
        <el-table-column label="Ngày bắt đầu" width="120">
          <template #default="{ row }">
            {{ row.start_date }}
          </template>
        </el-table-column>
        <el-table-column label="Ngày kết thúc" width="120">
          <template #default="{ row }">
            {{ row.end_date }}
          </template>
        </el-table-column>
        <el-table-column label="Tiền cọc" width="120">
          <template #default="{ row }">
            {{ formatPrice(row.deposit) }}
          </template>
        </el-table-column>
        <el-table-column label="Trạng thái" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Hợp đồng" width="150">
          <template #default="{ row }">
            <el-link v-if="row.signed_contract_path" type="primary" :href="getFileUrl(row.signed_contract_path)" target="_blank">
              Xem bản ký
            </el-link>
            <span v-else class="text-gray">Chưa tải lên</span>
          </template>
        </el-table-column>
        <el-table-column label="Thao tác" width="150" fixed="right">
          <template #default="{ row }">
            <el-upload
              action="#"
              :auto-upload="false"
              :show-file-list="false"
              :on-change="(file) => handleUpload(file, row)"
            >
              <el-button type="primary" size="small" :loading="row.uploading">Tải lên</el-button>
            </el-upload>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../axios'
import { ElMessage } from 'element-plus'

const contracts = ref([])
const loading = ref(false)

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

const getStatusType = (status) => {
  const types = { active: 'success', expired: 'warning', terminated: 'danger' }
  return types[status] || 'info'
}

const getStatusLabel = (status) => {
  const labels = { active: 'Hoạt động', expired: 'Hết hạn', terminated: 'Chấm dứt' }
  return labels[status] || status
}

const fetchContracts = async () => {
  loading.value = true
  try {
    const response = await api.get('/contracts')
    contracts.value = response.data.data
  } catch (error) {
    ElMessage.error('Failed to load contracts')
  } finally {
    loading.value = false
  }
}

const handleUpload = async (file, row) => {
  const formData = new FormData()
  formData.append('file', file.raw)
  
  row.uploading = true
  try {
    await api.post(`/contracts/${row.id}/upload-signed`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    ElMessage.success('Tải lên thành công')
    fetchContracts()
  } catch (error) {
    ElMessage.error('Có lỗi xảy ra khi tải lên')
  } finally {
    row.uploading = false
  }
}

const getFileUrl = (path) => {
  if (!path) return ''
  return `http://rm-api.local/storage/${path}`
}

onMounted(() => {
  fetchContracts()
})
</script>

<style scoped>
.contracts-page {
  height: 100%;
}
</style>

<template>
  <div class="services-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>Quản Lý Dịch Vụ</span>
        </div>
      </template>
      
      <el-table :data="services" v-loading="loading">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="name" label="Tên dịch vụ" />
        <el-table-column label="Đơn giá" width="150">
          <template #default="{ row }">
            {{ formatPrice(row.unit_price) }} / {{ row.unit }}
          </template>
        </el-table-column>
        <el-table-column label="Loại" width="120">
          <template #default="{ row }">
            <el-tag :type="row.type === 'fixed' ? 'success' : 'warning'">
              {{ row.type === 'fixed' ? 'Cố định' : 'Theo công tơ' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Trạng thái" width="100">
          <template #default="{ row }">
            <el-tag :type="row.is_active ? 'success' : 'danger'">
              {{ row.is_active ? 'Hoạt động' : 'Không hoạt động' }}
            </el-tag>
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

const services = ref([])
const loading = ref(false)

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

const fetchServices = async () => {
  loading.value = true
  try {
    const response = await api.get('/services')
    services.value = response.data.data
  } catch (error) {
    ElMessage.error('Failed to load services')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchServices()
})
</script>

<style scoped>
.services-page {
  height: 100%;
}
</style>

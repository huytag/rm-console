<template>
  <div class="tenants-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>Danh Sách Người Thuê</span>
        </div>
      </template>
      
      <el-table :data="tenants" v-loading="loading">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="name" label="Tên" />
        <el-table-column prop="email" label="Email" />
        <el-table-column prop="phone" label="Số điện thoại" width="130" />
        <el-table-column label="CMND/CCCD">
          <template #default="{ row }">
            {{ row.identity_card?.card_number }}
          </template>
        </el-table-column>
        <el-table-column label="Trạng thái" width="100">
          <template #default="{ row }">
            <el-tag :type="row.role === 'admin' ? 'warning' : 'success'">
              {{ row.role === 'admin' ? 'Admin' : 'Người thuê' }}
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

const tenants = ref([])
const loading = ref(false)

const fetchTenants = async () => {
  loading.value = true
  try {
    const response = await api.get('/users', { params: { role: 'tenant' } })
    tenants.value = response.data.data
  } catch (error) {
    ElMessage.error('Failed to load tenants')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchTenants()
})
</script>

<style scoped>
.tenants-page {
  height: 100%;
}
</style>

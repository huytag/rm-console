<template>
  <div class="buildings-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>Danh Sách Tòa Nhà</span>
        </div>
      </template>
      
      <el-table :data="buildings" v-loading="loading">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="name" label="Tên tòa nhà" />
        <el-table-column prop="address" label="Địa chỉ" />
        <el-table-column label="Quản lý">
          <template #default="{ row }">
            {{ row.manager?.name }}
          </template>
        </el-table-column>
        <el-table-column label="Số phòng" width="100">
          <template #default="{ row }">
            {{ row.rooms_count }}
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

const buildings = ref([])
const loading = ref(false)

const fetchBuildings = async () => {
  loading.value = true
  try {
    const response = await api.get('/buildings')
    buildings.value = response.data.data
  } catch (error) {
    ElMessage.error('Failed to load buildings')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchBuildings()
})
</script>

<style scoped>
.buildings-page {
  height: 100%;
}
</style>

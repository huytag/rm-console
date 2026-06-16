<template>
  <div class="audit-log-page min-h-full p-6 font-inter">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-black text-main">Nhật Ký Hệ Thống</h1>
        <p class="text-sm text-dim font-medium mt-1">Theo dõi các hoạt động và thay đổi trong hệ thống</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex items-center gap-4 mb-6">
      <el-select v-model="filterAction" placeholder="Tất cả thao tác" clearable @change="fetchLogs" class="theme-select" style="width: 180px;">
        <el-option label="Tạo mới" value="create" />
        <el-option label="Cập nhật" value="update" />
        <el-option label="Xóa" value="delete" />
        <el-option label="Đăng nhập" value="login" />
        <el-option label="Đăng xuất" value="logout" />
      </el-select>

      <el-select v-model="filterEntity" placeholder="Tất cả đối tượng" clearable @change="fetchLogs" class="theme-select" style="width: 180px;">
        <el-option label="Người dùng" value="User" />
        <el-option label="Phòng" value="Room" />
        <el-option label="Tòa nhà" value="Building" />
        <el-option label="Hợp đồng" value="Contract" />
        <el-option label="Hóa đơn" value="Invoice" />
        <el-option label="Cấu hình" value="SystemConfig" />
      </el-select>

      <el-date-picker
        v-model="filterDate"
        type="daterange"
        range-separator="đến"
        start-placeholder="Từ ngày"
        end-placeholder="Đến ngày"
        format="DD/MM/YYYY"
        value-format="YYYY-MM-DD"
        @change="fetchLogs"
        class="theme-date-picker"
        style="width: 260px;"
      />
    </div>

    <!-- Table -->
    <div class="rounded-2xl border border-main overflow-hidden shadow-2xl bg-table" v-loading="loading">
      <div class="overflow-x-auto">
        <table class="w-full text-sm border-collapse whitespace-nowrap">
          <thead class="bg-header">
            <tr class="border-b border-main">
              <th class="px-5 py-4 text-left text-[11px] font-black uppercase tracking-widest text-dim">Thời gian</th>
              <th class="px-5 py-4 text-left text-[11px] font-black uppercase tracking-widest text-dim">Người dùng</th>
              <th class="px-5 py-4 text-center text-[11px] font-black uppercase tracking-widest text-dim">Thao tác</th>
              <th class="px-5 py-4 text-center text-[11px] font-black uppercase tracking-widest text-dim">Đối tượng</th>
              <th class="px-5 py-4 text-center text-[11px] font-black uppercase tracking-widest text-dim">ID</th>
              <th class="px-5 py-4 text-left text-[11px] font-black uppercase tracking-widest text-dim">IP</th>
              <th class="px-5 py-4 text-left text-[11px] font-black uppercase tracking-widest text-dim">Chi tiết</th>
            </tr>
          </thead>
          <tbody class="bg-table">
            <tr
              v-for="log in logs"
              :key="log.id"
              class="table-row-hover transition-colors border-b last:border-0 border-main"
            >
              <td class="px-5 py-4">
                <span class="text-xs font-bold text-dim">{{ formatDateTime(log.created_at) }}</span>
              </td>
              <td class="px-5 py-4">
                <div>
                  <p class="font-bold text-main text-sm">{{ log.user?.name || 'System' }}</p>
                  <p class="text-[10px] text-dim">{{ log.user?.email || 'N/A' }}</p>
                </div>
              </td>
              <td class="px-5 py-4 text-center">
                <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                  :style="getActionStyle(log.action)">
                  {{ getActionLabel(log.action) }}
                </span>
              </td>
              <td class="px-5 py-4 text-center">
                <span class="font-bold text-main text-xs">{{ log.entity_type || '---' }}</span>
              </td>
              <td class="px-5 py-4 text-center">
                <span class="text-dim font-medium">{{ log.entity_id || '---' }}</span>
              </td>
              <td class="px-5 py-4">
                <span class="text-xs text-dim font-mono">{{ log.ip_address || '---' }}</span>
              </td>
              <td class="px-5 py-4">
                <button
                  v-if="log.old_values || log.new_values"
                  class="text-blue-500 hover:text-blue-700 text-xs font-bold underline"
                  @click="showDetails(log)"
                >
                  Xem chi tiết
                </button>
                <span v-else class="text-dim text-xs">---</span>
              </td>
            </tr>
            <tr v-if="logs.length === 0 && !loading">
              <td colspan="7" class="px-5 py-12 text-center text-dim">
                <el-icon size="32" class="mb-2"><DocumentDelete /></el-icon>
                <p>Không có nhật ký hoạt động</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 flex items-center justify-between bg-header border-t border-main">
        <span class="text-[11px] font-bold text-dim uppercase tracking-widest">
          Tổng cộng <span class="text-main">{{ pagination.total }}</span> bản ghi
        </span>

        <div class="flex items-center gap-4">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50]"
            :total="pagination.total"
            layout="sizes, prev, pager, next"
            @current-change="fetchLogs"
            @size-change="fetchLogs"
            class="custom-pagination"
          />
        </div>
      </div>
    </div>

    <!-- Details Dialog -->
    <el-dialog
      v-model="detailsVisible"
      title="Chi tiết thay đổi"
      width="90%"
      style="max-width: 600px"
      class="theme-dialog"
    >
      <div v-if="selectedLog" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-section p-4 rounded-xl border border-main">
            <p class="text-[10px] font-black uppercase tracking-widest text-dim mb-2">Thao tác</p>
            <span :style="getActionStyle(selectedLog.action)">
              {{ getActionLabel(selectedLog.action) }}
            </span>
          </div>
          <div class="bg-section p-4 rounded-xl border border-main">
            <p class="text-[10px] font-black uppercase tracking-widest text-dim mb-2">Đối tượng</p>
            <p class="font-bold text-main">{{ selectedLog.entity_type }} #{{ selectedLog.entity_id }}</p>
          </div>
        </div>

        <div v-if="selectedLog.old_values" class="bg-section p-4 rounded-xl border border-main">
          <p class="text-[10px] font-black uppercase tracking-widest text-dim mb-2">Giá trị cũ</p>
          <pre class="text-xs text-dim font-mono whitespace-pre-wrap">{{ JSON.stringify(selectedLog.old_values, null, 2) }}</pre>
        </div>

        <div v-if="selectedLog.new_values" class="bg-section p-4 rounded-xl border border-main">
          <p class="text-[10px] font-black uppercase tracking-widest text-dim mb-2">Giá trị mới</p>
          <pre class="text-xs text-dim font-mono whitespace-pre-wrap">{{ JSON.stringify(selectedLog.new_values, null, 2) }}</pre>
        </div>

        <div class="bg-section p-4 rounded-xl border border-main">
          <p class="text-[10px] font-black uppercase tracking-widest text-dim mb-2">User Agent</p>
          <p class="text-xs text-dim font-mono">{{ selectedLog.user_agent || 'N/A' }}</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '../axios'
import { ElMessage } from 'element-plus'
import { DocumentDelete } from '@element-plus/icons-vue'

const logs = ref([])
const loading = ref(false)
const detailsVisible = ref(false)
const selectedLog = ref(null)
const currentPage = ref(1)
const pageSize = ref(20)
const pagination = ref({ total: 0 })

const filterAction = ref('')
const filterEntity = ref('')
const filterDate = ref(null)

const formatDateTime = (dateStr) => {
  if (!dateStr) return '---'
  return new Date(dateStr).toLocaleString('vi-VN')
}

const getActionLabel = (action) => {
  const labels = {
    create: 'Tạo mới',
    update: 'Cập nhật',
    delete: 'Xóa',
    login: 'Đăng nhập',
    logout: 'Đăng xuất'
  }
  return labels[action] || action
}

const getActionStyle = (action) => {
  const styles = {
    create: 'color: #10b981; background-color: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2);',
    update: 'color: #3b82f6; background-color: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2);',
    delete: 'color: #ef4444; background-color: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2);',
    login: 'color: #8b5cf6; background-color: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.2);',
    logout: 'color: #6b7280; background-color: rgba(107, 114, 128, 0.1); border: 1px solid rgba(107, 114, 128, 0.2);'
  }
  return styles[action] || styles.update
}

const showDetails = (log) => {
  selectedLog.value = log
  detailsVisible.value = true
}

const fetchLogs = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      per_page: pageSize.value
    }
    if (filterAction.value) params.action = filterAction.value
    if (filterEntity.value) params.entity_type = filterEntity.value
    if (filterDate.value && filterDate.value.length === 2) {
      params.start_date = filterDate.value[0]
      params.end_date = filterDate.value[1]
    }

    const response = await api.get('/audit-logs', { params })
    const data = response.data?.data || response.data || []
    logs.value = Array.isArray(data) ? data : []
    if (response.data?.meta) {
      pagination.value.total = response.data.meta.total || logs.value.length
    }
  } catch (error) {
    ElMessage.error(error.response?.data?.message || 'Lỗi khi tải nhật ký hệ thống')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchLogs()
})
</script>

<template>
  <div class="system-config-page min-h-full p-6 font-inter">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-black text-main">Cấu Hình Hệ Thống</h1>
        <p class="text-sm text-dim font-medium mt-1">Quản lý các thông số cấu hình cho hệ thống</p>
      </div>
      <el-button type="primary" @click="openCreateDialog" class="theme-btn-submit-v3">
        <el-icon><Plus /></el-icon>
        Thêm cấu hình
      </el-button>
    </div>

    <!-- Filter by Group -->
    <div class="flex items-center gap-4 mb-6">
      <el-radio-group v-model="filterGroup" @change="fetchConfigs">
        <el-radio-button label="">Tất cả</el-radio-button>
        <el-radio-button label="general">Chung</el-radio-button>
        <el-radio-button label="pricing">Giá cả</el-radio-button>
        <el-radio-button label="notification">Thông báo</el-radio-button>
      </el-radio-group>
    </div>

    <!-- Table -->
    <div class="rounded-2xl border border-main overflow-hidden shadow-2xl bg-table" v-loading="loading">
      <div class="overflow-x-auto">
        <table class="w-full text-sm border-collapse whitespace-nowrap">
          <thead class="bg-header">
            <tr class="border-b border-main">
              <th class="px-5 py-4 text-left text-[11px] font-black uppercase tracking-widest text-dim">Key</th>
              <th class="px-5 py-4 text-left text-[11px] font-black uppercase tracking-widest text-dim">Giá trị</th>
              <th class="px-5 py-4 text-center text-[11px] font-black uppercase tracking-widest text-dim">Loại</th>
              <th class="px-5 py-4 text-center text-[11px] font-black uppercase tracking-widest text-dim">Nhóm</th>
              <th class="px-5 py-4 text-left text-[11px] font-black uppercase tracking-widest text-dim">Mô tả</th>
              <th class="px-5 py-4 text-center text-[11px] font-black uppercase tracking-widest text-dim">Thao tác</th>
            </tr>
          </thead>
          <tbody class="bg-table">
            <tr
              v-for="config in configs"
              :key="config.id"
              class="table-row-hover transition-colors border-b last:border-0 border-main"
            >
              <td class="px-5 py-4">
                <span class="font-bold text-main text-sm">{{ config.key }}</span>
              </td>
              <td class="px-5 py-4">
                <span class="text-dim font-medium">{{ formatValue(config.value, config.type) }}</span>
              </td>
              <td class="px-5 py-4 text-center">
                <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                  :style="getTypeStyle(config.type)">
                  {{ config.type }}
                </span>
              </td>
              <td class="px-5 py-4 text-center">
                <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                  :style="getGroupStyle(config.group)">
                  {{ getGroupLabel(config.group) }}
                </span>
              </td>
              <td class="px-5 py-4">
                <span class="text-dim text-xs font-medium">{{ config.description || '---' }}</span>
              </td>
              <td class="px-5 py-4 text-center">
                <div class="flex items-center justify-center gap-3">
                  <button class="action-btn btn-edit" title="Chỉnh sửa" @click="openEditDialog(config)">
                    <el-icon size="16"><Edit /></el-icon>
                  </button>
                  <button class="action-btn btn-delete" title="Xóa" @click="handleDelete(config)">
                    <el-icon size="16"><Delete /></el-icon>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="configs.length === 0 && !loading">
              <td colspan="6" class="px-5 py-12 text-center text-dim">
                <el-icon size="32" class="mb-2"><DocumentDelete /></el-icon>
                <p>Không có dữ liệu cấu hình</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? 'Chỉnh sửa cấu hình' : 'Thêm cấu hình mới'"
      width="90%"
      style="max-width: 500px"
      class="theme-dialog"
      :close-on-click-modal="false"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <el-form-item label="Key" prop="key">
          <el-input v-model="form.key" placeholder="VD: electricity_price" :disabled="isEdit" />
        </el-form-item>

        <el-form-item label="Giá trị" prop="value">
          <el-input v-model="form.value" placeholder="Nhập giá trị" />
        </el-form-item>

        <el-form-item label="Loại dữ liệu" prop="type">
          <el-select v-model="form.type" class="!w-full">
            <el-option label="Chuỗi (string)" value="string" />
            <el-option label="Số (number)" value="number" />
            <el-option label="Logic (boolean)" value="boolean" />
            <el-option label="JSON" value="json" />
          </el-select>
        </el-form-item>

        <el-form-item label="Nhóm" prop="group">
          <el-select v-model="form.group" class="!w-full">
            <el-option label="Chung" value="general" />
            <el-option label="Giá cả" value="pricing" />
            <el-option label="Thông báo" value="notification" />
          </el-select>
        </el-form-item>

        <el-form-item label="Mô tả" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="2" placeholder="Mô tả ngắn về cấu hình này" />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="flex justify-end gap-3">
          <el-button @click="dialogVisible = false" class="theme-btn-cancel">Hủy</el-button>
          <el-button type="primary" @click="submitForm" :loading="isSubmitting" class="theme-btn-submit-v3">
            {{ isEdit ? 'Cập nhật' : 'Tạo mới' }}
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
import { Plus, Edit, Delete, DocumentDelete } from '@element-plus/icons-vue'

const configs = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const isSubmitting = ref(false)
const formRef = ref(null)
const filterGroup = ref('')

const form = reactive({
  id: null,
  key: '',
  value: '',
  type: 'string',
  group: 'general',
  description: ''
})

const rules = {
  key: [{ required: true, message: 'Vui lòng nhập key', trigger: 'blur' }],
  value: [{ required: true, message: 'Vui lòng nhập giá trị', trigger: 'blur' }],
  type: [{ required: true, message: 'Vui lòng chọn loại dữ liệu', trigger: 'change' }],
  group: [{ required: true, message: 'Vui lòng chọn nhóm', trigger: 'change' }]
}

const formatValue = (value, type) => {
  if (value === null || value === undefined) return '---'
  if (type === 'boolean') return value ? 'true' : 'false'
  if (type === 'number') return new Intl.NumberFormat('vi-VN').format(value)
  if (type === 'json') return typeof value === 'string' ? value : JSON.stringify(value)
  return value
}

const getTypeStyle = (type) => {
  const styles = {
    string: 'color: #6366f1; background-color: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.2);',
    number: 'color: #10b981; background-color: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2);',
    boolean: 'color: #f59e0b; background-color: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.2);',
    json: 'color: #8b5cf6; background-color: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.2);'
  }
  return styles[type] || styles.string
}

const getGroupStyle = (group) => {
  const styles = {
    general: 'color: #3b82f6; background-color: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2);',
    pricing: 'color: #10b981; background-color: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2);',
    notification: 'color: #ef4444; background-color: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2);'
  }
  return styles[group] || styles.general
}

const getGroupLabel = (group) => {
  const labels = {
    general: 'Chung',
    pricing: 'Giá cả',
    notification: 'Thông báo'
  }
  return labels[group] || group
}

const fetchConfigs = async () => {
  loading.value = true
  try {
    const params = filterGroup.value ? { group: filterGroup.value } : {}
    const response = await api.get('/system-configs', { params })
    configs.value = response.data || []
  } catch (error) {
    ElMessage.error(error.response?.data?.message || 'Lỗi khi tải danh sách cấu hình')
  } finally {
    loading.value = false
  }
}

const openCreateDialog = () => {
  isEdit.value = false
  form.id = null
  form.key = ''
  form.value = ''
  form.type = 'string'
  form.group = 'general'
  form.description = ''
  dialogVisible.value = true
}

const openEditDialog = (config) => {
  isEdit.value = true
  form.id = config.id
  form.key = config.key
  form.value = config.value
  form.type = config.type
  form.group = config.group
  form.description = config.description || ''
  dialogVisible.value = true
}

const submitForm = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  isSubmitting.value = true
  try {
    const payload = {
      key: form.key,
      value: form.value,
      type: form.type,
      group: form.group,
      description: form.description
    }

    if (isEdit.value) {
      await api.put(`/system-configs/${form.id}`, payload)
      ElMessage.success('Cập nhật cấu hình thành công')
    } else {
      await api.post('/system-configs', payload)
      ElMessage.success('Tạo cấu hình mới thành công')
    }
    dialogVisible.value = false
    fetchConfigs()
  } catch (error) {
    ElMessage.error(error.response?.data?.message || 'Lỗi khi lưu cấu hình')
  } finally {
    isSubmitting.value = false
  }
}

const handleDelete = async (config) => {
  try {
    await ElMessageBox.confirm(
      `Bạn có chắc chắn muốn xóa cấu hình "${config.key}"?`,
      'Xác nhận xóa',
      {
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy',
        type: 'warning'
      }
    )
    await api.delete(`/system-configs/${config.id}`)
    ElMessage.success('Xóa cấu hình thành công')
    fetchConfigs()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(error.response?.data?.message || 'Lỗi khi xóa cấu hình')
    }
  }
}

onMounted(() => {
  fetchConfigs()
})
</script>

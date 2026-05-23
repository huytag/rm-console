<template>
  <div class="services-page min-h-full p-6 font-inter">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-black text-main mb-2">
        Quản lý danh mục dịch vụ
      </h1>
      <p class="text-sm text-dim font-medium">
        Thiết lập và theo dõi các loại dịch vụ tiện ích, chi phí vận hành tòa
        nhà một cách minh bạch.
      </p>
    </div>

    <!-- Stat Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
      <!-- Total Services -->
      <div
        class="stat-card card-blue p-6 rounded-2xl border border-main flex flex-col justify-between h-[180px]"
      >
        <div class="flex justify-between items-start">
          <p class="text-xs font-bold text-dim uppercase tracking-widest">
            Tổng số dịch vụ
          </p>
          <div class="p-2 rounded-lg bg-blue-500/10">
            <el-icon size="20" style="color: #3b82f6"><Box /></el-icon>
          </div>
        </div>
        <div>
          <h2 class="text-4xl font-black text-main mb-2">{{ stats.total }}</h2>
          <p class="text-xs font-bold" style="color: #10b981">
            {{ stats.active }} đang hoạt động
          </p>
        </div>
      </div>

      <!-- Electricity Avg -->
      <div
        class="stat-card card-indigo p-6 rounded-2xl border border-main flex flex-col justify-between h-[180px]"
      >
        <div class="flex justify-between items-start">
          <div class="p-2 rounded-lg bg-indigo-500/10">
            <el-icon size="20" style="color: #6366f1"><Lightning /></el-icon>
          </div>
          <p class="text-xs font-bold text-dim uppercase tracking-widest">
            Điện
          </p>
        </div>
        <div>
          <p
            class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1"
          >
            Giá điện hiện tại
          </p>
          <div class="flex items-baseline gap-1">
            <span class="text-3xl font-black text-main">{{
              formatPriceOnly(stats.electricity)
            }}</span>
            <span class="text-xs font-bold text-dim">đ/kwh</span>
          </div>
        </div>
      </div>

      <!-- Water Avg -->
      <div
        class="stat-card card-emerald p-6 rounded-2xl border border-main flex flex-col justify-between h-[180px]"
      >
        <div class="flex justify-between items-start">
          <div class="p-2 rounded-lg bg-emerald-500/10">
            <el-icon size="20" style="color: #10b981"><Odometer /></el-icon>
          </div>
          <p class="text-xs font-bold text-dim uppercase tracking-widest">
            Nước
          </p>
        </div>
        <div>
          <p
            class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1"
          >
            Giá nước hiện tại
          </p>
          <div class="flex items-baseline gap-1">
            <span class="text-3xl font-black text-main">{{
              formatPriceOnly(stats.water)
            }}</span>
            <span class="text-xs font-bold text-dim">đ/m³</span>
          </div>
        </div>
      </div>

      <!-- Internet Card -->
      <div
        class="stat-card card-purple p-6 rounded-2xl border border-main flex flex-col justify-between h-[180px]"
      >
        <div class="flex justify-between items-start">
          <div class="p-2 rounded-lg bg-purple-500/10">
            <el-icon size="20" style="color: #8b5cf6"><Connection /></el-icon>
          </div>
          <p class="text-xs font-bold text-dim uppercase tracking-widest">
            Mạng
          </p>
        </div>
        <div>
          <p
            class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1"
          >
            Phí Internet
          </p>
          <div class="flex items-baseline gap-1">
            <span class="text-3xl font-black text-main">{{
              formatPriceOnly(stats.internet)
            }}</span>
            <span class="text-xs font-bold text-dim">đ/phòng</span>
          </div>
        </div>
      </div>

      <!-- Cleaning Avg -->
      <div
        class="stat-card card-amber p-6 rounded-2xl border border-main flex flex-col justify-between h-[180px]"
      >
        <div class="flex justify-between items-start">
          <div class="p-2 rounded-lg bg-amber-500/10">
            <el-icon size="20" style="color: #f59e0b"><Brush /></el-icon>
          </div>
          <p class="text-xs font-bold text-dim uppercase tracking-widest">
            Vệ sinh
          </p>
        </div>
        <div>
          <p
            class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1"
          >
            Phí vệ sinh
          </p>
          <div class="flex items-baseline gap-1">
            <span class="text-3xl font-black text-main">{{
              formatPriceOnly(stats.cleaning)
            }}</span>
            <span class="text-xs font-bold text-dim">đ/phòng</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex gap-4">
        <el-select
          v-model="filters.type"
          placeholder="Tất cả loại"
          class="theme-select-custom"
          style="width: 160px"
        >
          <el-option label="Tất cả loại" value="all" />
          <el-option label="Hàng tháng" value="fixed" />
          <el-option label="Theo chỉ số" value="meter" />
        </el-select>
        <el-select
          v-model="filters.status"
          placeholder="Trạng thái"
          class="theme-select-custom"
          style="width: 160px"
        >
          <el-option label="Tất cả trạng thái" value="all" />
          <el-option label="Đang kinh doanh" value="active" />
          <el-option label="Ngừng kinh doanh" value="inactive" />
        </el-select>
      </div>
      <button
        class="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-105 hover:bg-blue-500 hover:shadow-lg active:scale-95"
        style="background-color: #3b82f6"
        @click="openAddModal"
      >
        <el-icon><Plus /></el-icon>
        Thêm dịch vụ
      </button>
    </div>

    <!-- Table Section -->
    <div
      class="rounded-2xl border border-main overflow-hidden shadow-2xl bg-table"
    >
      <div class="overflow-x-auto">
        <table class="w-full text-sm border-collapse">
          <thead class="bg-header">
            <tr class="border-b border-main">
              <th
                class="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-dim"
              >
                ID
              </th>
              <th
                class="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-dim"
              >
                Tên dịch vụ
              </th>
              <th
                class="px-6 py-5 text-center text-[11px] font-black uppercase tracking-widest text-dim"
              >
                Đơn giá
              </th>
              <th
                class="px-6 py-5 text-center text-[11px] font-black uppercase tracking-widest text-dim"
              >
                Đơn vị
              </th>
              <th
                class="px-6 py-5 text-center text-[11px] font-black uppercase tracking-widest text-dim"
              >
                Loại
              </th>
              <th
                class="px-6 py-5 text-center text-[11px] font-black uppercase tracking-widest text-dim"
              >
                Trạng thái
              </th>
              <th
                class="px-6 py-5 text-center text-[11px] font-black uppercase tracking-widest text-dim"
              >
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody v-if="!loading" class="bg-table">
            <tr
              v-for="(row, index) in paginatedServices"
              :key="row.id"
              class="table-row-hover transition-colors border-b last:border-0 border-main"
            >
              <td class="px-6 py-5">
                <span class="font-bold text-xs text-id"
                  >DV-{{ String(row.id).padStart(3, "0") }}</span
                >
              </td>
              <td class="px-6 py-5">
                <div class="flex items-center gap-4">
                  <div
                    class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    :style="getIconBg(row.icon)"
                  >
                    <el-icon
                      size="20"
                      :style="{ color: getIconColor(row.icon) }"
                    >
                      <component :is="getIconComponent(row.icon)" />
                    </el-icon>
                  </div>
                  <span class="text-main font-bold text-sm">{{
                    row.name
                  }}</span>
                </div>
              </td>
              <td class="px-6 py-5 text-center text-main font-bold">
                {{ formatPriceOnly(row.unit_price) }}đ
              </td>
              <td
                class="px-6 py-5 text-center text-dim font-medium uppercase text-[11px] tracking-widest"
              >
                {{ row.unit }}
              </td>
              <td class="px-6 py-5 text-center text-main font-medium">
                {{ row.type_label }}
              </td>
              <td class="px-6 py-5 text-center">
                <span
                  class="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                  :style="
                    row.is_active
                      ? 'background-color: rgba(16, 185, 129, 0.1); color: #10B981;'
                      : 'background-color: rgba(239, 68, 68, 0.1); color: #EF4444;'
                  "
                >
                  {{ row.is_active ? "ĐANG KINH DOANH" : "NGỪNG KINH DOANH" }}
                </span>
              </td>
              <td class="px-6 py-5 text-center">
                <div class="flex items-center justify-center gap-3">
                  <button
                    class="action-btn btn-edit"
                    title="Chỉnh sửa"
                    @click="handleEdit(row)"
                  >
                    <el-icon size="16"><Edit /></el-icon>
                  </button>
                  <button
                    class="action-btn btn-delete"
                    title="Xóa"
                    @click="handleDelete(row)"
                  >
                    <el-icon size="16"><Delete /></el-icon>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer Info -->
      <div
        class="px-6 py-4 flex items-center justify-between bg-header border-t border-main"
      >
        <span class="text-xs font-bold text-dim uppercase tracking-widest"
          >Tổng cộng
          <span class="text-main">{{ totalCount }}</span> dịch
          vụ</span
        >
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

    <!-- ===== ADD/EDIT SERVICE DIALOG ===== -->
    <el-dialog
      v-model="addDialogVisible"
      :title="isEditing ? 'Chỉnh sửa Dịch vụ' : 'Thiết lập Dịch vụ mới'"
      width="600px"
      class="theme-dialog-v3"
      append-to-body
    >
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="addFormRef"
        label-position="top"
        class="mt-2"
      >
        <div class="grid grid-cols-1 gap-4">
          <el-form-item label="Tên dịch vụ" prop="name" required>
            <el-input v-model="addForm.name" placeholder="Ví dụ: Tiền rác..." />
          </el-form-item>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="Đơn giá (VNĐ)" prop="unit_price" required>
            <el-input v-model.number="addForm.unit_price" placeholder="Giá...">
              <template #append>đ</template>
            </el-input>
          </el-form-item>
          <el-form-item label="Đơn vị tính" prop="unit" required>
            <el-input v-model="addForm.unit" placeholder="Phòng, kWh, m³..." />
          </el-form-item>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="Loại dịch vụ" prop="type" required>
            <el-select v-model="addForm.type" class="!w-full">
              <el-option label="Cố định (Hàng tháng)" value="fixed" />
              <el-option label="Theo chỉ số (Điện/Nước)" value="meter" />
            </el-select>
          </el-form-item>
          <el-form-item label="Trạng thái hoạt động" prop="is_active" required>
            <el-switch
              v-model="addForm.is_active"
              inline-prompt
              active-text="Đang kinh doanh"
              inactive-text="Ngừng kinh doanh"
              style="
                --el-switch-on-color: #10b981;
                --el-switch-off-color: #ef4444;
              "
            />
          </el-form-item>
        </div>
      </el-form>

      <template #footer>
        <div class="flex justify-end gap-3 px-4 pb-4 mt-4">
          <el-button
            @click="addDialogVisible = false"
            class="theme-btn-cancel-v3"
            >Hủy bỏ</el-button
          >
          <el-button
            type="primary"
            @click="submitAddForm"
            class="theme-btn-submit-v3"
          >
            {{ isEditing ? "Cập nhật dịch vụ" : "Lưu danh mục dịch vụ" }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import api from "../axios";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  Box,
  Lightning,
  Odometer,
  Connection,
  Brush,
  Plus,
  Edit,
  Delete,
  ArrowLeft,
  ArrowRight,
  Tools,
} from "@element-plus/icons-vue";

// ========== STATE ==========
const services = ref([]);
const loading = ref(false);
const filters = reactive({
  type: "all",
  status: "all",
});
const currentPage = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);

// ========== COMPUTED ==========
const filteredServices = computed(() => {
  return services.value.filter((s) => {
    const typeMatch = filters.type === "all" || s.type === filters.type;
    const statusMatch =
      filters.status === "all" ||
      (filters.status === "active" && s.is_active) ||
      (filters.status === "inactive" && !s.is_active);
    return typeMatch && statusMatch;
  });
});

const paginatedServices = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredServices.value.slice(start, start + pageSize.value);
});

import { watch } from 'vue';
watch(filteredServices, (newVal) => {
  totalCount.value = newVal.length;
}, { immediate: true });

const stats = computed(() => {
  const total = services.value.length;
  const active = services.value.filter((s) => s.is_active).length;
  const electricity =
    services.value.find((s) => s.name.toLowerCase().includes("điện"))
      ?.unit_price || 0;
  const water =
    services.value.find((s) => s.name.toLowerCase().includes("nước"))
      ?.unit_price || 0;
  const internet =
    services.value.find((s) => s.name.toLowerCase().includes("internet"))
      ?.unit_price || 0;
  const cleaning =
    services.value.find((s) => s.name.toLowerCase().includes("vệ sinh"))
      ?.unit_price || 0;

  return { total, active, electricity, water, internet, cleaning };
});

// ========== METHODS ==========
const formatPriceOnly = (price) => {
  return new Intl.NumberFormat("vi-VN").format(price);
};

const getIconComponent = (iconType) => {
  switch (iconType) {
    case "electricity":
      return Lightning;
    case "water":
      return Odometer;
    case "cleaning":
      return Brush;
    case "internet":
      return Connection;
    default:
      return Box;
  }
};

const getIconBg = (iconType) => {
  switch (iconType) {
    case "electricity":
      return "background-color: rgba(59, 130, 246, 0.1);";
    case "water":
      return "background-color: rgba(16, 185, 129, 0.1);";
    case "cleaning":
      return "background-color: rgba(245, 158, 11, 0.1);";
    case "internet":
      return "background-color: rgba(139, 92, 246, 0.1);";
    default:
      return "background-color: rgba(156, 163, 175, 0.1);";
  }
};

const getIconColor = (iconType) => {
  switch (iconType) {
    case "electricity":
      return "#3B82F6";
    case "water":
      return "#10B981";
    case "cleaning":
      return "#F59E0B";
    case "internet":
      return "#8B5CF6";
    default:
      return "#9CA3AF";
  }
};

const getServiceIcon = (name) => {
  const n = name.toLowerCase();
  if (n.includes("điện")) return "electricity";
  if (n.includes("nước")) return "water";
  if (n.includes("vệ sinh")) return "cleaning";
  if (n.includes("internet")) return "internet";
  return "default";
};

const fetchServices = async () => {
  loading.value = true;
  try {
    const response = await api.get("/services");
    console.log("Services API Response:", response);

    // Xử lý linh hoạt các trường hợp:
    // 1. response.data là mảng (khi interceptor trả về {status, message, data})
    // 2. response là mảng (nếu interceptor trả về thẳng data)
    // 3. response.data.data là mảng (nếu lồng thêm 1 lớp)
    let rawData = [];
    if (Array.isArray(response)) {
      rawData = response;
    } else if (response && Array.isArray(response.data)) {
      rawData = response.data;
    } else if (response && response.data && Array.isArray(response.data.data)) {
      rawData = response.data.data;
    }

    services.value = rawData.map((s) => ({
      ...s,
      icon: getServiceIcon(s.name),
      type_label: s.type === "fixed" ? "Hàng tháng" : "Theo chỉ số",
    }));
  } catch (error) {
    console.error("Fetch services error:", error);
    ElMessage.error("Không thể tải danh sách dịch vụ từ máy chủ");
  } finally {
    loading.value = false;
  }
};

// ========== ADD/EDIT MODAL ==========
const addDialogVisible = ref(false);
const isEditing = ref(false);
const currentId = ref(null);
const addFormRef = ref(null);
const addForm = ref({
  name: "",
  unit_price: null,
  unit: "",
  type: "fixed",
  is_active: true,
});

const addRules = {
  name: [
    { required: true, message: "Vui lòng nhập tên dịch vụ", trigger: "blur" },
  ],
  unit_price: [
    { required: true, message: "Vui lòng nhập đơn giá", trigger: "blur" },
  ],
  unit: [
    { required: true, message: "Vui lòng nhập đơn vị tính", trigger: "blur" },
  ],
  type: [
    {
      required: true,
      message: "Vui lòng chọn loại dịch vụ",
      trigger: "change",
    },
  ],
};

const openAddModal = () => {
  isEditing.value = false;
  currentId.value = null;
  addForm.value = {
    name: "",
    unit_price: null,
    unit: "",
    type: "fixed",
    is_active: true,
  };
  addDialogVisible.value = true;
};

const handleEdit = (row) => {
  isEditing.value = true;
  currentId.value = row.id;
  addForm.value = {
    name: row.name,
    unit_price: row.unit_price,
    unit: row.unit,
    type: row.type,
    is_active: !!row.is_active,
  };
  addDialogVisible.value = true;
};

const submitAddForm = async () => {
  const valid = await addFormRef.value.validate().catch(() => false);
  if (!valid) return;

  try {
    const payload = {
      name: addForm.value.name,
      unit_price: addForm.value.unit_price,
      unit: addForm.value.unit,
      type: addForm.value.type,
      is_active: addForm.value.is_active,
    };

    if (isEditing.value) {
      await api.put(`/services/${currentId.value}`, payload);
      ElMessage.success("Cập nhật dịch vụ thành công");
    } else {
      await api.post("/services", payload);
      ElMessage.success("Thêm dịch vụ thành công");
    }

    addDialogVisible.value = false;
    fetchServices();
  } catch (error) {
    console.error("Submit service error:", error);
    ElMessage.error(
      error.response?.data?.message || "Có lỗi xảy ra khi lưu dịch vụ",
    );
  }
};

const handleDelete = async (service) => {
  try {
    await ElMessageBox.confirm(
      `Bạn có chắc chắn muốn vô hiệu hóa dịch vụ "${service.name}" không?`,
      "Xác nhận vô hiệu hóa",
      {
        confirmButtonText: "Vô hiệu hóa",
        cancelButtonText: "Hủy bỏ",
        type: "warning",
        customClass: "theme-message-box",
      },
    );

    await api.delete(`/services/${service.id}`);
    ElMessage.success(`Đã vô hiệu hóa dịch vụ "${service.name}" thành công`);
    fetchServices();
  } catch (error) {
    if (error !== "cancel") {
      console.error("Delete service error:", error);
      ElMessage.error("Không thể vô hiệu hóa dịch vụ");
    }
  }
};

onMounted(() => {
  fetchServices();
});
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
  --text-id: #3b82f6;
}

html.dark {
  --bg-page: #111827;
  --bg-card: #1f2937;
  --bg-table: #111827;
  --bg-header: #1f2937;
  --bg-input: #1f2937;
  --text-main: #ffffff;
  --text-dim: #9ca3af;
  --border-main: #374151;
  --text-id: #6b7280;
}
</style>

<style scoped>
.services-page {
  background-color: var(--bg-page);
  color: var(--text-main);
  transition: all 0.3s ease;
}

.text-main {
  color: var(--text-main);
}
.text-dim {
  color: var(--text-dim);
}
.bg-card {
  background-color: var(--bg-card);
}
.bg-table {
  background-color: var(--bg-table);
}
.bg-header {
  background-color: var(--bg-header);
}
.text-id {
  color: var(--text-id);
}
.border-main {
  border-color: var(--border-main);
}

.font-inter {
  font-family: "Inter", sans-serif;
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

.btn-edit:hover {
  background-color: rgba(16, 185, 129, 0.15) !important;
  color: #10b981 !important;
}

.btn-delete:hover {
  background-color: rgba(239, 68, 68, 0.15) !important;
  color: #ef4444 !important;
}

.stat-card {
  transition: all 0.3s ease;
  backdrop-filter: blur(12px);
}

.card-blue {
  background-color: rgba(59, 130, 246, 0.05) !important;
  border-color: rgba(59, 130, 246, 0.1) !important;
}
.card-indigo {
  background-color: rgba(99, 102, 241, 0.05) !important;
  border-color: rgba(99, 102, 241, 0.1) !important;
}
.card-emerald {
  background-color: rgba(16, 185, 129, 0.05) !important;
  border-color: rgba(16, 185, 129, 0.1) !important;
}
.card-purple {
  background-color: rgba(139, 92, 246, 0.05) !important;
  border-color: rgba(139, 92, 246, 0.1) !important;
}
.card-amber {
  background-color: rgba(245, 158, 11, 0.05) !important;
  border-color: rgba(245, 158, 11, 0.1) !important;
}

html.dark .card-blue {
  background-color: rgba(59, 130, 246, 0.1) !important;
  border-color: rgba(59, 130, 246, 0.2) !important;
}
html.dark .card-indigo {
  background-color: rgba(99, 102, 241, 0.1) !important;
  border-color: rgba(99, 102, 241, 0.2) !important;
}
html.dark .card-emerald {
  background-color: rgba(16, 185, 129, 0.1) !important;
  border-color: rgba(16, 185, 129, 0.2) !important;
}
html.dark .card-purple {
  background-color: rgba(139, 92, 246, 0.1) !important;
  border-color: rgba(139, 92, 246, 0.2) !important;
}
html.dark .card-amber {
  background-color: rgba(245, 158, 11, 0.1) !important;
  border-color: rgba(245, 158, 11, 0.2) !important;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.2);
}

.card-blue:hover {
  background-color: rgba(59, 130, 246, 0.15) !important;
}
.card-indigo:hover {
  background-color: rgba(99, 102, 241, 0.15) !important;
}
.card-emerald:hover {
  background-color: rgba(16, 185, 129, 0.15) !important;
}
.card-purple:hover {
  background-color: rgba(139, 92, 246, 0.15) !important;
}
.card-amber:hover {
  background-color: rgba(245, 158, 11, 0.15) !important;
}

/* Custom Select Theme */
.theme-select-custom :deep(.el-input__wrapper) {
  background-color: var(--bg-input) !important;
  border: 1px solid var(--border-main) !important;
  box-shadow: none !important;
  border-radius: 12px;
  height: 44px;
}
.theme-select-custom :deep(.el-input__inner) {
  color: var(--text-main) !important;
  font-weight: 600;
}
.theme-select-custom :deep(.el-select__placeholder) {
  color: var(--text-dim) !important;
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

:deep(.theme-dialog-v3 .el-input__wrapper) {
  background-color: var(--bg-page) !important;
  box-shadow: none !important;
  border: 1px solid var(--border-main) !important;
  border-radius: 12px;
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

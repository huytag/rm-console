<template>
  <div class="tenants-page min-h-full p-6 font-inter">
    <!-- Header Section -->
    <div class="flex items-start justify-between mb-8">
      <div>
        <h1 class="text-3xl font-black text-main mb-2">
          Danh sách Người thuê
        </h1>
        <p class="text-sm text-dim font-medium">
          Quản lý và theo dõi thông tin người thuê phòng.
        </p>
      </div>
      <button
        class="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-105 active:scale-95"
        style="background-color: #3b82f6"
      >
        <el-icon><Plus /></el-icon>
        Thêm người thuê
      </button>
    </div>

    <!-- Filter & Search Bar -->
    <div class="flex items-center justify-between mb-6 gap-4">
      <div class="flex items-center w-full max-w-lg gap-2">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Tìm kiếm theo tên, email hoặc CCCD..."
          class="flex-grow px-4 py-2.5 rounded-xl text-sm transition-all focus:ring-1 focus:ring-blue-500/50 outline-none bg-input border-main text-main"
          style="width: 80%; border-width: 1px;"
        />
        <button
          class="w-11 h-11 rounded-xl flex items-center justify-center text-white transition-all hover:opacity-90 active:scale-95 shrink-0"
          style="background-color: #3b82f6; width: 12%"
        >
          <el-icon size="18"><Search /></el-icon>
        </button>
      </div>

      <div class="flex items-center gap-3">
        <el-select
          v-model="statusFilter"
          placeholder="Trạng thái: Tất cả"
          class="theme-select-custom"
          style="width: 180px"
        >
          <el-option label="Tất cả trạng thái" value="all" />
          <el-option label="Hoạt động" value="active" />
          <el-option label="Không hoạt động" value="inactive" />
        </el-select>
      </div>
    </div>

    <!-- Data Table -->
    <div class="rounded-2xl border border-main overflow-hidden shadow-2xl bg-table">
      <div class="overflow-x-auto">
        <table class="w-full text-sm border-collapse">
          <thead class="bg-header">
            <tr class="border-b border-main">
              <th class="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-dim">ID</th>
              <th class="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-dim">Tên</th>
              <th class="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-dim">Email</th>
              <th class="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-dim">Số điện thoại</th>
              <th class="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-dim">CMND/CCCD</th>
              <th class="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-dim">Trạng thái</th>
              <th class="px-6 py-5 text-center text-[11px] font-black uppercase tracking-widest text-dim">Thao tác</th>
            </tr>
          </thead>
          <tbody v-if="!loading" class="bg-table">
            <tr
              v-for="(row, index) in paginatedTenants"
              :key="row.id"
              class="table-row-hover transition-colors border-b last:border-0 border-main"
            >
              <!-- ID -->
              <td class="px-6 py-5">
                <span class="font-bold text-xs text-id">#T{{ String(row.id).padStart(3, "0") }}</span>
              </td>

              <!-- Tên -->
              <td class="px-6 py-5">
                <div class="flex items-center gap-3">
                  <div
                    class="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black text-white"
                    :style="getAvatarStyle(row.name)"
                  >
                    {{ getInitials(row.name) }}
                  </div>
                  <span class="text-main font-bold text-sm">{{ row.name }}</span>
                </div>
              </td>

              <!-- Email -->
              <td class="px-6 py-5 text-dim font-medium">{{ row.email }}</td>

              <!-- Phone -->
              <td class="px-6 py-5 text-dim font-medium tracking-wide">{{ formatPhone(row.phone) }}</td>

              <!-- ID Card -->
              <td class="px-6 py-5 text-dim font-medium">{{ row.id_card || "012345678901" }}</td>

              <!-- Status -->
              <td class="px-6 py-5">
                <span
                  class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                  :style="row.status === 'active'
                      ? 'background-color: rgba(16, 185, 129, 0.1); color: #10B981;'
                      : 'background-color: rgba(239, 68, 68, 0.1); color: #EF4444;'"
                >
                  {{ row.status === "active" ? "Hoạt động" : "Không hoạt động" }}
                </span>
              </td>

              <!-- Actions -->
              <td class="px-6 py-5 text-center">
                <div class="flex items-center justify-center gap-3">
                  <button
                    class="text-dim hover:text-blue-500 transition-colors"
                    title="Xem chi tiết"
                    @click="openDetails(row)"
                  >
                    <el-icon size="16"><View /></el-icon>
                  </button>
                  <button class="text-dim hover:text-emerald-400 transition-colors" title="Chỉnh sửa">
                    <el-icon size="16"><Edit /></el-icon>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Footer -->
      <div class="px-6 py-4 flex items-center justify-between bg-header border-t border-main">
        <span class="text-xs font-bold text-dim uppercase tracking-widest"
          >Tổng cộng <span class="text-main">{{ filteredTenants.length }}</span> người thuê</span
        >
        <div class="flex items-center gap-2">
          <button
            class="w-8 h-8 rounded-lg flex items-center justify-center text-dim hover:text-main"
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            <el-icon><ArrowLeft /></el-icon>
          </button>
          <button
            v-for="page in totalPages"
            :key="page"
            class="w-8 h-8 rounded-lg text-xs font-black transition-all"
            :class="page === currentPage ? 'bg-blue-600 text-white' : 'text-dim hover:text-main'"
            @click="currentPage = page"
          >
            {{ page }}
          </button>
          <button
            class="w-8 h-8 rounded-lg flex items-center justify-center text-dim hover:text-main"
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          >
            <el-icon><ArrowRight /></el-icon>
          </button>
        </div>
      </div>
    </div>

    <!-- Details Modal -->
    <el-dialog
      v-model="detailsVisible"
      title="Hồ sơ Người thuê"
      width="700px"
      class="tenant-details-dialog theme-dialog-custom"
      :align-center="true"
    >
      <div v-if="selectedTenant" class="p-4">
        <div class="flex items-center gap-6 mb-8 pb-8 border-b border-main">
          <div
            class="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-blue-500/10"
            :style="getAvatarStyle(selectedTenant.name)"
          >
            {{ getInitials(selectedTenant.name) }}
          </div>
          <div>
            <h2 class="text-2xl font-black text-main mb-1">{{ selectedTenant.name }}</h2>
            <p class="text-sm text-dim font-medium uppercase tracking-widest">#{{ String(selectedTenant.id).padStart(4, '0') }}</p>
          </div>
          <div class="ml-auto">
            <span
              class="px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider"
              :style="selectedTenant.status === 'active'
                  ? 'background-color: rgba(16, 185, 129, 0.1); color: #10B981;'
                  : 'background-color: rgba(239, 68, 68, 0.1); color: #EF4444;'"
            >
              {{ selectedTenant.status === 'active' ? 'Hoạt động' : 'Tạm ngưng' }}
            </span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-8">
          <!-- Contact Info -->
          <div class="space-y-6">
            <div class="detail-item">
              <label>Số điện thoại</label>
              <p class="text-main font-bold text-lg tracking-wide">{{ formatPhone(selectedTenant.phone) }}</p>
            </div>
            <div class="detail-item">
              <label>Địa chỉ Email</label>
              <p class="text-main font-bold">{{ selectedTenant.email }}</p>
            </div>
            <div class="detail-item">
              <label>CMND / CCCD</label>
              <p class="text-main font-bold">{{ selectedTenant.id_card || '012345678901' }}</p>
            </div>
            <div class="detail-item">
              <label>Địa chỉ thường trú</label>
              <p class="text-main font-bold">{{ selectedTenant.address || 'Quận 1, TP. Hồ Chí Minh' }}</p>
            </div>
          </div>

          <!-- Room & Contract -->
          <div class="space-y-6">
            <div class="detail-item">
              <label>Phòng & Tòa nhà</label>
              <div class="bg-section p-3 rounded-xl border border-main">
                <p class="text-blue-500 font-black text-lg">
                  {{ selectedTenant.room_number || 'P.102' }}
                  <span class="text-dim font-medium text-xs ml-1">- {{ selectedTenant.building_name || 'Diamond Riverside' }}</span>
                </p>
              </div>
            </div>
            <div class="detail-item">
              <label>Mã Hợp đồng hiện tại</label>
              <p class="text-main font-black">#HĐ-{{ String(selectedTenant.contract_id || 982).padStart(4, '0') }}</p>
            </div>
            <div class="detail-item">
              <label>Ngày bắt đầu thuê</label>
              <p class="text-dim font-medium">{{ selectedTenant.start_date || '01/01/2024' }}</p>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-3 p-4">
          <el-button @click="detailsVisible = false" class="theme-btn-secondary">Đóng hồ sơ</el-button>
          <el-button type="primary" class="theme-btn-primary">
            <el-icon class="mr-2"><Edit /></el-icon> Chỉnh sửa thông tin
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import api from "../axios";
import { ElMessage } from "element-plus";
import {
  Plus,
  Search,
  Edit,
  View,
  ArrowLeft,
  ArrowRight,
} from "@element-plus/icons-vue";

// ========== MOCK DATA ==========
const mockTenants = [
  {
    id: 1,
    name: "Nguyễn Văn An",
    email: "an.nguyen@example.com",
    phone: "0901234567",
    id_card: "012345678901",
    status: "active",
    address: "123 Chu Văn An, P.12, Q. Bình Thạnh, TP.HCM"
  },
  {
    id: 2,
    name: "Trần Hoàng Huy",
    email: "huy.tran@gmail.com",
    phone: "0987654321",
    id_card: "092123456789",
    status: "active",
    address: "45/2 Kinh Dương Vương, P.13, Q.6, TP.HCM"
  },
  {
    id: 3,
    name: "Lê Thị Mai",
    email: "mai.le@outlook.com",
    phone: "0912333444",
    id_card: "083344556677",
    status: "active",
    address: "Lô C, Chung cư Hùng Vương, Q.5, TP.HCM"
  },
  {
    id: 4,
    name: "Phạm Văn Quân",
    email: "quan.pham@company.vn",
    phone: "0355667788",
    id_card: "044556677889",
    status: "inactive",
  },
  {
    id: 5,
    name: "Võ Minh Hoàng",
    email: "hoang.vo@dev.com",
    phone: "0777888999",
    id_card: "012987654321",
    status: "active",
  },
  {
    id: 6,
    name: "Đỗ Gia Bảo",
    email: "bao.do@test.vn",
    phone: "0933111222",
    id_card: "066778899001",
    status: "inactive",
  },
];

const tenants = ref(mockTenants);
const loading = ref(false);
const searchQuery = ref("");
const statusFilter = ref("all");
const currentPage = ref(1);
const totalCount = ref(42);
const detailsVisible = ref(false);
const selectedTenant = ref(null);

// ========== COMPUTED ==========
const filteredTenants = computed(() => {
  return tenants.value.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      t.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      t.id_card.includes(searchQuery.value);
    const matchesStatus =
      statusFilter.value === "all" || t.status === statusFilter.value;
    return matchesSearch && matchesStatus;
  });
});

const paginatedTenants = computed(() => {
  return filteredTenants.value.slice(0, 10);
});

const totalPages = computed(() => {
  return Math.ceil(filteredTenants.value.length / 10) || 1;
});

// ========== METHODS ==========
const getInitials = (name) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(-2);
};

const getAvatarStyle = (name) => {
  const colors = [
    "background-color: rgba(59, 130, 246, 0.15); color: #3B82F6;",
    "background-color: rgba(16, 185, 129, 0.15); color: #10B981;",
    "background-color: rgba(139, 92, 246, 0.15); color: #8B5CF6;",
    "background-color: rgba(236, 72, 153, 0.15); color: #EC4899;",
  ];
  const charCode = name.charCodeAt(0);
  return colors[charCode % colors.length];
};

const formatPhone = (phone) => {
  if (!phone) return "";
  return phone.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
};

const openDetails = (row) => {
  selectedTenant.value = row;
  detailsVisible.value = true;
};

const fetchTenants = async () => {
  loading.value = true;
  try {
    const response = await api.get("/users", { params: { role: "tenant" } });
    const data = response.data || response;
    if (data && Array.isArray(data) && data.length > 0) {
      tenants.value = data;
      totalCount.value = response.total || data.length;
    }
  } catch (error) {
    // Fail silently to keep mock data
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchTenants();
});
</script>

<style>
:root {
  --bg-page: #f8fafc;
  --bg-table: #ffffff;
  --bg-header: #f8fafc;
  --bg-section: #f1f5f9;
  --bg-input: #ffffff;
  --text-main: #1e293b;
  --text-dim: #64748b;
  --border-main: #e2e8f0;
  --btn-secondary-bg: #f1f5f9;
  --btn-secondary-text: #475569;
  --text-id: #3B82F6;
}

html.dark {
  --bg-page: #111827;
  --bg-table: #111827;
  --bg-header: #1f2937;
  --bg-section: rgba(31, 41, 55, 0.5);
  --bg-input: #1f2937;
  --text-main: #ffffff;
  --text-dim: #9ca3af;
  --border-main: #374151;
  --btn-secondary-bg: #374151;
  --btn-secondary-text: #d1d5db;
  --text-id: #6b7280;
}
</style>

<style scoped>
.tenants-page {
  background-color: var(--bg-page);
  color: var(--text-main);
  transition: all 0.3s ease;
}

.text-main { color: var(--text-main); }
.text-dim { color: var(--text-dim); }
.bg-table { background-color: var(--bg-table); }
.bg-header { background-color: var(--bg-header); }
.bg-section { background-color: var(--bg-section); }
.bg-input { background-color: var(--bg-input); }
.text-id { color: var(--text-id); }
.border-main { border-color: var(--border-main); }

.font-inter {
  font-family: "Inter", sans-serif;
}

.table-row-hover:hover {
  background-color: var(--bg-header);
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
  font-size: 14px;
}
.theme-select-custom :deep(.el-select__placeholder) {
  color: var(--text-dim) !important;
}

/* Dialog Theme */
:deep(.theme-dialog-custom .el-dialog) {
  background-color: var(--bg-table) !important;
  border-radius: 24px;
  border: 1px solid var(--border-main);
}
:deep(.theme-dialog-custom .el-dialog__title) {
  color: var(--text-main) !important;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.detail-item label {
  display: block;
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #6b7280;
  margin-bottom: 4px;
}

.theme-btn-secondary {
  background-color: var(--btn-secondary-bg) !important;
  border: none !important;
  color: var(--btn-secondary-text) !important;
  border-radius: 12px !important;
  font-weight: bold !important;
}

.theme-btn-primary {
  background-color: #3b82f6 !important;
  border: none !important;
  color: #fff !important;
  border-radius: 12px !important;
  font-weight: bold !important;
}
</style>

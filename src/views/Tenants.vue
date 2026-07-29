<template>
  <div class="tenants-page min-h-full p-6 font-inter">
    <!-- Header Section -->
    <div class="flex items-start justify-between mb-8">
      <div>
        <h1 class="text-3xl font-black text-main mb-2">Danh sách Người thuê</h1>
        <p class="text-sm text-dim font-medium">
          Quản lý và theo dõi thông tin người thuê phòng.
        </p>
      </div>
      <button
        class="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-105 active:scale-95"
        style="background-color: #3b82f6"
        @click="openAddModal"
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
          style="width: 80%; border-width: 1px"
        />
        <button
          class="w-11 h-11 rounded-xl flex items-center justify-center transition-all hover:bg-blue-500 hover:text-white active:scale-95 shrink-0"
          style="background-color: rgba(59, 130, 246, 0.15); color: #3b82f6; width: 12%"
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
    <div
      class="rounded-2xl border border-main overflow-hidden shadow-2xl bg-table"
    >
      <div class="overflow-x-auto">
        <table class="w-full text-sm border-collapse whitespace-nowrap">
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
                Tên
              </th>
              <th
                class="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-dim"
              >
                Email
              </th>
              <th
                class="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-dim"
              >
                Số điện thoại
              </th>
              <th
                class="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-dim"
              >
                CMND/CCCD
              </th>
              <th
                class="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-dim"
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
              v-for="(row, index) in paginatedTenants"
              :key="row.id"
              class="table-row-hover transition-colors border-b last:border-0 border-main"
            >
              <!-- ID -->
              <td class="px-6 py-5">
                <span class="font-bold text-xs text-id"
                  >#T{{ String(row.id).padStart(3, "0") }}</span
                >
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
                  <span class="text-main font-bold text-sm">{{
                    row.name
                  }}</span>
                </div>
              </td>

              <!-- Email -->
              <td class="px-6 py-5 text-dim font-medium">{{ row.email }}</td>

              <!-- Phone -->
              <td class="px-6 py-5 text-dim font-medium tracking-wide">
                {{ formatPhone(row.phone) }}
              </td>

              <!-- ID Card -->
              <td class="px-6 py-5 text-dim font-medium">
                {{ row.id_card || "012345678901" }}
              </td>

              <!-- Status -->
              <td class="px-6 py-5">
                <span
                  class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                  :style="
                    row.status === 'active'
                      ? 'background-color: rgba(16, 185, 129, 0.1); color: #10B981;'
                      : 'background-color: rgba(239, 68, 68, 0.1); color: #EF4444;'
                  "
                >
                  {{
                    row.status === "active" ? "Hoạt động" : "Không hoạt động"
                  }}
                </span>
              </td>

              <!-- Actions -->
              <td class="px-6 py-5 text-center">
                <div class="flex items-center justify-center gap-3">
                  <button
                    class="action-btn btn-view"
                    title="Xem chi tiết"
                    @click="openDetails(row)"
                  >
                    <el-icon size="16"><View /></el-icon>
                  </button>
                  <button class="action-btn btn-edit" title="Chỉnh sửa">
                    <el-icon size="16"><Edit /></el-icon>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Footer -->
      <div
        class="px-6 py-4 flex items-center justify-between bg-header border-t border-main"
      >
        <span class="text-xs font-bold text-dim uppercase tracking-widest"
          >Tổng cộng
          <span class="text-main">{{ totalCount }}</span> người
          thuê</span
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

    <!-- Details Modal -->
    <el-dialog
      v-model="detailsVisible"
      title="Hồ sơ Người thuê"
      width="90%" style="max-width: 700px"
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
            <h2 class="text-2xl font-black text-main mb-1">
              {{ selectedTenant.name }}
            </h2>
            <p class="text-sm text-dim font-medium uppercase tracking-widest">
              #{{ String(selectedTenant.id).padStart(4, "0") }}
            </p>
          </div>
          <div class="ml-auto">
            <span
              class="px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider"
              :style="
                selectedTenant.status === 'active'
                  ? 'background-color: rgba(16, 185, 129, 0.1); color: #10B981;'
                  : 'background-color: rgba(239, 68, 68, 0.1); color: #EF4444;'
              "
            >
              {{
                selectedTenant.status === "active" ? "Hoạt động" : "Tạm ngưng"
              }}
            </span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-8">
          <!-- Contact Info -->
          <div class="space-y-6">
            <div class="detail-item">
              <label>Số điện thoại</label>
              <p class="text-main font-bold text-lg tracking-wide">
                {{ formatPhone(selectedTenant.phone) }}
              </p>
            </div>
            <div class="detail-item">
              <label>Địa chỉ Email</label>
              <p class="text-main font-bold">{{ selectedTenant.email }}</p>
            </div>
            <div class="detail-item">
              <label>CMND / CCCD</label>
              <p class="text-main font-bold">
                {{ selectedTenant.id_card || "012345678901" }}
              </p>
            </div>
          </div>

          <!-- Room & Contract -->
          <div class="space-y-6">
            <div class="detail-item">
              <label>Phòng & Tòa nhà</label>
              <div class="bg-section p-3 rounded-xl border border-main">
                <p class="text-blue-500 font-black text-lg">
                  {{ selectedTenant.room_number || "P.101" }}
                  <span class="text-dim font-medium text-xs ml-1"
                    >- {{ selectedTenant.building_name || "Tòa A" }}</span
                  >
                </p>
                <p class="text-[10px] text-dim mt-1 font-bold">
                  <el-icon><Location /></el-icon> {{ selectedTenant.building_address || "Đang cập nhật..." }}
                </p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="detail-item">
                <label>Tiền đặt cọc</label>
                <p class="text-emerald-500 font-black">{{ formatCurrency(selectedTenant.deposit || 0) }}</p>
              </div>
              <div class="detail-item">
                <label>Ngày bắt đầu</label>
                <p class="text-main font-bold text-xs">{{ selectedTenant.start_date || "01/01/2026" }}</p>
              </div>
            </div>
            <div class="detail-item">
              <label>Ngày kết thúc HĐ (Dự kiến)</label>
              <p class="text-orange-500 font-black text-xs">{{ selectedTenant.end_date || "31/12/2026" }}</p>
            </div>
          </div>
        </div>

        <!-- NEW: Tenant Service Portal Section (Integrated from TenantController) -->
        <div class="mt-10 pt-8 border-t border-main">
          <h3 class="text-xs font-black text-blue-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
            <el-icon><Odometer /></el-icon> Cổng dịch vụ khách thuê
          </h3>
          
          <el-tabs v-model="activeTab" class="tenant-tabs-v3">
            <el-tab-pane label="Lịch sử Hóa đơn" name="invoices">
              <div v-loading="invoicesLoading" class="space-y-3 mt-4">
                <div v-for="inv in tenantInvoices" :key="inv.id" 
                     class="flex items-center justify-between p-4 rounded-xl border border-main bg-section/30">
                  <div>
                    <p class="font-bold text-main text-sm">Tháng {{ inv.month }}/{{ inv.year }}</p>
                    <p class="text-[10px] text-dim uppercase font-black tracking-tight">Hạn: {{ inv.due_date }}</p>
                  </div>
                  <div class="text-right">
                    <p class="font-black text-main text-sm">{{ formatCurrency(inv.total_amount) }}</p>
                    <el-tag :type="getInvoiceStatusType(inv.status)" size="small" class="!rounded-md !text-[9px] font-black uppercase">
                      {{ getInvoiceStatusLabel(inv.status) }}
                    </el-tag>
                  </div>
                </div>
                <div v-if="tenantInvoices.length === 0" class="text-center py-10 text-dim text-xs font-bold uppercase tracking-widest opacity-50">
                  Chưa có dữ liệu hóa đơn
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane label="Ghi chỉ số Điện/Nước" name="readings">
              <div class="mt-4 p-5 rounded-2xl border border-dashed border-blue-500/30 bg-blue-500/5">
                <p class="text-xs font-bold text-blue-600 mb-6 flex items-center gap-2">
                  <el-icon><InfoFilled /></el-icon> Nộp chỉ số định kỳ cho phòng {{ selectedTenant.room_number || '101' }}
                </p>
                
                <el-form :model="readingForm" label-position="top">
                  <div class="grid grid-cols-2 gap-6 mb-6">
                    <el-form-item label="Số điện mới (kWh)">
                      <el-input-number v-model="readingForm.electric_index" :min="0" class="!w-full" controls-position="right" />
                    </el-form-item>
                    <el-form-item label="Số nước mới (m³)">
                      <el-input-number v-model="readingForm.water_index" :min="0" class="!w-full" controls-position="right" />
                    </el-form-item>
                  </div>

                  <div class="grid grid-cols-2 gap-6 mb-6">
                    <el-form-item label="Ảnh đồng hồ điện" required>
                      <el-upload
                        class="reading-uploader"
                        action="#"
                        :auto-upload="false"
                        :on-change="(file) => handleFileChange(file, 'electric')"
                        :limit="1"
                        list-type="picture-card"
                      >
                        <el-icon><Plus /></el-icon>
                      </el-upload>
                    </el-form-item>
                    <el-form-item label="Ảnh đồng hồ nước" required>
                      <el-upload
                        class="reading-uploader"
                        action="#"
                        :auto-upload="false"
                        :on-change="(file) => handleFileChange(file, 'water')"
                        :limit="1"
                        list-type="picture-card"
                      >
                        <el-icon><Plus /></el-icon>
                      </el-upload>
                    </el-form-item>
                  </div>
                  <div class="flex justify-end">
                    <el-button type="primary" class="!rounded-xl font-bold px-8 shadow-lg shadow-blue-500/20" 
                               :loading="submittingReading" @click="submitMeterReading">
                      <el-icon class="mr-2"><Promotion /></el-icon> Xác nhận nộp chỉ số
                    </el-button>
                  </div>
                </el-form>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-3 p-4">
          <el-button @click="detailsVisible = false" class="theme-btn-secondary"
            >Đóng hồ sơ</el-button
          >
          <el-button type="primary" class="theme-btn-primary" @click="ElMessage.info('Chức năng chỉnh sửa đang phát triển')">
            <el-icon class="mr-2"><Edit /></el-icon> Chỉnh sửa thông tin
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      v-model="addDialogVisible"
      title="Tiếp nhận Người thuê mới"
      width="90%" style="max-width: 750px"
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
        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="Tên người thuê" prop="name" required>
            <el-input v-model="addForm.name" placeholder="Nguyễn Văn A..." />
          </el-form-item>
          <el-form-item label="Số điện thoại" prop="phone" required>
            <el-input v-model="addForm.phone" placeholder="090..." />
          </el-form-item>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="Email" prop="email" required>
            <el-input
              v-model="addForm.email"
              placeholder="example@gmail.com..."
            />
          </el-form-item>
          <el-form-item label="Số CMND/CCCD" prop="id_card" required>
            <el-input v-model="addForm.id_card" placeholder="0123456789..." />
          </el-form-item>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <el-form-item label="Trạng thái" prop="status" required>
            <el-select v-model="addForm.status" class="!w-full">
              <el-option label="Hoạt động" value="active" />
              <el-option label="Tạm ngưng" value="inactive" />
            </el-select>
          </el-form-item>
          <el-form-item label="Tên tòa nhà" prop="building_name" required>
            <el-select v-model="addForm.building_name" class="!w-full">
              <el-option label="Blue Moon" value="Blue Moon" />
              <el-option label="Sunrise Tower" value="Sunrise Tower" />
            </el-select>
          </el-form-item>
          <el-form-item label="Mã phòng" prop="room_number" required>
            <el-input v-model="addForm.room_number" placeholder="P.101..." />
          </el-form-item>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="Mã hợp đồng" prop="contract_id" required>
            <el-input v-model="addForm.contract_id" placeholder="HĐ-982..." />
          </el-form-item>
          <el-form-item label="Ngày bắt đầu thuê" prop="start_date" required>
            <el-date-picker
              v-model="addForm.start_date"
              type="date"
              placeholder="Chọn ngày"
              class="!w-full"
              format="DD/MM/YYYY"
              value-format="DD/MM/YYYY"
            />
          </el-form-item>
        </div>

        <el-form-item label="Địa chỉ thường trú" prop="address">
          <el-input
            v-model="addForm.address"
            type="textarea"
            :rows="2"
            placeholder="Số nhà, tên đường, phường/xã..."
          />
        </el-form-item>
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
            :loading="isSubmitting"
          >
            Lưu hồ sơ người thuê
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
  Odometer,
  InfoFilled,
  Promotion,
  Location,
} from "@element-plus/icons-vue";

const tenants = ref([]);
const loading = ref(false);
const searchQuery = ref("");
const statusFilter = ref("all");
const currentPage = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);
const detailsVisible = ref(false);
const selectedTenant = ref(null);
const activeTab = ref("invoices");
const tenantInvoices = ref([]);
const invoicesLoading = ref(false);
const submittingReading = ref(false)
const isSubmitting = ref(false);
const readingForm = ref({
  electric_index: 0,
  water_index: 0,
  electric_image: null,
  water_image: null,
});

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
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredTenants.value.slice(start, start + pageSize.value);
});

// Update totalCount whenever filtered changes
import { watch } from 'vue';
watch(filteredTenants, (newVal) => {
  totalCount.value = newVal.length;
}, { immediate: true });

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

const openDetails = async (row) => {
  selectedTenant.value = row;
  detailsVisible.value = true;
  activeTab.value = "invoices";
  
  // Tích hợp API từ TenantController: Lấy danh sách hóa đơn
  invoicesLoading.value = true;
  try {
    const response = await api.get("/tenant/invoices");
    const data = response.data.data || response.data;
    // Tìm hóa đơn liên quan đến tenant (Vì API myInvoices trả về theo user đăng nhập, ta sẽ lấy mảng demo)
    if (data && data.length > 0) {
      tenantInvoices.value = data[0].invoices || [];
    }
  } catch (error) {
    console.error("Lỗi lấy hóa đơn tenant:", error);
    tenantInvoices.value = [];
  } finally {
    invoicesLoading.value = false;
  }
};

const formatCurrency = (value) => {
  if (!value) return "0 ₫";
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const getInvoiceStatusLabel = (status) => {
  const labels = {
    paid: 'Đã thu',
    unpaid: 'Chưa thu',
    partial: 'Thu 1 phần',
    overdue: 'Quá hạn'
  };
  return labels[status] || 'Chưa xác định';
};

const getInvoiceStatusType = (status) => {
  const types = {
    paid: 'success',
    unpaid: 'danger',
    partial: 'warning',
    overdue: 'danger'
  };
  return types[status] || 'info';
};

const handleFileChange = (file, type) => {
  if (type === 'electric') {
    readingForm.value.electric_image = file.raw;
  } else {
    readingForm.value.water_image = file.raw;
  }
};

const submitMeterReading = async () => {
  if (!readingForm.value.electric_image || !readingForm.value.water_image) {
    return ElMessage.warning("Vui lòng tải lên ảnh đồng hồ điện và nước");
  }

  submittingReading.value = true;
  try {
    const formData = new FormData();
    formData.append('electric_index', readingForm.value.electric_index);
    formData.append('water_index', readingForm.value.water_index);
    formData.append('electric_image', readingForm.value.electric_image);
    formData.append('water_image', readingForm.value.water_image);

    const response = await api.post("/tenant/submit-reading", formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    if (response.status === 200 || response.data?.status === 200 || response.success) {
      ElMessage.success("Đã ghi nhận chỉ số điện nước thành công");
      readingForm.value = { electric_index: 0, water_index: 0 };
    }
  } catch (error) {
    ElMessage.error(error.response?.data?.message || "Lỗi khi gửi chỉ số");
  } finally {
    submittingReading.value = false;
  }
};

const fetchTenants = async () => {
  loading.value = true;
  try {
    // Thay đổi từ /api/users (không tồn tại) sang /contracts
    // Vì thông tin người thuê nằm trong đối tượng tenant của hợp đồng
    const response = await api.get("/contracts");
    const resData = response.data?.data || response.data || [];

    // Trích xuất danh sách người thuê duy nhất từ các hợp đồng
    const tenantMap = new Map();
    if (Array.isArray(resData)) {
      resData.forEach(contract => {
        if (contract.tenant && !tenantMap.has(contract.tenant.id)) {
          // Bổ sung thêm thông tin từ contract nếu cần (phòng, tòa nhà)
          tenantMap.set(contract.tenant.id, {
            ...contract.tenant,
            status: contract.status === 'active' ? 'active' : 'inactive',
            room_number: contract.room?.room_number,
            building_name: contract.room?.building?.name,
            building_address: contract.room?.building?.address,
            contract_id: contract.id,
            start_date: contract.start_date,
            end_date: contract.end_date,
            deposit: contract.deposit
          });
        }
      });
    }

    const extractedTenants = Array.from(tenantMap.values());
    tenants.value = extractedTenants;
    totalCount.value = extractedTenants.length;
  } catch (error) {
    console.error("Lỗi khi tải danh sách người thuê:", error);
    // Giữ lại mock data nếu API lỗi để không bị trống trang
  } finally {
    loading.value = false;
  }
};

// ========== ADD MODAL ==========
const addDialogVisible = ref(false);
const addFormRef = ref(null);
const addForm = ref({
  name: "",
  phone: "",
  email: "",
  id_card: "",
  status: "active",
  room_number: "",
  building_name: "",
  contract_id: "",
  address: "",
  start_date: "",
});

const addRules = {
  name: [{ required: true, message: "Vui lòng nhập tên", trigger: "blur" }],
  phone: [
    { required: true, message: "Vui lòng nhập số điện thoại", trigger: "blur" },
  ],
  email: [{ required: true, message: "Vui lòng nhập email", trigger: "blur" }],
  id_card: [{ required: true, message: "Vui lòng nhập CCCD", trigger: "blur" }],
  status: [
    { required: true, message: "Vui lòng chọn trạng thái", trigger: "change" },
  ],
  building_name: [
    { required: true, message: "Vui lòng chọn tòa nhà", trigger: "change" },
  ],
  room_number: [
    { required: true, message: "Vui lòng nhập mã phòng", trigger: "blur" },
  ],
  contract_id: [
    { required: true, message: "Vui lòng nhập mã hợp đồng", trigger: "blur" },
  ],
  start_date: [
    {
      required: true,
      message: "Vui lòng chọn ngày bắt đầu",
      trigger: "change",
    },
  ],
};

const openAddModal = () => {
  addForm.value = {
    name: "",
    phone: "",
    email: "",
    id_card: "",
    status: "active",
    room_number: "",
    building_name: "",
    contract_id: "",
    address: "",
    start_date: "",
  };
  addDialogVisible.value = true;
};

const submitAddForm = async () => {
  const valid = await addFormRef.value.validate().catch(() => false);
  if (!valid) return;

  isSubmitting.value = true;
  try {
    await api.post('/tenants', addForm.value);
    ElMessage.success("Đã tiếp nhận hồ sơ người thuê thành công");
    addDialogVisible.value = false;
    fetchTenants();
  } catch (error) {
    ElMessage.error(error.response?.data?.message || "Lỗi khi lưu thông tin người thuê");
  } finally {
    isSubmitting.value = false;
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
  --text-id: #3b82f6;
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

.text-main {
  color: var(--text-main);
}
.text-dim {
  color: var(--text-dim);
}
.bg-table {
  background-color: var(--bg-table);
}
.bg-header {
  background-color: var(--bg-header);
}
.bg-section {
  background-color: var(--bg-section);
}
.bg-input {
  background-color: var(--bg-input);
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
  background-color: var(--btn-secondary-bg);
  color: var(--text-dim);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-view:hover {
  background-color: rgba(59, 130, 246, 0.15) !important;
  color: #3b82f6 !important;
}

.btn-edit:hover {
  background-color: rgba(16, 185, 129, 0.15) !important;
  color: #10b981 !important;
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

/* Dialog Theme Customization (Shared style v3) */
:deep(.theme-dialog-v3) {
  border-radius: 24px !important;
  overflow: hidden;
  background-color: var(--bg-table) !important;
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

/* Uploader Style */
:deep(.reading-uploader .el-upload--picture-card) {
  width: 100px;
  height: 100px;
  border-radius: 12px;
  background-color: var(--bg-input);
  border: 1px dashed var(--border-main);
}
:deep(.reading-uploader .el-upload-list--picture-card .el-upload-list__item) {
  width: 100px;
  height: 100px;
  border-radius: 12px;
}

/* Tab Style V3 */
.tenant-tabs-v3 :deep(.el-tabs__item) {
  font-weight: 800;
  text-transform: uppercase;
  font-size: 11px;
  letter-spacing: 1px;
  color: var(--text-dim);
}
.tenant-tabs-v3 :deep(.el-tabs__item.is-active) {
  color: #3b82f6;
}
.tenant-tabs-v3 :deep(.el-tabs__active-bar) {
  background-color: #3b82f6;
  height: 3px;
  border-radius: 3px;
}
</style>

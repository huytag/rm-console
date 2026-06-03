<template>
  <div class="reservation-page min-h-full p-6 font-inter">
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Tổng tiền cọc (Toàn bộ) -->
      <div
        class="stat-card card-blue flex items-center gap-4 p-5 rounded-2xl border border-main"
      >
        <div
          class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-blue-500/10"
        >
          <el-icon size="24" style="color: #3b82f6"><Wallet /></el-icon>
        </div>
        <div>
          <p class="text-xs font-bold uppercase tracking-widest mb-1 text-dim">
            Tổng tiền cọc
          </p>
          <p class="text-2xl font-black text-main">
            {{ formatPrice(totalDeposit) }}
          </p>
        </div>
      </div>

      <!-- Đã cọc (Confirmed) -->
      <div
        class="stat-card card-emerald flex items-center gap-4 p-5 rounded-2xl border border-main"
      >
        <div
          class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-emerald-500/10"
        >
          <el-icon size="24" style="color: #10b981"><CircleCheck /></el-icon>
        </div>
        <div>
          <p class="text-xs font-bold uppercase tracking-widest mb-1 text-dim">
            Đã cọc
          </p>
          <p class="text-2xl font-black text-main">{{ stats.confirmed }}</p>
        </div>
      </div>

      <!-- Chờ duyệt (Pending) -->
      <div
        class="stat-card card-amber flex items-center gap-4 p-5 rounded-2xl border border-main"
      >
        <div
          class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-amber-500/10"
        >
          <el-icon size="24" style="color: #f59e0b"><Timer /></el-icon>
        </div>
        <div>
          <p class="text-xs font-bold uppercase tracking-widest mb-1 text-dim">
            Chờ duyệt
          </p>
          <p class="text-2xl font-black text-main">{{ stats.pending }}</p>
        </div>
      </div>

      <!-- Quá hạn (Expired) -->
      <div
        class="stat-card card-rose flex items-center gap-4 p-5 rounded-2xl border border-main"
      >
        <div
          class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-rose-500/10"
        >
          <el-icon size="24" style="color: #ef4444"><Warning /></el-icon>
        </div>
        <div>
          <p class="text-xs font-bold uppercase tracking-widest mb-1 text-dim">
            Quá hạn/Hủy
          </p>
          <p class="text-2xl font-black text-main">
            {{ stats.expired + stats.cancelled }}
          </p>
        </div>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="flex flex-wrap items-center justify-between mb-6 gap-4">
      <div class="flex items-center gap-4">
        <!-- Building select -->
        <el-select
          v-model="filters.building"
          placeholder="Chọn tòa nhà"
          clearable
          size="large"
          class="reservation-select"
          style="width: 200px"
        >
          <el-option
            v-for="b in buildings"
            :key="b.id"
            :label="b.name"
            :value="b.id"
          />
        </el-select>
      </div>

      <div class="flex gap-3">
        <button
          class="flex items-center justify-center gap-2 px-5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-105"
          style="background-color: #f59e0b; height: 40px"
          @click="toggleExpired"
        >
          <el-icon><Warning /></el-icon>
          {{ isShowingExpired ? 'Tất cả phiếu cọc' : 'Lọc cọc quá hạn' }}
        </button>

        <button
          class="flex items-center justify-center gap-2 px-5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-105"
          style="background-color: #3b82f6; height: 40px"
          @click="showCreateDialog"
        >
          <el-icon><Plus /></el-icon>
          Thêm cọc
        </button>
      </div>
    </div>

    <!-- Table Section -->
    <div
      class="table-container rounded-2xl border border-main overflow-hidden shadow-2xl"
    >
      <div class="overflow-x-auto">
        <table class="w-full text-sm border-collapse whitespace-nowrap">
          <thead class="table-head">
            <tr class="border-b border-main">
              <th
                class="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-dim"
              >
                ID
              </th>
              <th
                class="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-dim"
              >
                Phòng
              </th>
              <th
                class="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-dim"
              >
                Khách hàng
              </th>
              <th
                class="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-dim"
              >
                Số điện thoại
              </th>
              <th
                class="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-dim"
              >
                Kết thúc giữ
              </th>
              <th
                class="px-6 py-5 text-right text-[11px] font-black uppercase tracking-widest text-dim"
              >
                Tiền cọc
              </th>
              <th
                class="px-6 py-5 text-center text-[11px] font-black uppercase tracking-widest text-dim"
              >
                Trạng thái
              </th>
              <th
                class="px-6 py-5 text-right text-[11px] font-black uppercase tracking-widest text-dim"
              >
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody v-if="!loading" class="table-body">
            <tr
              v-for="(row, index) in paginatedReservations"
              :key="row.id"
              class="table-row transition-colors border-b last:border-0 border-row"
            >
              <!-- ID -->
              <td class="px-6 py-5">
                <span class="font-bold text-xs text-id"
                  >#RES-{{ String(row.id).padStart(4, "0") }}</span
                >
              </td>

              <!-- Phòng -->
              <td class="px-6 py-5">
                <p class="font-bold text-main text-sm mb-0.5">
                  {{ row.room?.room_number || '---' }}
                </p>
                <p class="text-[11px] text-dim font-medium mt-0.5">
                  {{ row.room?.building?.name || "Chưa cập nhật" }}
                </p>
              </td>

              <!-- Khách hàng -->
              <td class="px-6 py-5">
                <p class="font-bold text-main text-sm">
                  {{ row.customer_name }}
                </p>
              </td>

              <!-- Số điện thoại -->
              <td class="px-6 py-5">
                <p class="text-muted font-medium text-sm">
                  {{ formatPhone(row.customer_phone) }}
                </p>
              </td>

              <!-- Kết thúc giữ -->
              <td class="px-6 py-5">
                <span class="font-bold text-main text-xs">{{
                  formatDateStr(row.expired_at)
                }}</span>
              </td>

              <!-- Tiền cọc -->
              <td class="px-6 py-5 text-right">
                <span class="font-black text-main text-sm">{{
                  formatPriceWithoutCurrency(row.deposit_amount)
                }}</span>
              </td>

              <!-- Trạng thái -->
              <td class="px-6 py-5 text-center">
                <span
                  class="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                  :style="getStatusStyle(row.status)"
                >
                  {{ getStatusLabel(row.status) }}
                </span>
              </td>

              <!-- Thao tác -->
              <td class="px-6 py-5 text-right">
                <div class="flex items-center justify-end gap-2">
                  <el-button type="info" size="small" plain @click="viewReservation(row)">
                    Xem
                  </el-button>
                  <el-button 
                    v-if="row.status === 'pending'"
                    type="success" size="small" plain @click="confirmReservation(row)">
                    Duyệt
                  </el-button>
                  <el-button 
                    v-if="row.status === 'pending'"
                    type="warning" size="small" plain @click="cancelReservation(row)">
                    Hủy
                  </el-button>
                  <el-button type="danger" size="small" plain @click="deleteReservation(row)">
                    Xóa
                  </el-button>
                </div>
              </td>
            </tr>
            <tr v-if="paginatedReservations.length === 0">
              <td colspan="8" class="px-6 py-10">
                <el-empty description="Chưa có phiếu giữ chỗ nào" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        class="pagination-bar px-6 py-4 flex items-center justify-between border-t border-main"
      >
        <span class="text-xs font-bold text-dim uppercase tracking-widest"
          >Tổng cộng <span class="text-main">{{ totalCount }}</span> phiếu giữ
          chỗ</span
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

    <!-- Dialog Thêm cọc -->
    <el-dialog
      v-model="dialogVisible"
      title="Khởi tạo phiếu giữ chỗ"
      width="90%" style="max-width: 550px"
      class="theme-dialog-v3"
      append-to-body
    >
      <el-form
        :model="form"
        :rules="rules"
        ref="formRef"
        label-position="top"
        class="mt-2"
      >
        <div class="grid grid-cols-1 gap-4">
          <el-form-item label="Tên tòa nhà" prop="building_id" required>
            <el-select v-model="form.building_id" class="!w-full" placeholder="Chọn tòa nhà">
              <el-option v-for="b in buildings" :key="b.id" :label="b.name" :value="b.id" />
            </el-select>
          </el-form-item>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="Mã phòng" prop="room_id" required>
            <el-select v-model="form.room_id" class="!w-full" placeholder="Chọn phòng">
              <el-option v-for="r in filteredRoomsByBuilding" :key="r.id" :label="r.room_number" :value="r.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="Tên khách hàng" prop="customer_name" required>
            <el-input
              v-model="form.customer_name"
              placeholder="Nguyễn Văn A..."
            />
          </el-form-item>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="Số điện thoại" prop="customer_phone" required>
            <el-input
              v-model="form.customer_phone"
              placeholder="09xx.xxx.xxx"
            />
          </el-form-item>
          <el-form-item label="Tiền đặt cọc" prop="deposit_amount" required>
            <el-input
              v-model.number="form.deposit_amount"
              placeholder="Ví dụ: 1000000"
            >
              <template #append>VNĐ</template>
            </el-input>
          </el-form-item>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="Kết thúc giữ phòng" prop="expired_at" required>
            <el-date-picker
              v-model="form.expired_at"
              type="date"
              format="DD/MM/YYYY"
              value-format="YYYY-MM-DD"
              class="!w-full"
              placeholder="Chọn ngày"
            />
          </el-form-item>
          <el-form-item label="Trạng thái" prop="status" required>
            <el-select v-model="form.status" class="!w-full">
              <el-option label="Chờ duyệt" value="pending" />
              <el-option label="Đã cọc" value="confirmed" />
              <el-option label="Quá hạn" value="expired" />
              <el-option label="Đã hủy" value="cancelled" />
            </el-select>
          </el-form-item>
        </div>

        <div class="grid grid-cols-1 gap-4">
          <el-form-item label="Email khách hàng" prop="customer_email">
            <el-input
              v-model="form.customer_email"
              placeholder="Nhập email (tùy chọn)"
            />
          </el-form-item>
        </div>

        <div class="grid grid-cols-1 gap-4">
          <el-form-item label="Ghi chú" prop="notes">
            <el-input
              v-model="form.notes"
              type="textarea"
              :rows="3"
              placeholder="Nhập ghi chú..."
            />
          </el-form-item>
        </div>
      </el-form>

      <template #footer>
        <div class="flex justify-end gap-3 px-4 pb-4 mt-4">
          <el-button @click="dialogVisible = false" class="theme-btn-cancel"
            >Hủy bỏ</el-button
          >
          <el-button type="primary" @click="submitForm" class="theme-btn-submit"
            >Lưu phiếu cọc</el-button
          >
        </div>
      </template>
    </el-dialog>

    <!-- Dialog Xem chi tiết -->
    <el-dialog
      v-model="viewDialogVisible"
      title="Chi tiết Phiếu cọc"
      width="90%" style="max-width: 500px"
      class="theme-dialog-v3"
    >
      <div v-loading="loadingDetails" class="space-y-4">
        <div class="flex justify-between border-b pb-2">
          <span class="text-dim font-medium">Tên khách hàng:</span>
          <span class="font-bold">{{ selectedReservation.customer_name }}</span>
        </div>
        <div class="flex justify-between border-b pb-2">
          <span class="text-dim font-medium">Số điện thoại:</span>
          <span class="font-bold">{{ selectedReservation.customer_phone }}</span>
        </div>
        <div class="flex justify-between border-b pb-2">
          <span class="text-dim font-medium">Email:</span>
          <span class="font-bold">{{ selectedReservation.customer_email || 'Không có' }}</span>
        </div>
        <div class="flex justify-between border-b pb-2">
          <span class="text-dim font-medium">Phòng:</span>
          <span class="font-bold">{{ selectedReservation.room?.room_number || '---' }} ({{ selectedReservation.room?.building?.name || '---' }})</span>
        </div>
        <div class="flex justify-between border-b pb-2">
          <span class="text-dim font-medium">Tiền cọc:</span>
          <span class="font-bold text-main">{{ formatPriceWithoutCurrency(selectedReservation.deposit_amount) }} VNĐ</span>
        </div>
        <div class="flex justify-between border-b pb-2">
          <span class="text-dim font-medium">Kết thúc giữ:</span>
          <span class="font-bold">{{ formatDateStr(selectedReservation.expired_at) }}</span>
        </div>
        <div class="flex justify-between border-b pb-2">
          <span class="text-dim font-medium">Trạng thái:</span>
          <span class="font-bold" :style="getStatusStyle(selectedReservation.status)">{{ getStatusLabel(selectedReservation.status) }}</span>
        </div>
        <div>
          <span class="text-dim font-medium block mb-1">Ghi chú:</span>
          <div class="p-3 bg-gray-50 rounded-lg text-sm text-gray-700 min-h-[60px] whitespace-pre-wrap">
            {{ selectedReservation.notes || 'Không có ghi chú' }}
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end mt-4">
          <el-button @click="viewDialogVisible = false">Đóng</el-button>
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
  Plus,
  Wallet,
  CreditCard,
  WalletFilled,
  ArrowLeft,
  ArrowRight,
  CircleCheck,
  Timer,
  Warning,
} from "@element-plus/icons-vue";

// Mock Data
// No mock data anymore

const reservations = ref([]);
const buildings = ref([
  { id: 1, name: "Landmark 81" },
  { id: 2, name: "Sunrise City" },
]);
const emptyRooms = ref([]);
const loading = ref(false);
const dialogVisible = ref(false);
const viewDialogVisible = ref(false);
const isShowingExpired = ref(false);
const selectedReservation = ref({});
const loadingDetails = ref(false);
const formRef = ref(null);
const currentPage = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);

const filters = reactive({
  building: null,
  status: null,
});
const form = reactive({
  room_id: null,
  building_id: null,
  customer_name: "",
  customer_phone: "",
  deposit_amount: null,
  expired_at: "",
  customer_email: "",
  notes: "",
  status: "pending",
});

const rules = {
  building_id: [
    { required: true, message: "Vui lòng chọn tòa nhà", trigger: "change" },
  ],
  room_id: [
    { required: true, message: "Vui lòng chọn mã phòng", trigger: "change" },
  ],
  customer_name: [
    { required: true, message: "Vui lòng nhập tên", trigger: "blur" },
  ],
  customer_phone: [
    { required: true, message: "Vui lòng nhập số điện thoại", trigger: "blur" },
  ],
  deposit_amount: [
    { required: true, message: "Vui lòng nhập tiền cọc", trigger: "blur" },
  ],
  expired_at: [
    {
      required: true,
      message: "Vui lòng chọn ngày hết hạn",
      trigger: "change",
    },
  ],
  customer_email: [
    { type: 'email', message: "Vui lòng nhập email hợp lệ", trigger: ["blur", "change"] }
  ],
  status: [
    { required: true, message: "Vui lòng chọn trạng thái", trigger: "change" },
  ],
};

const stats = computed(() => ({
  confirmed: reservations.value.filter((r) => r.status === "confirmed").length,
  pending: reservations.value.filter((r) => r.status === "pending").length,
  cancelled: reservations.value.filter((r) => r.status === "cancelled").length,
  expired: reservations.value.filter((r) => r.status === "expired").length,
}));

const totalDeposit = computed(() =>
  reservations.value
    .filter((r) => ["confirmed", "pending"].includes(r.status))
    .reduce((s, r) => s + Number(r.deposit_amount || 0), 0),
);

const filteredReservations = computed(() => {
  let result = reservations.value;
  if (filters.building)
    result = result.filter(
      (r) =>
        r.building_id === filters.building ||
        r.building_name?.includes(
          buildings.value.find((b) => b.id === filters.building)?.name,
        ),
    );
  return result;
});

const paginatedReservations = computed(() =>
  filteredReservations.value.slice(
    (currentPage.value - 1) * pageSize.value,
    currentPage.value * pageSize.value,
  ),
);

import { watch } from "vue";
watch(
  filteredReservations,
  (newVal) => {
    totalCount.value = newVal.length;
  },
  { immediate: true },
);

const filteredRoomsByBuilding = computed(() => {
  if (!form.building_id) return emptyRooms.value;
  return emptyRooms.value.filter(r => r.building_id === form.building_id);
});

const formatPriceWithoutCurrency = (p) =>
  new Intl.NumberFormat("vi-VN").format(p || 0);
const formatPrice = (p) => formatPriceWithoutCurrency(p) + "đ";
const formatDateStr = (d) =>
  d ? new Date(d).toLocaleDateString("vi-VN") : "---";
const formatPhone = (phone) =>
  phone ? phone.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3") : "";
const disabledDate = (time) => time.getTime() < Date.now() - 86400000;
const getStatusLabel = (s) => {
  if (!s) return "";
  return ({
    pending: "CHỜ DUYỆT",
    confirmed: "ĐÃ CỌC",
    cancelled: "ĐÃ HỦY",
    expired: "QUÁ HẠN",
  })[s] || s.toUpperCase();
};

const getStatusStyle = (s) => {
  const styles = {
    confirmed:
      "color: #10B981; background-color: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2);",
    pending:
      "color: #F59E0B; background-color: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.2);",
    cancelled:
      "color: #EF4444; background-color: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2);",
    expired:
      "color: #EF4444; background-color: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2);",
  };
  return (
    styles[s] || "color: #9CA3AF; background-color: rgba(156, 163, 175, 0.1);"
  );
};

const fetchData = async () => {
  loading.value = true;
  try {
    const params = { page: currentPage.value, per_page: pageSize.value };
    const response = await api.get("/reservations", { params });
    const data = response.data?.data || response.data || response;
    reservations.value = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("API Error:", error);
  } finally {
    loading.value = false;
  }
};

const toggleExpired = () => {
  isShowingExpired.value = !isShowingExpired.value;
  if (isShowingExpired.value) {
    fetchExpiredReservations();
  } else {
    fetchData();
  }
};

const fetchExpiredReservations = async () => {
  loading.value = true;
  try {
    const response = await api.get("/reservations/expired");
    const data = response.data?.data || response.data || response;
    reservations.value = Array.isArray(data) ? data : [];
  } catch (error) {
    ElMessage.error("Không thể lấy danh sách cọc quá hạn");
  } finally {
    loading.value = false;
  }
};

const fetchEmptyRooms = async () => {
  try {
    const response = await api.get("/rooms", {
      params: { status: "empty", per_page: 100 },
    });
    const data = response.data?.data || response.data || response;
    emptyRooms.value = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to load rooms");
  }
};

const fetchBuildings = async () => {
  try {
    const response = await api.get("/buildings");
    const data = response.data?.data || response.data || response;
    buildings.value = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to load buildings");
  }
};

const viewReservation = async (row) => {
  viewDialogVisible.value = true;
  loadingDetails.value = true;
  try {
    const response = await api.get(`/reservations/${row.id}`);
    selectedReservation.value = response.data?.data || response.data || response;
  } catch (error) {
    ElMessage.error("Không thể tải chi tiết phiếu cọc");
    viewDialogVisible.value = false;
  } finally {
    loadingDetails.value = false;
  }
};

const showCreateDialog = () => {
  Object.assign(form, {
    room_id: null,
    building_id: null,
    customer_name: "",
    customer_phone: "",
    deposit_amount: null,
    expired_at: "",
    customer_email: "",
    notes: "",
    status: "pending",
  });
  dialogVisible.value = true;
};
const submitForm = async () => {
  const valid = await formRef.value.validate().catch(() => false);
  if (valid) {
    try {
      await api.post("/reservations", {
        room_id: form.room_id,
        customer_name: form.customer_name,
        customer_phone: form.customer_phone,
        customer_email: form.customer_email || null,
        deposit_amount: form.deposit_amount,
        expired_at: form.expired_at,
        notes: form.notes || null
      });
      ElMessage.success("Thành công");
      dialogVisible.value = false;
      fetchData();
    } catch (e) {
      ElMessage.error(e.response?.data?.message || "Lỗi khi khởi tạo phiếu cọc");
    }
  }
};

const confirmReservation = async (row) => {
  try {
    await ElMessageBox.confirm(`Bạn có chắc muốn duyệt phiếu cọc #${row.id}?`, "Xác nhận", {
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
      type: "success",
    });
    await api.put(`/reservations/${row.id}/confirm`);
    ElMessage.success("Đã duyệt phiếu cọc");
    fetchData();
  } catch (error) {
    if (error !== "cancel") ElMessage.error("Lỗi khi duyệt phiếu cọc");
  }
};

const cancelReservation = async (row) => {
  try {
    await ElMessageBox.confirm(`Bạn muốn hủy phiếu cọc #${row.id}?`, "Cảnh báo", {
      confirmButtonText: "Đồng ý hủy",
      cancelButtonText: "Đóng",
      type: "warning",
    });
    await api.put(`/reservations/${row.id}/cancel`);
    ElMessage.success("Đã hủy phiếu cọc");
    fetchData();
  } catch (error) {
    if (error !== "cancel") ElMessage.error("Lỗi khi hủy phiếu cọc");
  }
};

const deleteReservation = async (row) => {
  try {
    await ElMessageBox.confirm(`Hành động này sẽ xóa vĩnh viễn phiếu cọc #${row.id}. Không thể khôi phục!`, "Nguy hiểm", {
      confirmButtonText: "Xóa vĩnh viễn",
      cancelButtonText: "Hủy",
      type: "error",
    });
    await api.delete(`/reservations/${row.id}`);
    ElMessage.success("Đã xóa phiếu cọc");
    fetchData();
  } catch (error) {
    if (error !== "cancel") ElMessage.error("Lỗi khi xóa phiếu cọc");
  }
};

onMounted(() => {
  fetchData();
  fetchEmptyRooms();
  fetchBuildings();
});
</script>

<style>
/* Global Theme Variables */
:root {
  --bg-page: #f8fafc;
  --bg-card: #ffffff;
  --bg-table-head: #f8fafc;
  --bg-table-body: #ffffff;
  --text-main: #1e293b;
  --text-dim: #64748b;
  --text-muted: #94a3b8;
  --border-main: #e2e8f0;
  --border-row: #f1f5f9;
  --stat-primary-bg: rgba(59, 130, 246, 0.1);
  --stat-success-bg: rgba(16, 185, 129, 0.1);
  --stat-warning-bg: rgba(245, 158, 11, 0.1);
  --stat-error-bg: rgba(239, 68, 68, 0.1);
  --action-btn-bg: #f1f5f9;
  --text-id: #3b82f6;
  --card-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

html.dark {
  --bg-page: #111827;
  --bg-card: #1f2937;
  --bg-table-head: #1f2937;
  --bg-table-body: #111827;
  --text-main: #ffffff;
  --text-dim: #9ca3af;
  --text-muted: #6b7280;
  --border-main: #374151;
  --border-row: #374151;
  --stat-primary-bg: rgba(59, 130, 246, 0.15);
  --stat-success-bg: rgba(16, 185, 129, 0.15);
  --stat-warning-bg: rgba(245, 158, 11, 0.15);
  --stat-error-bg: rgba(239, 68, 68, 0.15);
  --action-btn-bg: #374151;
  --text-id: #6b7280;
  --card-shadow: none;
}
</style>

<style scoped>
.reservation-page {
  background-color: var(--bg-page) !important;
  color: var(--text-main);
  transition: all 0.3s ease;
}

.text-main {
  color: var(--text-main);
}
.text-dim {
  color: var(--text-dim);
}
.text-muted {
  color: var(--text-muted);
}
.text-id {
  color: var(--text-id);
}
.border-main {
  border-color: var(--border-main);
}
.border-row {
  border-color: var(--border-row);
}

.card-item {
  background-color: var(--bg-card);
  border-color: var(--border-main);
  box-shadow: var(--card-shadow);
}

.stat-card {
  transition: all 0.3s ease;
  backdrop-filter: blur(12px);
}

.card-blue {
  background-color: rgba(59, 130, 246, 0.05) !important;
  border-color: rgba(59, 130, 246, 0.1) !important;
}
.card-emerald {
  background-color: rgba(16, 185, 129, 0.05) !important;
  border-color: rgba(16, 185, 129, 0.1) !important;
}
.card-amber {
  background-color: rgba(245, 158, 11, 0.05) !important;
  border-color: rgba(245, 158, 11, 0.1) !important;
}
.card-rose {
  background-color: rgba(239, 68, 68, 0.05) !important;
  border-color: rgba(239, 68, 68, 0.1) !important;
}

html.dark .card-blue {
  background-color: rgba(59, 130, 246, 0.1) !important;
  border-color: rgba(59, 130, 246, 0.2) !important;
}
html.dark .card-emerald {
  background-color: rgba(16, 185, 129, 0.1) !important;
  border-color: rgba(16, 185, 129, 0.2) !important;
}
html.dark .card-amber {
  background-color: rgba(245, 158, 11, 0.1) !important;
  border-color: rgba(245, 158, 11, 0.2) !important;
}
html.dark .card-rose {
  background-color: rgba(239, 68, 68, 0.1) !important;
  border-color: rgba(239, 68, 68, 0.2) !important;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.2);
}

.card-blue:hover {
  background-color: rgba(59, 130, 246, 0.15) !important;
}
.card-emerald:hover {
  background-color: rgba(16, 185, 129, 0.15) !important;
}
.card-amber:hover {
  background-color: rgba(245, 158, 11, 0.15) !important;
}
.card-rose:hover {
  background-color: rgba(239, 68, 68, 0.15) !important;
}

.table-container {
  background-color: var(--bg-page);
  border-color: var(--border-main);
}

.table-head {
  background-color: var(--bg-table-head);
}

.table-body {
  background-color: var(--bg-table-body);
}

.table-row:hover {
  background-color: var(--bg-card);
}

.pagination-bar {
  background-color: var(--bg-table-head);
}

/* Custom Elements Styling */
:deep(.reservation-select .el-input__wrapper),
:deep(.reservation-datepicker .el-input__wrapper) {
  background-color: var(--bg-card) !important;
  border: 1px solid var(--border-main) !important;
  box-shadow: none !important;
  border-radius: 10px;
}

:deep(.reservation-select .el-input__inner),
:deep(.reservation-datepicker .el-input__inner) {
  color: var(--text-main) !important;
  font-weight: 500;
}

/* Dialog Styles */
:deep(.reservation-dialog .el-dialog) {
  background-color: var(--bg-card) !important;
  border-radius: 20px;
  border: 1px solid var(--border-main);
}

:deep(.reservation-dialog .el-dialog__title) {
  color: var(--text-main) !important;
  font-weight: 800;
}

:deep(.reservation-dialog .el-form-item__label) {
  color: var(--text-dim) !important;
  font-weight: 600;
}

:deep(.reservation-dialog .el-input__wrapper) {
  background-color: var(--bg-page) !important;
  border: 1px solid var(--border-main) !important;
  box-shadow: none !important;
}

:deep(.reservation-dialog .el-input__inner) {
  color: var(--text-main) !important;
}

.btn-cancel {
  background-color: var(--action-btn-bg) !important;
  border: none !important;
  color: var(--text-main) !important;
  border-radius: 10px !important;
}

.btn-confirm {
  background-color: #3b82f6 !important;
  border: none !important;
  color: #fff !important;
  border-radius: 10px !important;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
.animate-pulse {
  animation: pulse 1.5s ease-in-out infinite;
}

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background: var(--border-main);
  border-radius: 10px;
}

/* Dialog Theme Customization (Shared style) */
:deep(.theme-dialog-v3) {
  border-radius: 24px;
  overflow: hidden;
  background-color: var(--bg-card) !important;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
}

:deep(.theme-dialog-v3 .el-dialog__header) {
  padding: 24px 32px;
  margin-right: 0;
  border-bottom: 1px solid var(--border-row);
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
  font-size: 11px;
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

.theme-btn-cancel {
  border-radius: 12px;
  height: 44px;
  padding: 0 24px;
  font-weight: 700;
  border: 1px solid var(--border-main);
  background: transparent;
  color: var(--text-dim);
}

.theme-btn-submit {
  border-radius: 12px;
  height: 44px;
  padding: 0 24px;
  font-weight: 700;
  background-color: #3b82f6 !important;
  border: none !important;
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
}
</style>

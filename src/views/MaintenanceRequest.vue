<template>
  <div class="maintenance-page min-h-full p-6 font-inter">
    <!-- ===== 1. HEADER ===== -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-black text-main mb-1">Yêu cầu Bảo trì</h1>
        <p class="text-sm text-dim">
          Theo dõi và quản lý các yêu cầu sửa chữa từ khách thuê.
        </p>
      </div>
      <button
        class="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-105 hover:shadow-lg active:scale-95 shadow-lg shadow-blue-500/20"
        style="background-color: #3b82f6"
        @click="openAddModal"
      >
        <el-icon><Plus /></el-icon> Tạo yêu cầu mới
      </button>
    </div>

    <!-- ===== 2. STAT CARDS ===== -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Pending -->
      <div
        class="stat-card card-amber p-6 rounded-2xl border border-main flex flex-col justify-between h-[150px] group transition-all"
      >
        <div class="flex justify-between items-start">
          <p class="text-[10px] font-black uppercase tracking-widest text-dim">
            Đang chờ xử lý
          </p>
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-500/10 text-amber-500 group-hover:rotate-12 transition-transform"
          >
            <el-icon size="20"><Timer /></el-icon>
          </div>
        </div>
        <div>
          <h2 class="text-3xl font-black text-main mb-1">
            {{ stats.pending }}
          </h2>
          <span
            class="text-[10px] font-bold text-amber-500 flex items-center gap-1"
          >
            <el-icon><Clock /></el-icon> Cần kiểm tra ngay
          </span>
        </div>
      </div>

      <!-- In Progress -->
      <div
        class="stat-card card-blue p-6 rounded-2xl border border-main flex flex-col justify-between h-[150px] group transition-all"
      >
        <div class="flex justify-between items-start">
          <p class="text-[10px] font-black uppercase tracking-widest text-dim">
            Đang thực hiện
          </p>
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-500/10 text-blue-500 group-hover:rotate-12 transition-transform"
          >
            <el-icon size="20"><Tools /></el-icon>
          </div>
        </div>
        <div>
          <h2 class="text-3xl font-black text-main mb-1">
            {{ stats.in_progress }}
          </h2>
          <span class="text-[10px] font-bold text-dim">Đang trong tiến độ</span>
        </div>
      </div>

      <!-- Completed -->
      <div
        class="stat-card card-emerald p-6 rounded-2xl border border-main flex flex-col justify-between h-[150px] group transition-all"
      >
        <div class="flex justify-between items-start">
          <p class="text-[10px] font-black uppercase tracking-widest text-dim">
            Đã hoàn thành
          </p>
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-500/10 text-emerald-500 group-hover:rotate-12 transition-transform"
          >
            <el-icon size="20"><CircleCheck /></el-icon>
          </div>
        </div>
        <div>
          <h2 class="text-3xl font-black text-main mb-1">
            {{ stats.completed }}
          </h2>
          <span
            class="text-[10px] font-bold text-emerald-500 flex items-center gap-1"
          >
            <el-icon><Top /></el-icon> Đã giải quyết
          </span>
        </div>
      </div>

      <!-- Urgent/Overdue -->
      <div
        class="stat-card card-rose p-6 rounded-2xl border border-main flex flex-col justify-between h-[150px] group transition-all relative overflow-hidden"
      >
        <div class="flex justify-between items-start">
          <p class="text-[10px] font-black uppercase tracking-widest text-dim">
            Khẩn cấp
          </p>
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center bg-rose-500/10 text-rose-500 group-hover:scale-110 transition-transform"
          >
            <el-icon size="20"><Warning /></el-icon>
          </div>
        </div>
        <div>
          <h2 class="text-3xl font-black text-rose-500 mb-1">
            {{ stats.urgent }}
          </h2>
          <span class="text-[10px] font-bold text-rose-500"
            >Mức độ nguy cấp</span
          >
        </div>
        <div
          class="absolute -right-2 -bottom-2 opacity-[0.03] text-rose-500 rotate-12"
        >
          <el-icon size="80"><Warning /></el-icon>
        </div>
      </div>
    </div>

    <!-- ===== 3. FILTER BAR ===== -->
    <div class="bg-card/40 p-4 rounded-2xl border border-main mb-8">
      <div class="flex flex-wrap items-center gap-6">
        <div class="flex items-center gap-3">
          <span
            class="text-[10px] font-black uppercase text-dim tracking-widest whitespace-nowrap"
            >Trạng thái:</span
          >
          <el-select
            v-model="filters.status"
            placeholder="Tất cả trạng thái"
            class="theme-select-v3"
            style="width: 220px"
          >
            <el-option label="Tất cả trạng thái" :value="null" />
            <el-option label="Đang chờ" value="pending" />
            <el-option label="Đang xử lý" value="in_progress" />
            <el-option label="Hoàn thành" value="completed" />
          </el-select>
        </div>
        <div class="flex items-center gap-3 border-l border-main pl-6">
          <span
            class="text-[10px] font-black uppercase text-dim tracking-widest whitespace-nowrap"
            >Mức độ:</span
          >
          <el-select
            v-model="filters.priority"
            placeholder="Tất cả mức độ"
            class="theme-select-v3"
            style="width: 200px"
          >
            <el-option label="Tất cả mức độ" :value="null" />
            <el-option label="Thấp" value="low" />
            <el-option label="Vừa" value="medium" />
            <el-option label="Cao" value="high" />
            <el-option label="Khẩn cấp" value="urgent" />
          </el-select>
        </div>
        <div class="flex-grow relative flex items-center ml-auto max-w-md">
          <el-icon class="absolute left-4 text-dim"><Search /></el-icon>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Tìm theo người thuê, tiêu đề..."
            class="w-full bg-transparent border-none outline-none pl-12 pr-4 h-11 text-sm text-main placeholder:text-dim font-medium rounded-xl border border-main focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>

    <!-- ===== 4. TABLE SECTION ===== -->
    <div
      class="rounded-2xl border border-main overflow-hidden shadow-2xl bg-table"
    >
      <div class="overflow-x-auto">
        <table class="w-full text-sm border-collapse">
          <thead class="bg-header">
            <tr class="border-b border-main">
              <th
                class="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-dim"
              >
                ID
              </th>
              <th
                class="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-dim"
              >
                Người thuê
              </th>
              <th
                class="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-dim"
              >
                Phòng / Tòa nhà
              </th>
              <th
                class="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-dim"
              >
                Chủ đề yêu cầu
              </th>
              <th
                class="px-6 py-5 text-center text-[10px] font-black uppercase tracking-widest text-dim"
              >
                Ngày giải quyết
              </th>
              <th
                class="px-6 py-5 text-center text-[10px] font-black uppercase tracking-widest text-dim"
              >
                Trạng thái
              </th>
              <th
                class="px-6 py-5 text-center text-[10px] font-black uppercase tracking-widest text-dim"
              >
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody v-if="!loading" class="bg-table">
            <tr
              v-for="(row, idx) in paginatedRequests"
              :key="idx"
              class="table-row-hover border-b last:border-0 border-main transition-colors"
            >
              <td class="px-6 py-5">
                <span class="text-[11px] font-black text-id tracking-widest"
                  >#REQ-{{ row.id }}</span
                >
              </td>
              <td class="px-6 py-5">
                <div class="flex items-center gap-3">
                  <div
                    class="w-9 h-9 rounded-full bg-blue-500/10 flex items-center justify-center text-xs font-black text-blue-500 shrink-0"
                  >
                    {{ getInitials(row.tenant?.name || "K") }}
                  </div>
                  <span class="text-sm font-bold text-main">{{
                    row.tenant?.name || "Khách thuê #" + row.tenant_id
                  }}</span>
                </div>
              </td>
              <td class="px-6 py-5">
                <div class="flex flex-col">
                  <span class="text-sm font-bold text-main"
                    >Phòng {{ row.room?.room_number || row.room_number }}</span
                  >
                  <span class="text-[10px] font-bold text-dim">{{
                    row.room?.building?.name || "Tòa nhà Blue Moon"
                  }}</span>
                </div>
              </td>
              <td class="px-6 py-5">
                <div class="flex flex-col gap-1">
                  <span class="text-sm font-bold text-main">{{
                    row.title
                  }}</span>
                  <div class="flex items-center gap-2">
                    <span
                      class="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border"
                      :class="getPriorityClass(row.priority)"
                    >
                      {{ row.priority }}
                    </span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-5 text-center">
                <span
                  class="text-xs font-bold"
                  :class="
                    row.resolved_at ? 'text-emerald-500' : 'text-dim italic'
                  "
                >
                  {{ row.resolved_at || "Chưa xử lý" }}
                </span>
              </td>
              <td class="px-6 py-5 text-center">
                <span
                  class="inline-block px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border"
                  :style="getStatusStyle(row.status)"
                >
                  {{ getStatusLabel(row.status) }}
                </span>
              </td>
              <td class="px-6 py-5 text-center">
                <div class="flex items-center justify-center gap-3">
                  <button
                    class="action-btn btn-view"
                    title="Xem chi tiết"
                    @click="viewDetail(row)"
                  >
                    <el-icon size="18"><View /></el-icon>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer/Pagination -->
      <div
        class="px-6 py-4 flex items-center justify-between bg-header border-t border-main"
      >
        <span class="text-[10px] font-bold text-dim uppercase tracking-widest"
          >Tổng cộng <span class="text-main">{{ totalCount }}</span> yêu cầu</span
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

    <!-- ===== 5. DIALOGS ===== -->
    <!-- Create/Edit Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? 'Cập nhật Yêu cầu Bảo trì' : 'Ghi nhận Yêu cầu Bảo trì'"
      width="750px"
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
          <el-form-item label="Chọn phòng gặp sự cố" prop="room_id" required>
            <el-select
              v-model="form.room_id"
              class="!w-full"
              placeholder="Chọn phòng"
            >
              <el-option
                v-for="r in allRooms"
                :key="r.id"
                :label="`Phòng ${r.room_number} - ${r.building?.name}`"
                :value="r.id"
              />
            </el-select>
          </el-form-item>
        </div>

        <div class="grid grid-cols-1 gap-4">
          <el-form-item label="Chủ đề yêu cầu" prop="title" required>
            <el-input
              v-model="form.title"
              placeholder="VD: Hỏng vòi nước, Điều hòa không mát..."
            />
          </el-form-item>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <el-form-item label="Trạng thái" prop="status" required>
            <el-select v-model="form.status" class="!w-full">
              <el-option label="Đang chờ" value="pending" />
              <el-option label="Đang xử lý" value="in_progress" />
              <el-option label="Hoàn thành" value="completed" />
              <el-option label="Đã hủy" value="cancelled" />
            </el-select>
          </el-form-item>
          <el-form-item label="Mức độ ưu tiên" prop="priority" required>
            <el-select v-model="form.priority" class="!w-full">
              <el-option label="Thấp" value="low" />
              <el-option label="Vừa" value="medium" />
              <el-option label="Cao" value="high" />
              <el-option label="Khẩn cấp" value="urgent" />
            </el-select>
          </el-form-item>
          <el-form-item label="Ngày giải quyết" prop="resolved_at">
            <el-date-picker
              v-model="form.resolved_at"
              type="date"
              placeholder="Chọn ngày"
              class="!w-full"
              format="DD/MM/YYYY"
              value-format="DD/MM/YYYY"
            />
          </el-form-item>
        </div>

        <el-form-item label="Mô tả chi tiết sự cố" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="Mô tả cụ thể tình trạng..."
          />
        </el-form-item>

        <el-form-item label="Ghi chú của chủ trọ" prop="admin_note">
          <el-input
            v-model="form.admin_note"
            type="textarea"
            :rows="2"
            placeholder="Ghi chú nội bộ, phương án xử lý..."
          />
        </el-form-item>

        <el-form-item label="Hình ảnh minh chứng">
          <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            multiple
            v-model:file-list="fileList"
            class="theme-upload-v3"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="flex justify-end gap-3 px-4 pb-4 mt-4">
          <el-button @click="dialogVisible = false" class="theme-btn-cancel-v3"
            >Hủy bỏ</el-button
          >
          <el-button
            type="primary"
            :loading="submitting"
            @click="submitRequest"
            class="theme-btn-submit-v3"
          >
            {{ isEdit ? "Cập nhật yêu cầu" : "Ghi nhận bảo trì" }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- View Details Dialog -->
    <el-dialog
      v-model="detailsVisible"
      title="Chi tiết Yêu cầu Bảo trì"
      width="700px"
      class="theme-dialog-v3"
      append-to-body
    >
      <div v-if="selectedRequest" class="flex flex-col gap-8">
        <!-- Main Info -->
        <div class="grid grid-cols-2 gap-8">
          <div class="flex flex-col gap-6">
            <div class="detail-block">
              <label
                class="text-[10px] font-black uppercase tracking-widest text-dim block mb-1"
                >Mã yêu cầu</label
              >
              <p class="text-id font-black text-lg">
                #REQ-{{ selectedRequest.id }}
              </p>
            </div>
            <div class="detail-block">
              <label
                class="text-[10px] font-black uppercase tracking-widest text-dim block mb-1"
                >Người thuê</label
              >
              <div class="flex items-center gap-3">
                <div
                  class="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-xs font-black text-blue-500"
                >
                  {{ getInitials(selectedRequest.tenant?.name || "K") }}
                </div>
                <p class="text-main font-bold">
                  {{
                    selectedRequest.tenant?.name ||
                    "Khách thuê #" + selectedRequest.tenant_id
                  }}
                </p>
              </div>
            </div>
            <div class="detail-block">
              <label
                class="text-[10px] font-black uppercase tracking-widest text-dim block mb-1"
                >Phòng / Tòa nhà</label
              >
              <p class="text-main font-bold">
                Phòng
                {{
                  selectedRequest.room?.room_number ||
                  selectedRequest.room_number
                }}
              </p>
              <p class="text-xs text-dim font-medium">
                {{
                  selectedRequest.room?.building?.name || "Tòa nhà Blue Moon"
                }}
              </p>
            </div>
          </div>

          <div class="flex flex-col gap-6">
            <div class="detail-block">
              <label
                class="text-[10px] font-black uppercase tracking-widest text-dim block mb-1"
                >Trạng thái / Mức độ</label
              >
              <div class="flex flex-wrap gap-2 mt-1">
                <span
                  class="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border"
                  :style="getStatusStyle(selectedRequest.status)"
                >
                  {{ getStatusLabel(selectedRequest.status) }}
                </span>
                <span
                  class="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border"
                  :class="getPriorityClass(selectedRequest.priority)"
                >
                  {{ selectedRequest.priority }}
                </span>
              </div>
            </div>
            <div class="detail-block">
              <label
                class="text-[10px] font-black uppercase tracking-widest text-dim block mb-1"
                >Ngày gửi yêu cầu</label
              >
              <p class="text-main font-bold">
                {{ selectedRequest.created_at || "10/11/2023" }}
              </p>
            </div>
            <div class="detail-block">
              <label
                class="text-[10px] font-black uppercase tracking-widest text-dim block mb-1"
                >Ngày giải quyết</label
              >
              <p
                class="font-bold"
                :class="
                  selectedRequest.resolved_at
                    ? 'text-emerald-500'
                    : 'text-dim italic'
                "
              >
                {{ selectedRequest.resolved_at || "Chưa xử lý" }}
              </p>
            </div>
          </div>
        </div>

        <!-- Subject & Description -->
        <div class="pt-6 border-t border-main">
          <label
            class="text-[10px] font-black uppercase tracking-widest text-dim block mb-3"
            >Chủ đề & Nội dung sự cố</label
          >
          <div class="bg-header p-5 rounded-2xl border border-main">
            <h4 class="text-main font-black mb-2 text-base">
              {{ selectedRequest.title }}
            </h4>
            <p class="text-sm text-dim leading-relaxed italic">
              {{
                selectedRequest.description ||
                "Không có mô tả chi tiết cho yêu cầu này."
              }}
            </p>
          </div>
        </div>

        <!-- Admin Note -->
        <div class="pt-6 border-t border-main">
          <label
            class="text-[10px] font-black uppercase tracking-widest text-dim block mb-3"
            >Ghi chú của chủ trọ</label
          >
          <div class="bg-amber-500/5 p-4 rounded-xl border border-amber-500/20">
            <p class="text-sm text-amber-600/80 font-medium italic">
              {{
                selectedRequest.admin_note ||
                "Chưa có ghi chú xử lý từ chủ trọ."
              }}
            </p>
          </div>
        </div>

        <!-- Images -->
        <div
          v-if="selectedRequest.images && selectedRequest.images.length"
          class="pt-6 border-t border-main"
        >
          <label
            class="text-[10px] font-black uppercase tracking-widest text-dim block mb-4"
            >Hình ảnh đính kèm</label
          >
          <div class="grid grid-cols-4 gap-4">
            <div
              v-for="(img, i) in selectedRequest.images"
              :key="i"
              class="aspect-square rounded-xl overflow-hidden border border-main bg-header"
            >
              <img :src="img.url || img" class="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-3 px-4 pb-4 mt-4">
          <el-button @click="detailsVisible = false" class="theme-btn-cancel-v3"
            >Đóng</el-button
          >
          <el-button
            type="primary"
            class="theme-btn-submit-v3"
            @click="editRequestFromView(selectedRequest)"
          >
            <el-icon class="mr-2"><Edit /></el-icon> Chỉnh sửa yêu cầu
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import {
  Plus,
  Search,
  View,
  ArrowLeft,
  ArrowRight,
  Timer,
  Tools,
  CircleCheck,
  Warning,
  Clock,
  Top,
  Edit,
} from "@element-plus/icons-vue";
import api from "../axios";
import { ElMessage } from "element-plus";

// ========== STATE ==========
const requests = ref([]);
const allRooms = ref([]);
const dialogVisible = ref(false);
const detailsVisible = ref(false);
const isEdit = ref(false);
const submitting = ref(false);
const loading = ref(false);
const formRef = ref(null);
const fileList = ref([]);
const searchQuery = ref("");
const filters = reactive({ status: null, priority: null });
const selectedRequest = ref(null);
const currentPage = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);

const form = reactive({
  id: null,
  room_id: null,
  title: "",
  description: "",
  status: "pending",
  priority: "medium",
  resolved_at: "",
  admin_note: "",
});

const rules = {
  room_id: [
    { required: true, message: "Vui lòng chọn phòng", trigger: "change" },
  ],
  title: [
    { required: true, message: "Vui lòng nhập tiêu đề", trigger: "blur" },
  ],
  description: [
    {
      required: true,
      message: "Vui lòng nhập mô tả chi tiết",
      trigger: "blur",
    },
  ],
  status: [
    { required: true, message: "Vui lòng chọn trạng thái", trigger: "change" },
  ],
  priority: [
    {
      required: true,
      message: "Vui lòng chọn mức độ ưu tiên",
      trigger: "change",
    },
  ],
};

// ========== COMPUTED ==========
const stats = computed(() => {
  return {
    pending: requests.value.filter((r) => r.status === "pending").length,
    in_progress: requests.value.filter((r) => r.status === "in_progress")
      .length,
    completed: requests.value.filter((r) => r.status === "completed").length,
    urgent: requests.value.filter(
      (r) => r.priority === "urgent" || r.priority === "high",
    ).length,
  };
});

const filteredRequests = computed(() => {
  return requests.value.filter((req) => {
    const searchLower = searchQuery.value.toLowerCase();
    const matchesSearch =
      (req.tenant?.name || "").toLowerCase().includes(searchLower) ||
      req.title.toLowerCase().includes(searchLower);
    const matchesStatus = !filters.status || req.status === filters.status;
    const matchesPriority =
      !filters.priority || req.priority === filters.priority;
    return matchesSearch && matchesStatus && matchesPriority;
  });
});

const paginatedRequests = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredRequests.value.slice(start, start + pageSize.value);
});

import { watch } from 'vue';
watch(filteredRequests, (newVal) => {
  totalCount.value = newVal.length;
}, { immediate: true });

// ========== METHODS ==========
const fetchRequests = async () => {
  loading.value = true;
  try {
    const res = await api.get("/maintenance");
    const resData = res.data?.data || res.data || res;
    requests.value = Array.isArray(resData) ? resData : resData?.data || [];
    console.log("Danh sách bảo trì:", requests.value);
  } catch (error) {
    console.error("Lỗi khi tải danh sách bảo trì:", error);
    ElMessage.error("Không thể kết nối API bảo trì");
  } finally {
    loading.value = false;
  }
};

const fetchRooms = async () => {
  try {
    const res = await api.get("/rooms");
    const resData = res.data?.data || res.data || res;
    allRooms.value = Array.isArray(resData) ? resData : resData?.data || [];
  } catch (error) {
    console.error("Lỗi khi tải danh sách phòng:", error);
  }
};

const submitRequest = async () => {
  const valid = await formRef.value.validate().catch(() => false);
  if (!valid) return;

  submitting.value = true;
  try {
    const formData = new FormData();
    formData.append("room_id", form.room_id);
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("priority", form.priority);
    formData.append("status", form.status);
    if (form.admin_note) formData.append("admin_note", form.admin_note);

    // Gửi mảng hình ảnh
    fileList.value.forEach((file) => {
      if (file.raw) {
        formData.append("images[]", file.raw);
      }
    });

    if (isEdit.value) {
      // Backend chưa có route update, tạm thời báo lỗi hoặc giả lập
      ElMessage.warning("Backend hiện chưa hỗ trợ cập nhật yêu cầu bảo trì");
    } else {
      await api.post("/maintenance", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      ElMessage.success("Ghi nhận bảo trì thành công");
    }

    dialogVisible.value = false;
    fetchRequests();
  } catch (error) {
    console.error("Submit error:", error);
    ElMessage.error(error.response?.data?.message || "Lỗi khi gửi yêu cầu");
  } finally {
    submitting.value = false;
  }
};

const getInitials = (name) => {
  if (!name) return "??";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(-2);
};

const getPriorityClass = (p) => {
  const classes = {
    low: "bg-slate-500/10 text-slate-500 border-slate-500/20",
    medium: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    high: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    urgent: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  };
  return classes[p] || classes.medium;
};

const getStatusStyle = (s) => {
  const styles = {
    pending:
      "background-color: rgba(245, 158, 11, 0.1); color: #F59E0B; border-color: rgba(245, 158, 11, 0.2);",
    in_progress:
      "background-color: rgba(59, 130, 246, 0.1); color: #3B82F6; border-color: rgba(59, 130, 246, 0.2);",
    completed:
      "background-color: rgba(16, 185, 129, 0.1); color: #10B981; border-color: rgba(16, 185, 129, 0.2);",
    cancelled:
      "background-color: rgba(239, 68, 68, 0.1); color: #EF4444; border-color: rgba(239, 68, 68, 0.2);",
  };
  return styles[s] || "color: #94A3B8;";
};

const getStatusLabel = (s) => {
  const labels = {
    pending: "ĐANG CHỜ",
    in_progress: "XỬ LÝ",
    completed: "HOÀN TẤT",
    cancelled: "ĐÃ HỦY",
  };
  return labels[s] || s.toUpperCase();
};

const viewDetail = (row) => {
  selectedRequest.value = row;
  detailsVisible.value = true;
};

const openAddModal = () => {
  isEdit.value = false;
  form.id = null;
  form.room_id = null;
  form.title = "";
  form.description = "";
  form.status = "pending";
  form.priority = "medium";
  form.admin_note = "";
  fileList.value = [];
  dialogVisible.value = true;
};

const editRequestFromView = (row) => {
  detailsVisible.value = false;
  isEdit.value = true;
  Object.assign(form, {
    ...row,
    room_id: row.room?.id || row.room_id,
  });
  dialogVisible.value = true;
};

onMounted(() => {
  fetchRequests();
  fetchRooms();
});
</script>

<style>
:root {
  --bg-page: #f8fafc;
  --bg-card: #ffffff;
  --bg-table: #ffffff;
  --bg-header: #f8fafc;
  --text-main: #1e293b;
  --text-dim: #64748b;
  --border-main: #e2e8f0;
  --text-id: #3b82f6;
  --btn-secondary-bg: #f1f5f9;
}

html.dark {
  --bg-page: #0f172a;
  --bg-card: #1e293b;
  --bg-table: #0f172a;
  --bg-header: #1e293b;
  --text-main: #f8fafc;
  --text-dim: #94a3b8;
  --border-main: #334155;
  --text-id: #60a5fa;
  --btn-secondary-bg: #374151;
}
</style>

<style scoped>
.maintenance-page {
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
.text-id {
  color: var(--text-id);
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
.border-main {
  border-color: var(--border-main);
}

.font-inter {
  font-family: "Inter", sans-serif;
}

.stat-card {
  transition: all 0.3s ease;
  backdrop-filter: blur(12px);
}

.card-blue {
  background-color: rgba(59, 130, 246, 0.05) !important;
  border-color: rgba(59, 130, 246, 0.1) !important;
}
.card-amber {
  background-color: rgba(245, 158, 11, 0.05) !important;
  border-color: rgba(245, 158, 11, 0.1) !important;
}
.card-emerald {
  background-color: rgba(16, 185, 129, 0.05) !important;
  border-color: rgba(16, 185, 129, 0.1) !important;
}
.card-rose {
  background-color: rgba(239, 68, 68, 0.05) !important;
  border-color: rgba(239, 68, 68, 0.1) !important;
}

html.dark .card-blue {
  background-color: rgba(59, 130, 246, 0.1) !important;
  border-color: rgba(59, 130, 246, 0.2) !important;
}
html.dark .card-amber {
  background-color: rgba(245, 158, 11, 0.1) !important;
  border-color: rgba(245, 158, 11, 0.2) !important;
}
html.dark .card-emerald {
  background-color: rgba(16, 185, 129, 0.1) !important;
  border-color: rgba(16, 185, 129, 0.2) !important;
}
html.dark .card-rose {
  background-color: rgba(239, 68, 68, 0.1) !important;
  border-color: rgba(239, 68, 68, 0.2) !important;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.2);
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
  border-color: transparent;
}

/* Custom Select Theme */
:deep(.theme-select-v3 .el-input__wrapper) {
  background-color: transparent !important;
  box-shadow: none !important;
  border: 1px solid var(--border-main) !important;
  border-radius: 10px;
  height: 40px;
}
:deep(.theme-select-v3 .el-input__inner) {
  color: var(--text-main) !important;
  font-weight: 600;
  font-size: 13px;
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

:deep(.theme-dialog-v3 .el-input__wrapper),
:deep(.theme-dialog-v3 .el-textarea__inner) {
  background-color: var(--bg-page) !important;
  box-shadow: none !important;
  border: 1px solid var(--border-main) !important;
  border-radius: 12px;
  padding: 10px 12px;
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

:deep(.theme-upload-v3 .el-upload--picture-card) {
  background-color: var(--bg-page);
  border: 2px dashed var(--border-main);
  border-radius: 12px;
}
</style>

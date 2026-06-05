<template>
  <div class="assets-page min-h-full p-6 font-inter">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-black text-main">Quản lý Tài sản</h1>
    </div>

    <!-- Stat Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Total Assets -->
      <div
        class="stat-card card-blue p-6 rounded-2xl border border-main flex flex-col justify-between h-[160px] relative overflow-hidden group"
      >
        <div class="flex justify-between items-start z-10">
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-dim">
            Tổng tài sản
          </p>
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform"
          >
            <el-icon size="20"><Box /></el-icon>
          </div>
        </div>
        <div class="z-10">
          <div class="flex items-baseline gap-2">
            <h2 class="text-4xl font-black text-main">1,284</h2>
            <span class="text-[10px] font-bold text-emerald-500">+12%</span>
          </div>
        </div>
        <div
          class="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity"
        >
          <el-icon size="100"><Box /></el-icon>
        </div>
      </div>

      <!-- New/Good Assets -->
      <div
        class="stat-card card-emerald p-6 rounded-2xl border border-main flex flex-col justify-between h-[160px] group"
      >
        <div class="flex justify-between items-start">
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-dim">
            Tài sản mới/tốt
          </p>
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform"
          >
            <el-icon size="20"><CircleCheck /></el-icon>
          </div>
        </div>
        <div>
          <div class="flex items-baseline gap-2">
            <h2 class="text-4xl font-black text-main">942</h2>
            <span class="text-[10px] font-bold text-dim">73%</span>
          </div>
        </div>
      </div>

      <!-- Maintenance Needed -->
      <div
        class="stat-card card-amber p-6 rounded-2xl border border-main flex flex-col justify-between h-[160px] group"
      >
        <div class="flex justify-between items-start">
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-dim">
            Cần bảo trì
          </p>
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-500/10 text-amber-500 group-hover:scale-110 transition-transform"
          >
            <el-icon size="20"><Tools /></el-icon>
          </div>
        </div>
        <div>
          <div class="flex items-baseline gap-2">
            <h2 class="text-4xl font-black text-main">215</h2>
            <span class="text-[10px] font-bold text-dim">Trung bình/Kém</span>
          </div>
        </div>
      </div>

      <!-- Broken Assets -->
      <div
        class="stat-card card-rose p-6 rounded-2xl border border-main flex flex-col justify-between h-[160px] group"
      >
        <div class="flex justify-between items-start">
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-dim">
            Tài sản hỏng
          </p>
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center bg-rose-500/10 text-rose-500 group-hover:scale-110 transition-transform"
          >
            <el-icon size="20"><CircleClose /></el-icon>
          </div>
        </div>
        <div>
          <div class="flex items-baseline gap-2">
            <h2 class="text-4xl font-black text-main">127</h2>
            <span class="text-[10px] font-bold text-dim">Ngừng sử dụng</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter Bar -->
    <div
      class="flex items-center gap-4 mb-6 bg-card/40 p-2 rounded-2xl border border-main"
    >
      <div class="flex items-center gap-2 pl-4 border-r border-main pr-4">
        <span
          class="text-[10px] font-black uppercase text-dim whitespace-nowrap"
          >Tòa nhà:</span
        >
        <el-select
          v-model="filters.building_id"
          placeholder="Tất cả tòa nhà"
          class="theme-select-mini"
          style="width: 160px"
        >
          <el-option label="Tất cả tòa nhà" :value="null" />
          <el-option
            v-for="b in buildings"
            :key="b.id"
            :label="b.name"
            :value="b.id"
          />
        </el-select>
      </div>
      <div class="flex items-center gap-2 border-r border-main pr-4">
        <span
          class="text-[10px] font-black uppercase text-dim whitespace-nowrap"
          >Phòng:</span
        >
        <el-select
          v-model="filters.room_id"
          placeholder="Tất cả phòng"
          class="theme-select-mini"
          style="width: 150px"
        >
          <el-option label="Tất cả phòng" :value="null" />
          <el-option
            v-for="r in rooms"
            :key="r.id"
            :label="`Phòng ${r.room_number}`"
            :value="r.id"
          />
        </el-select>
      </div>
      <div class="flex items-center gap-2 border-r border-main pr-4">
        <span
          class="text-[10px] font-black uppercase text-dim whitespace-nowrap"
          >Tình trạng:</span
        >
        <el-select
          v-model="filters.condition"
          placeholder="Tất cả tình trạng"
          class="theme-select-mini"
          style="width: 180px"
        >
          <el-option label="Tất cả tình trạng" :value="null" />
          <el-option label="Mới" value="new" />
          <el-option label="Tốt" value="good" />
          <el-option label="Trung bình" value="fair" />
          <el-option label="Kém" value="poor" />
          <el-option label="Hỏng" value="broken" />
        </el-select>
      </div>
      <div class="flex-grow relative flex items-center">
        <el-icon class="absolute left-4 text-dim"><Search /></el-icon>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Tìm kiếm tài sản..."
          class="w-full bg-transparent border-none outline-none pl-12 text-sm text-main placeholder:text-dim font-medium"
        />
      </div>
      <button
        class="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-105 hover:bg-blue-500 hover:shadow-lg active:scale-95 bg-blue-600 shadow-lg shadow-blue-500/20"
        @click="showCreateDialog"
      >
        <el-icon><Plus /></el-icon>
        Thêm tài sản
      </button>
    </div>

    <!-- Table Section -->
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
                Tên tài sản
              </th>
              <th
                class="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-dim"
              >
                Loại tài sản
              </th>
              <th
                class="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-dim"
              >
                Phòng
              </th>
              <th
                class="px-6 py-5 text-center text-[11px] font-black uppercase tracking-widest text-dim"
              >
                Tình trạng
              </th>
              <th
                class="px-6 py-5 text-right text-[11px] font-black uppercase tracking-widest text-dim"
              >
                Giá mua
              </th>
              <th
                class="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-dim"
              >
                Mô tả
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
              v-for="(row, index) in paginatedAssets"
              :key="row.id"
              class="table-row-hover transition-colors border-b last:border-0 border-main"
            >
              <td class="px-6 py-5">
                <span class="font-bold text-xs text-id"
                  >#TS-{{ String(row.id).padStart(4, "0") }}</span
                >
              </td>
              <td class="px-6 py-5">
                <span class="text-main font-bold text-sm">{{ row.name }}</span>
              </td>
              <td class="px-6 py-5">
                <span class="text-dim font-medium">{{ row.category }}</span>
              </td>
              <td class="px-6 py-5">
                <div class="flex flex-col">
                  <span class="text-main font-bold text-sm">{{
                    row.room?.room_number || "Kho tổng"
                  }}</span>
                  <span
                    v-if="row.room?.building?.name"
                    class="text-[10px] font-bold text-dim"
                    style="font-size: 13px"
                    >{{ row.room.building.name }}</span
                  >
                </div>
              </td>
              <td class="px-6 py-5 text-center">
                <span
                  class="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                  :style="getConditionStyle(row.condition)"
                >
                  {{ getConditionLabel(row.condition) }}
                </span>
              </td>
              <td class="px-6 py-5 text-right font-black text-main opacity-80">
                {{ formatPrice(row.purchase_price) }}
              </td>
              <td class="px-6 py-5">
                <p
                  class="text-xs text-dim line-clamp-1 max-w-[200px]"
                  :title="row.description"
                >
                  {{ row.description || "Chưa có mô tả" }}
                </p>
              </td>
              <td class="px-6 py-5 text-center">
                <div class="flex items-center justify-center gap-3">
                  <button
                    class="action-btn btn-edit"
                    title="Chỉnh sửa"
                    @click="editAsset(row)"
                  >
                    <el-icon size="16"><Edit /></el-icon>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer Info & Pagination -->
      <div
        class="px-6 py-4 flex items-center justify-between bg-header border-t border-main"
      >
        <span class="text-[11px] font-bold text-dim uppercase tracking-widest">
          Tổng cộng
          <span class="text-main">{{ totalCount }}</span> tài sản
        </span>
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

    <!-- ===== ADD/EDIT ASSET DIALOG ===== -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? 'Cập nhật Thông tin Tài sản' : 'Tiếp nhận Tài sản mới'"
      width="90%" style="max-width: 750px"
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
        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="Tên tài sản" prop="name" required>
            <el-input v-model="form.name" placeholder="Tên thiết bị..." />
          </el-form-item>
          <el-form-item label="Loại tài sản" prop="category" required>
            <el-select v-model="form.category" class="!w-full">
              <el-option label="Điện tử / Điện lạnh" value="Điện tử" />
              <el-option label="Nội thất" value="Nội thất" />
              <el-option label="Gia dụng" value="Gia dụng" />
              <el-option label="Khác" value="Khác" />
            </el-select>
          </el-form-item>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="Tên tòa nhà" prop="building_name" required>
            <el-input v-model="form.building_name" placeholder="Tòa nhà A..." />
          </el-form-item>
          <el-form-item label="Mã phòng trang bị" prop="room_number" required>
            <el-input v-model="form.room_number" placeholder="P.101..." />
          </el-form-item>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="Tình trạng" prop="condition" required>
            <el-select v-model="form.condition" class="!w-full">
              <el-option label="Mới" value="new" />
              <el-option label="Tốt" value="good" />
              <el-option label="Trung bình" value="fair" />
              <el-option label="Kém" value="poor" />
              <el-option label="Hỏng" value="broken" />
            </el-select>
          </el-form-item>
          <el-form-item label="Giá mua (VNĐ)" prop="purchase_price" required>
            <el-input
              v-model.number="form.purchase_price"
              placeholder="Giá trị..."
            >
              <template #append>đ</template>
            </el-input>
          </el-form-item>
        </div>

        <el-form-item label="Mô tả chi tiết" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="Thông số kỹ thuật, ghi chú bảo hành..."
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="flex justify-end gap-3 px-4 pb-4 mt-4">
          <el-button @click="dialogVisible = false" class="theme-btn-cancel-v3"
            >Hủy bỏ</el-button
          >
          <el-button
            type="primary"
            @click="submitForm"
            class="theme-btn-submit-v3"
          >
            {{ isEdit ? "Lưu thay đổi" : "Lưu thông tin tài sản" }}
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
  Tools,
  CircleCheck,
  CircleClose,
  Search,
  Plus,
  View,
  Edit,
  Delete,
  Bell,
  QuestionFilled,
  Warning,
  ArrowLeft,
  ArrowRight,
  Top,
  Bottom,
  Wallet,
} from "@element-plus/icons-vue";

// ========== MOCK DATA ==========
const mockAssets = [
  {
    id: 1029,
    name: "Điều hòa Daikin 1.5HP",
    category: "Điện lạnh",
    room: {
      id: 201,
      room_number: "Phòng 201",
      building: { id: 1, name: "Tòa nhà A - Mỹ Đình" },
    },
    condition: "new",
    purchase_price: 12500000,
    description: "Bảo hành chính hãng 2 năm...",
  },
  {
    id: 1035,
    name: "Tủ lạnh Samsung 200L",
    category: "Gia dụng",
    room: {
      id: 104,
      room_number: "Phòng 104",
      building: { id: 2, name: "Tòa nhà B - Cầu Giấy" },
    },
    condition: "good",
    purchase_price: 7200000,
    description: "Mới mua từ tháng 01/2023",
  },
  {
    id: 982,
    name: "Máy nước nóng Ariston",
    category: "Điện dân dụng",
    room: {
      id: 302,
      room_number: "Phòng 302",
      building: { id: 1, name: "Tòa nhà A - Mỹ Đình" },
    },
    condition: "fair",
    purchase_price: 3500000,
    description: "Cần vệ sinh lọc nước định kỳ",
  },
  {
    id: 1144,
    name: "Nệm Vạn Thành 1m8",
    category: "Nội thất",
    room: {
      id: 405,
      room_number: "Phòng 405",
      building: { id: 3, name: "Sunrise Tower" },
    },
    condition: "poor",
    purchase_price: 4800000,
    description: "Có vết ố, lò xo hơi yếu",
  },
  {
    id: 741,
    name: "Bếp hồng ngoại Sunhouse",
    category: "Gia dụng",
    room: null,
    condition: "broken",
    purchase_price: 1200000,
    description: "Vỡ mặt kính, không lên nguồn",
  },
];

const maintenanceHistory = [
  {
    title: "Thay vòi sen - Phòng 101",
    description: "Hoàn thành bởi: Nguyễn Văn A • 2 giờ trước",
    time: "MỚI",
  },
  {
    title: "Vệ sinh máy lạnh - Phòng 305",
    description: "Đang xử lý • Dự kiến xong lúc 15:00",
    time: "14:30",
  },
  {
    title: "Kiểm tra đường điện - Tòa nhà B",
    description: "Đã trễ hạn • Cần nhân viên kỹ thuật gấp",
    time: "HÔM QUA",
  },
];

// ========== STATE ==========
const assets = ref(mockAssets);
const buildings = ref([]);
const rooms = ref([]);
const loading = ref(false);
const dialogVisible = ref(false);
const isEdit = ref(false);
const formRef = ref(null);
const searchQuery = ref("");
const currentPage = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);

const filters = reactive({ building_id: null, room_id: null, condition: null });
const form = reactive({
  name: "",
  category: "",
  condition: "new",
  room_id: null,
  room_number: "",
  building_name: "",
  description: "",
  purchase_price: 0,
});

const rules = {
  name: [
    { required: true, message: "Vui lòng nhập tên tài sản", trigger: "blur" },
  ],
  category: [
    {
      required: true,
      message: "Vui lòng chọn loại tài sản",
      trigger: "change",
    },
  ],
  building_name: [
    { required: true, message: "Vui lòng nhập tên tòa nhà", trigger: "blur" },
  ],
  room_number: [
    { required: true, message: "Vui lòng nhập mã phòng", trigger: "blur" },
  ],
  condition: [
    { required: true, message: "Vui lòng chọn tình trạng", trigger: "change" },
  ],
  purchase_price: [
    { required: true, message: "Vui lòng nhập giá mua", trigger: "blur" },
  ],
};

// ========== COMPUTED ==========
const filteredAssets = computed(() => {
  return assets.value.filter((a) => {
    const matchesSearch = a.name
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());
    const matchesCondition =
      !filters.condition || a.condition === filters.condition;
    const matchesBuilding =
      !filters.building_id || a.room?.building?.id === filters.building_id;
    const matchesRoom =
      !filters.room_id || (a.room?.id || a.room_id) === filters.room_id;
    return matchesSearch && matchesCondition && matchesBuilding && matchesRoom;
  });
});

const paginatedAssets = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredAssets.value.slice(start, start + pageSize.value);
});

import { watch } from 'vue';
watch(filteredAssets, (newVal) => {
  totalCount.value = newVal.length;
}, { immediate: true });

// ========== METHODS ==========
const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price || 0);
};

const getConditionLabel = (condition) => {
  const labels = {
    new: "Mới",
    good: "Tốt",
    fair: "Trung bình",
    poor: "Kém",
    broken: "Hỏng",
  };
  return labels[condition] || condition;
};

const getConditionStyle = (condition) => {
  const styles = {
    new: "background-color: rgba(16, 185, 129, 0.1); color: #10B981;",
    good: "background-color: rgba(16, 185, 129, 0.1); color: #10B981;",
    fair: "background-color: rgba(245, 158, 11, 0.1); color: #F59E0B;",
    poor: "background-color: rgba(239, 68, 68, 0.1); color: #EF4444;",
    broken: "background-color: rgba(239, 68, 68, 0.1); color: #EF4444;",
  };
  return (
    styles[condition] ||
    "background-color: rgba(156, 163, 175, 0.1); color: #9CA3AF;"
  );
};

const fetchData = async () => {
  loading.value = true;
  try {
    const response = await api.get("/assets", {
      params: { page: currentPage.value, per_page: pageSize.value },
    });
    if (response && Array.isArray(response.items)) {
      assets.value = response.items;
      totalCount.value = response.total;
    }
  } catch (error) {
    // Fail silently to keep mock
  } finally {
    loading.value = false;
  }
};

const fetchRooms = async () => {
  try {
    const response = await api.get("/rooms", { params: { per_page: 100 } });
    if (response && Array.isArray(response.items)) rooms.value = response.items;
  } catch (error) {
    console.error("Failed to load rooms");
  }
};

const fetchBuildings = async () => {
  try {
    const response = await api.get("/buildings");
    if (response && Array.isArray(response.items)) buildings.value = response.items;
  } catch (error) {
    buildings.value = [
      { id: 1, name: "Tòa nhà A - Mỹ Đình" },
      { id: 2, name: "Tòa nhà B - Cầu Giấy" },
      { id: 3, name: "Sunrise Tower" },
    ];
  }
};

const showCreateDialog = () => {
  isEdit.value = false;
  Object.assign(form, {
    name: "",
    category: "Điện tử",
    condition: "new",
    room_id: null,
    room_number: "",
    building_name: "",
    description: "",
    purchase_price: 0,
  });
  dialogVisible.value = true;
};

const editAsset = (asset) => {
  isEdit.value = true;
  Object.assign(form, {
    ...asset,
    room_id: asset.room?.id || asset.room_id,
    room_number: asset.room?.room_number || "",
    building_name: asset.room?.building?.name || "",
  });
  dialogVisible.value = true;
};

const submitForm = async () => {
  const valid = await formRef.value.validate().catch(() => false);
  if (!valid) return;
  
  try {
    if (isEdit.value) {
      await api.put(`/assets/${form.id}`, form);
      ElMessage.success("Cập nhật thành công");
    } else {
      await api.post("/assets", form);
      ElMessage.success("Thêm mới thành công");
    }
    dialogVisible.value = false;
    fetchData();
  } catch (error) {
    ElMessage.error("Lỗi khi lưu dữ liệu");
  }
};

const deleteAsset = async (asset) => {
  try {
    await ElMessageBox.confirm("Xóa tài sản này khỏi hệ thống?", "Cảnh báo", {
      type: "warning",
    });
    await api.delete(`/assets/${asset.id}`);
    ElMessage.success("Xóa thành công");
    fetchData();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error("Lỗi khi xóa tài sản");
    }
  }
};

onMounted(() => {
  fetchData();
  fetchRooms();
  fetchBuildings();
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
  --bg-page: #0f172a;
  --bg-card: #1e293b;
  --bg-table: #0f172a;
  --bg-header: #1e293b;
  --bg-input: #1f2937;
  --text-main: #f8fafc;
  --text-dim: #94a3b8;
  --border-main: #334155;
  --text-id: #60a5fa;
}
</style>

<style scoped>
.assets-page {
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
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
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

.stat-card {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
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
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
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

/* Custom Select Theme */
.theme-select-mini :deep(.el-input__wrapper) {
  background-color: transparent !important;
  box-shadow: none !important;
  border: none !important;
  padding: 0 !important;
}
.theme-select-mini :deep(.el-input__inner) {
  color: var(--text-main) !important;
  font-weight: 800;
  font-size: 11px;
  text-transform: uppercase;
}

/* Dialog Theme */
:deep(.theme-dialog-custom .el-dialog) {
  background-color: var(--bg-card) !important;
  border-radius: 24px;
  border: 1px solid var(--border-main);
  overflow: hidden;
}
:deep(.theme-dialog-custom .el-dialog__title) {
  color: var(--text-main) !important;
  font-weight: 900;
}
:deep(.theme-dialog-custom .el-form-item__label) {
  color: var(--text-dim) !important;
  font-weight: 900;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
}
:deep(.theme-dialog-custom .el-input__wrapper),
:deep(.theme-dialog-custom .el-textarea__inner) {
  background-color: var(--bg-page) !important;
  box-shadow: none !important;
  border: 1px solid var(--border-main) !important;
  color: var(--text-main) !important;
}

.theme-btn-secondary {
  background-color: var(--bg-page) !important;
  border: 1px solid var(--border-main) !important;
  color: var(--text-main) !important;
  border-radius: 12px !important;
  font-weight: bold !important;
}

.theme-btn-primary {
  background-color: #2563eb !important;
  border: none !important;
  color: #fff !important;
  border-radius: 12px !important;
  font-weight: bold !important;
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

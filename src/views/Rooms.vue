<template>
  <div
    class="rooms-container min-h-full p-6 bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-inter"
  >
    <!-- 1. Toolbar & Filters -->
    <div
      class="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 mb-8 flex flex-wrap items-center justify-between gap-4"
    >
      <div class="flex items-center gap-4">
        <div class="flex flex-col">
          <label
            class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1"
            >Tòa nhà</label
          >
          <el-select
            v-model="activeBuilding"
            placeholder="Chọn tòa nhà"
            class="custom-select-v3"
          >
            <el-option
              v-for="b in buildings"
              :key="b.id"
              :label="b.name"
              :value="b.id"
            />
          </el-select>
        </div>

        <div class="flex flex-col">
          <label
            class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1"
            >Tầng</label
          >
          <el-select
            v-model="selectedFloor"
            placeholder="Tất cả tầng"
            clearable
            class="custom-select-v3"
          >
            <el-option
              v-for="f in floors"
              :key="f"
              :label="`Tầng ${f}`"
              :value="f"
            />
          </el-select>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <el-button
          type="primary"
          class="!rounded-xl !h-10 px-6 font-bold shadow-lg shadow-blue-100 dark:shadow-none hover:scale-105 transition-all"
          style="background-color: #3b82f6; border-color: #3b82f6"
          @click="showCreateDialog"
        >
          <el-icon class="mr-2"><Plus /></el-icon> Thêm phòng
        </el-button>
      </div>
    </div>

    <!-- 2. Status Legend & Quick Stats -->
    <div class="flex flex-wrap items-center justify-between gap-6 mb-8 px-2">
      <div class="flex items-center gap-6">
        <div
          class="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400"
        >
          <span class="w-3 h-3 rounded-full bg-[#10b981]"></span> Trống
        </div>
        <div
          class="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400"
        >
          <span class="w-3 h-3 rounded-full bg-[#3b82f6]"></span> Đã thuê
        </div>
        <div
          class="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400"
        >
          <span class="w-3 h-3 rounded-full bg-[#ef4444]"></span> Nợ tiền
        </div>
        <div
          class="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400"
        >
          <span class="w-3 h-3 rounded-full bg-[#facc15]"></span> Đặt cọc
        </div>
        <div
          class="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400"
        >
          <span class="w-3 h-3 rounded-full bg-[#94a3b8]"></span> Bảo trì
        </div>
      </div>

      <div class="text-sm font-bold text-slate-600 dark:text-slate-300">
        Tổng số: <span class="text-primary">{{ rooms.length }}</span> phòng
      </div>
    </div>

    <!-- 3. Main Grid Grouped by Floor -->
    <div v-loading="loading" class="space-y-12">
      <div v-for="floor in sortedFloors" :key="floor" class="space-y-6">
        <div class="flex items-center gap-4">
          <h3
            class="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]"
          >
            Tầng {{ floor }}
          </h3>
          <div class="h-[1px] flex-1 bg-slate-200 dark:bg-slate-700"></div>
        </div>

        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
        >
          <!-- Room Card Component -->
          <div
            v-for="room in getRoomsByFloor(floor)"
            :key="room.id"
            class="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
            @click="openRoomDetail(room)"
          >
            <!-- Status Indicator Line -->
            <div
              class="absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl"
              :style="{ backgroundColor: getStatusColor(room.status) }"
            ></div>

            <!-- Room Header -->
            <div class="flex justify-between items-start mb-6 mt-2">
              <div>
                <h4
                  class="text-xl font-black text-slate-800 dark:text-white group-hover:text-primary transition-colors"
                >
                  {{ room.room_number }}
                </h4>
                <p
                  class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-1"
                >
                  {{ room.room_type || "Phòng tiêu chuẩn" }}
                </p>
              </div>
            </div>

            <!-- Room Body -->
            <div class="space-y-4 mb-6">
              <div class="flex items-center gap-3">
                <div
                  class="w-9 h-9 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center border border-slate-100 dark:border-slate-600"
                >
                  <el-icon class="text-slate-400"><User /></el-icon>
                </div>
                <div>
                  <p
                    class="text-sm font-bold text-slate-700 dark:text-slate-200 truncate max-w-[120px]"
                  >
                    {{
                      room.tenant_name ||
                      (room.status === "empty" ? "Đang trống" : "---")
                    }}
                  </p>
                  <p class="text-[10px] text-slate-400 font-medium">
                    Khách thuê
                  </p>
                </div>
              </div>

              <div
                class="flex items-center justify-between text-slate-600 dark:text-slate-400"
              >
                <span class="text-xs flex items-center gap-1.5"
                  ><el-icon><Wallet /></el-icon>
                  {{ formatPrice(room.price) }}</span
                >
                <span
                  class="text-xs font-bold flex items-center gap-1"
                  v-if="
                    room.status !== 'empty' && room.status !== 'maintenance'
                  "
                  ><el-icon><UserFilled /></el-icon> 2/3</span
                >
              </div>
            </div>

            <!-- Quick Actions Footer -->
            <div
              class="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-700"
            >
              <span
                class="text-[10px] font-black uppercase tracking-tight"
                :style="{ color: getStatusColor(room.status) }"
              >
                {{ getStatusLabel(room.status) }}
              </span>
              <div
                class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <button
                  class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-blue-600 text-slate-500 dark:text-slate-300 transition-colors flex items-center justify-center"
                  title="Lập hóa đơn"
                >
                  <el-icon><Document /></el-icon>
                </button>
                <button
                  class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-blue-600 text-slate-500 dark:text-slate-300 transition-colors flex items-center justify-center"
                  title="Chỉnh sửa"
                >
                  <el-icon><EditPen /></el-icon>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Dialog Thêm phòng -->
  <el-dialog
    v-model="dialogVisible"
    title="Thêm phòng mới"
    width="550px"
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
          <el-select v-model="form.building_id" class="!w-full">
            <el-option
              v-for="b in buildings"
              :key="b.id"
              :label="b.name"
              :value="b.id"
            />
          </el-select>
        </el-form-item>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <el-form-item label="Mã phòng" prop="room_number" required>
          <el-input
            v-model="form.room_number"
            placeholder="Ví dụ: 101, 202..."
          />
        </el-form-item>
        <el-form-item label="Tầng" prop="floor" required>
          <el-input-number v-model="form.floor" :min="1" class="!w-full" />
        </el-form-item>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <el-form-item label="Giá phòng" prop="price" required>
          <el-input v-model.number="form.price" placeholder="Ví dụ: 3000000">
            <template #append>VNĐ</template>
          </el-input>
        </el-form-item>
        <el-form-item label="Trạng thái phòng" prop="status" required>
          <el-select v-model="form.status" class="!w-full">
            <el-option label="Trống" value="empty" />
            <el-option label="Đang thuê" value="rented" />
            <el-option label="Bảo trì" value="maintenance" />
            <el-option label="Đặt cọc" value="deposit" />
          </el-select>
        </el-form-item>
      </div>

      <el-form-item label="Mô tả phòng" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="3"
          placeholder="Nhập các đặc điểm hoặc ghi chú về phòng..."
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="flex justify-end gap-3 px-4 pb-4 mt-4">
        <el-button @click="dialogVisible = false" class="theme-btn-cancel"
          >Hủy bỏ</el-button
        >
        <el-button type="primary" @click="submitForm" class="theme-btn-submit">
          Tạo phòng ngay
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import api from "../axios";
import {
  Plus,
  Refresh,
  User,
  UserFilled,
  Wallet,
  InfoFilled,
  Warning,
  Document,
  EditPen,
} from "@element-plus/icons-vue";

const buildings = ref([]);
const rooms = ref([]);
const activeBuilding = ref(null);
const selectedFloor = ref(null);
const loading = ref(false);
const dialogVisible = ref(false);
const formRef = ref(null);

const rules = {
  building_id: [
    { required: true, message: "Vui lòng chọn tòa nhà", trigger: "change" },
  ],
  room_number: [
    { required: true, message: "Vui lòng nhập mã phòng", trigger: "blur" },
  ],
  floor: [{ required: true, message: "Vui lòng nhập tầng", trigger: "blur" }],
  price: [
    { required: true, message: "Vui lòng nhập giá phòng", trigger: "blur" },
  ],
  status: [
    { required: true, message: "Vui lòng chọn trạng thái", trigger: "change" },
  ],
};

const form = ref({
  building_id: null,
  room_number: "",
  floor: 1,
  price: null,
  status: "empty",
  description: "",
});

const floors = computed(() => {
  if (!activeBuilding.value) return [];
  const floorSet = new Set(
    rooms.value
      .filter((r) => r.building_id === activeBuilding.value)
      .map((r) => r.floor)
      .filter(Boolean),
  );
  return Array.from(floorSet).sort((a, b) => a - b);
});

const sortedFloors = computed(() => {
  if (selectedFloor.value) return [selectedFloor.value];
  return floors.value;
});

const getRoomsByFloor = (floor) => {
  return rooms.value
    .filter((r) => r.building_id === activeBuilding.value && r.floor === floor)
    .sort((a, b) => a.room_number.localeCompare(b.room_number));
};

const getStatusColor = (status) => {
  const colors = {
    empty: "#10b981",
    rented: "#3b82f6",
    overdue: "#ef4444",
    maintenance: "#94a3b8",
    deposit: "#facc15",
  };
  return colors[status] || "#94a3b8";
};

const getStatusLabel = (status) => {
  const labels = {
    empty: "Phòng trống",
    rented: "Đã thuê",
    overdue: "Nợ tiền",
    maintenance: "Bảo trì",
    deposit: "Đặt cọc",
  };
  return labels[status] || "Không xác định";
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
};

const fetchBuildings = async () => {
  try {
    const response = await api.get("/buildings");
    buildings.value = response.data.data;
  } catch (error) {
    console.error("Fetch error, using mock data");
    buildings.value = [{ id: 1, name: "Tòa nhà chính" }];
  } finally {
    if (buildings.value.length > 0 && !activeBuilding.value) {
      activeBuilding.value = buildings.value[0].id;
    }
  }
};

const fetchRooms = async () => {
  loading.value = true;
  try {
    const response = await api.get("/rooms");
    rooms.value = response.data.data;
  } catch (error) {
    console.error("Fetch error, using mock data");
    rooms.value = [
      {
        id: 1,
        building_id: 1,
        room_number: "101",
        floor: 1,
        status: "overdue",
        tenant_name: "Nguyễn Văn A",
        price: 3500000,
      },
      {
        id: 2,
        building_id: 1,
        room_number: "102",
        floor: 1,
        status: "empty",
        tenant_name: null,
        price: 3000000,
      },
      {
        id: 3,
        building_id: 1,
        room_number: "103",
        floor: 1,
        status: "rented",
        tenant_name: "Trần Thị B",
        price: 3200000,
      },
      {
        id: 4,
        building_id: 1,
        room_number: "201",
        floor: 2,
        status: "rented",
        tenant_name: "Lê Văn C",
        price: 3000000,
      },
      {
        id: 5,
        building_id: 1,
        room_number: "202",
        floor: 2,
        status: "maintenance",
        tenant_name: null,
        price: 3000000,
      },
      {
        id: 6,
        building_id: 1,
        room_number: "203",
        floor: 2,
        status: "empty",
        tenant_name: null,
        price: 3000000,
      },
    ];
  } finally {
    loading.value = false;
  }
};

const openRoomDetail = (room) => {
  console.log("Room clicked:", room);
};

const showCreateDialog = () => {
  form.value = {
    building_id: activeBuilding.value,
    room_number: "",
    floor: 1,
    price: null,
    status: "empty",
    description: "",
  };
  dialogVisible.value = true;
};

const submitForm = async () => {
  const valid = await formRef.value.validate().catch(() => false);
  if (!valid) return;
  console.log("Submit room:", form.value);
  // Thực hiện gọi API thêm phòng ở đây
  dialogVisible.value = false;
  ElMessage.success("Tạo phòng thành công");
};

onMounted(async () => {
  await Promise.all([fetchBuildings(), fetchRooms()]);
});
</script>

<style scoped>
.custom-select-v3 {
  width: 160px;
}

.custom-select-v3 :deep(.el-input__wrapper) {
  background-color: #f8fafc !important;
  border-radius: 10px;
  height: 40px;
  box-shadow: none !important;
  border: 1px solid #e2e8f0 !important;
}

.custom-select-v3 :deep(.el-input__inner) {
  color: #1e293b !important;
  font-weight: 700 !important;
  font-family: "Inter", sans-serif;
}

:deep(.dark) .custom-select-v3 :deep(.el-input__wrapper) {
  background-color: #1e293b !important;
  border-color: #334155 !important;
}

:deep(.dark) .custom-select-v3 :deep(.el-input__inner) {
  color: #ffffff !important;
}

:deep(.el-select__placeholder) {
  color: #94a3b8 !important;
}

.font-inter {
  font-family: "Inter", sans-serif;
}

/* Dialog Theme Customization */
:deep(.theme-dialog-v3) {
  border-radius: 24px;
  overflow: hidden;
  background-color: #ffffff;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
}

:deep(.dark) :deep(.theme-dialog-v3) {
  background-color: #1e293b !important;
  border: 1px solid #334155;
}

:deep(.theme-dialog-v3 .el-dialog__header) {
  padding: 24px 32px;
  margin-right: 0;
  border-bottom: 1px solid #f1f5f9;
}

:deep(.dark) :deep(.theme-dialog-v3 .el-dialog__header) {
  border-bottom-color: #334155;
}

:deep(.theme-dialog-v3 .el-dialog__title) {
  font-weight: 900;
  font-size: 1.25rem;
  color: #1e293b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

:deep(.dark) :deep(.theme-dialog-v3 .el-dialog__title) {
  color: #ffffff;
}

:deep(.theme-dialog-v3 .el-dialog__body) {
  padding: 32px;
}

:deep(.theme-dialog-v3 .el-form-item__label) {
  font-weight: 800;
  color: #64748b;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
}

:deep(.dark) :deep(.theme-dialog-v3 .el-form-item__label) {
  color: #94a3b8;
}

:deep(.theme-dialog-v3 .el-input__wrapper) {
  background-color: #f8fafc !important;
  box-shadow: none !important;
  border: 1px solid #e2e8f0 !important;
  border-radius: 12px;
  padding: 8px 12px;
}

:deep(.dark) :deep(.theme-dialog-v3 .el-input__wrapper) {
  background-color: #0f172a !important;
  border-color: #334155 !important;
}

:deep(.theme-dialog-v3 .el-input__inner) {
  font-weight: 600;
  color: #1e293b;
}

:deep(.dark) :deep(.theme-dialog-v3 .el-input__inner) {
  color: #ffffff;
}

.theme-btn-cancel {
  border-radius: 12px;
  height: 44px;
  padding: 0 24px;
  font-weight: 700;
  border: 1px solid #e2e8f0;
  background: transparent;
  color: #64748b;
}

.dark .theme-btn-cancel {
  border-color: #334155;
  color: #94a3b8;
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

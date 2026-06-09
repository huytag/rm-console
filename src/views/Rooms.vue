<template>
  <div
    class="rooms-container min-h-full p-6 bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-inter"
  >
    <!-- 1. Toolbar & Filters -->
    <div
      class="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 mb-8 flex flex-wrap items-center justify-between gap-4"
    >
      <div class="flex items-center gap-4 w-full sm:w-auto">
        <div class="flex flex-col flex-1 sm:flex-none">
          <label
            class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1"
            >Tòa nhà</label
          >
          <el-select
            v-model="activeBuilding"
            placeholder="Chọn tòa nhà"
            class="custom-select-v3 !w-full sm:!w-[160px]"
            @change="fetchRooms"
          >
            <el-option
              v-for="b in buildings"
              :key="b.id"
              :label="b.name"
              :value="b.id"
            />
          </el-select>
        </div>

        <div class="flex flex-col flex-1 sm:flex-none">
          <label
            class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1"
            >Tầng</label
          >
          <el-select
            v-model="selectedFloor"
            placeholder="Tất cả tầng"
            clearable
            class="custom-select-v3 !w-full sm:!w-[160px]"
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

      <div class="flex items-center gap-3 w-full sm:w-auto">
        <el-button
          type="primary"
          class="!rounded-xl !h-10 px-6 font-bold shadow-lg shadow-blue-100 dark:shadow-none hover:scale-105 transition-all w-full sm:w-auto"
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
          <span class="w-3 h-3 rounded-full bg-[#94a3b8]"></span> Bảo trì
        </div>
      </div>

      <div class="text-sm font-bold text-slate-600 dark:text-slate-300">
        Tổng số: <span class="text-primary">{{ filteredRooms.length }}</span> phòng
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

        <div class="flex flex-col gap-4">
          <!-- Room Row Component -->
          <div
            v-for="room in getRoomsByFloor(floor)"
            :key="room.id"
            class="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 transition-all duration-300 hover:shadow-md cursor-pointer flex flex-col md:flex-row items-start md:items-center gap-6"
            @click="openRoomDetail(room)"
          >
            <!-- Status Indicator Line (Left Edge) -->
            <div
              class="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl hidden md:block"
              :style="{ backgroundColor: getStatusColor(room.status) }"
            ></div>
            <div
              class="absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl md:hidden"
              :style="{ backgroundColor: getStatusColor(room.status) }"
            ></div>

            <!-- Room Header -->
            <div class="flex-shrink-0 md:w-40 md:pl-4">
              <h4
                class="text-xl font-black text-slate-800 dark:text-white group-hover:text-primary transition-colors"
              >
                {{ room.room_number }}
              </h4>
            </div>

            <!-- Tenant Info -->
            <div class="flex-1 flex items-center gap-4 w-full md:w-auto">
              <div
                class="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center border border-slate-100 dark:border-slate-600 shrink-0"
              >
                <el-icon class="text-slate-400"><User /></el-icon>
              </div>
              <div>
                <p
                  class="text-sm font-bold text-slate-700 dark:text-slate-200 truncate max-w-[200px]"
                >
                  {{
                    room.current_tenant?.name ||
                    (room.status === "empty" ? "Đang trống" : "---")
                  }}
                </p>
                <p class="text-[10px] text-slate-400 font-medium mt-0.5">
                  Khách thuê
                </p>
              </div>
            </div>

            <!-- Price & Occupants -->
            <div class="flex-shrink-0 md:w-48 flex items-center justify-start gap-6 w-full">
              <div>
                <p class="text-[10px] text-slate-400 font-medium mb-1">Giá phòng</p>
                <span class="text-sm font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5"
                  ><el-icon><Wallet /></el-icon>
                  {{ formatPrice(room.price) }}</span
                >
              </div>
            </div>

            <!-- Status -->
            <div class="flex-shrink-0 md:w-32 flex items-center justify-start md:justify-end w-full border-t md:border-0 border-slate-100 dark:border-slate-700 pt-4 md:pt-0">
              <span
                class="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tight"
                :style="{ color: getStatusColor(room.status), backgroundColor: getStatusColor(room.status) + '1A' }"
              >
                {{ getStatusLabel(room.status) }}
              </span>
            </div>

            <!-- Actions -->
            <div class="flex-shrink-0 flex gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 top-4 md:relative md:right-auto md:top-auto">
              <button
                class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-blue-600 text-slate-500 dark:text-slate-300 transition-colors flex items-center justify-center"
                title="Chỉnh sửa"
                @click.stop="showEditDialog(room)"
              >
                <el-icon><EditPen /></el-icon>
              </button>
              <button
                class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-rose-100 dark:hover:bg-rose-900/30 text-rose-500 transition-colors flex items-center justify-center"
                title="Xóa phòng"
                @click.stop="deleteRoom(room)"
              >
                <el-icon><Delete /></el-icon>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="filteredRooms.length === 0 && !loading" class="flex flex-col items-center justify-center py-20 text-slate-400">
        <el-icon size="48" class="mb-4 opacity-20"><InfoFilled /></el-icon>
        <p class="font-bold uppercase tracking-widest text-xs">Không tìm thấy phòng nào trong tòa nhà này</p>
      </div>
    </div>
  </div>

  <!-- Dialog Thêm/Sửa phòng -->
  <el-dialog
    v-model="dialogVisible"
    :title="isEdit ? 'Cập nhật thông tin phòng' : 'Thêm phòng mới'"
    width="90%"
    style="max-width: 550px"
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
          <el-input v-model="form.floor" placeholder="1, 2, 3..." class="!w-full" />
        </el-form-item>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <el-form-item label="Giá phòng" prop="price" required>
          <el-input v-model.number="form.price" placeholder="Ví dụ: 3000000">
            <template #append>VNĐ</template>
          </el-input>
        </el-form-item>
        <el-form-item label="Trạng thái phòng" prop="status" required>
          <el-select v-model="form.status" class="!w-full" :disabled="!isEdit">
            <el-option label="Trống" value="empty" />
            <el-option label="Đang thuê" value="rented" />
            <el-option label="Bảo trì" value="maintenance" />
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

      <el-form-item label="Ảnh phòng" v-if="isEdit">
        <el-upload
          v-model:file-list="fileList"
          list-type="picture-card"
          :http-request="uploadImage"
          accept="image/*"
        >
          <template #default>
            <el-icon><Plus /></el-icon>
          </template>
          <template #file="{ file }">
            <div>
              <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
              <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-preview"
                  @click="handleSetPrimary(file)"
                  title="Đặt làm ảnh chính"
                >
                  <el-icon :class="{ 'text-yellow-400': file.is_primary }"><StarFilled /></el-icon>
                </span>
                <span
                  class="el-upload-list__item-delete"
                  @click="handleRemoveImage(file)"
                  title="Xóa ảnh"
                >
                  <el-icon><Delete /></el-icon>
                </span>
              </span>
            </div>
          </template>
        </el-upload>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="flex justify-end gap-3 px-4 pb-4 mt-4">
        <el-button @click="dialogVisible = false" class="theme-btn-cancel"
          >Hủy bỏ</el-button>
        <el-button type="primary" @click="submitForm" class="theme-btn-submit" :loading="loading">
          {{ isEdit ? 'Lưu thay đổi' : 'Tạo phòng ngay' }}
        </el-button>
      </div>
    </template>
  </el-dialog>

  <!-- Dialog Chi tiết phòng -->
  <el-dialog
    v-model="detailVisible"
    title="Chi tiết phòng"
    width="90%"
    style="max-width: 600px"
    class="theme-dialog-v3"
    append-to-body
  >
    <div v-if="selectedRoom" v-loading="detailLoading" class="p-2">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-3xl font-black text-slate-800 dark:text-white leading-none mb-2">
            Phòng {{ selectedRoom.room_number }}
          </h2>
          <p class="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
            {{ selectedRoom.building?.name || '---' }} • Tầng {{ selectedRoom.floor }}
          </p>
        </div>
        <div 
          class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider"
          :style="{ backgroundColor: getStatusColor(selectedRoom.status) + '20', color: getStatusColor(selectedRoom.status), border: `1px solid ${getStatusColor(selectedRoom.status)}40` }"
        >
          {{ getStatusLabel(selectedRoom.status) }}
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6 mb-8">
        <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
          <label class="text-[10px] font-black text-slate-400 uppercase mb-2 block">Giá thuê</label>
          <p class="text-lg font-black text-blue-500">{{ formatPrice(selectedRoom.price) }}</p>
        </div>
      </div>

      <div class="space-y-6">
        <div>
          <label class="text-[10px] font-black text-slate-400 uppercase mb-3 block">Mô tả & Tiện nghi</label>
          <div class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
            {{ selectedRoom.description || 'Chưa có mô tả chi tiết cho phòng này.' }}
          </div>
        </div>

        <div v-if="selectedRoom.current_tenant">
          <label class="text-[10px] font-black text-slate-400 uppercase mb-3 block">Khách thuê hiện tại</label>
          <div class="flex items-center gap-4 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10">
            <div class="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-black">
              {{ selectedRoom.current_tenant.name?.split(' ').pop()?.[0] }}
            </div>
            <div>
              <p class="font-bold text-slate-800 dark:text-white">{{ selectedRoom.current_tenant.name }}</p>
              <p class="text-xs text-slate-500">{{ selectedRoom.current_tenant.phone }}</p>
            </div>
            <el-button type="primary" link class="ml-auto" @click="ElMessage.info('Chức năng đang phát triển')">
              Chi tiết <el-icon class="ml-1"><ArrowRight /></el-icon>
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-end gap-3 px-4 pb-4">
        <el-button @click="detailVisible = false" class="theme-btn-cancel">Đóng</el-button>
        <el-button type="primary" class="theme-btn-submit" @click="showEditDialog(selectedRoom)">
          <el-icon class="mr-2"><EditPen /></el-icon> Chỉnh sửa
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from "vue";
import { useRoute } from "vue-router";
import api from "../axios";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  Plus,
  User,
  UserFilled,
  Wallet,
  InfoFilled,
  Document,
  EditPen,
  Delete,
  ArrowRight,
  StarFilled
} from "@element-plus/icons-vue";

const route = useRoute();
const buildings = ref([]);
const rooms = ref([]);
const activeBuilding = ref(null);
const selectedFloor = ref(null);
const loading = ref(false);
const dialogVisible = ref(false);
const isEdit = ref(false);
const formRef = ref(null);
const detailVisible = ref(false);
const detailLoading = ref(false);
const selectedRoom = ref(null);
const fileList = ref([]);

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
  id: null,
  building_id: null,
  room_number: "",
  floor: "1",
  price: null,
  status: "empty",
  description: "",
});

const filteredRooms = computed(() => {
  if (!activeBuilding.value) return [];
  return rooms.value.filter(r => r.building_id === activeBuilding.value);
});

const floors = computed(() => {
  const floorSet = new Set(
    filteredRooms.value
      .map((r) => r.floor)
      .filter(Boolean),
  );
  return Array.from(floorSet).sort((a, b) => String(a).localeCompare(String(b)));
});

const sortedFloors = computed(() => {
  if (selectedFloor.value) return [selectedFloor.value];
  return floors.value;
});

const getRoomsByFloor = (floor) => {
  return filteredRooms.value
    .filter((r) => r.floor === floor)
    .sort((a, b) => a.room_number.localeCompare(b.room_number));
};

const getStatusColor = (status) => {
  const colors = {
    empty: "#10b981",
    rented: "#3b82f6",
    overdue: "#ef4444",
    maintenance: "#94a3b8",
  };
  return colors[status] || "#94a3b8";
};

const getStatusLabel = (status) => {
  const labels = {
    empty: "Phòng trống",
    rented: "Đã thuê",
    overdue: "Nợ tiền",
    maintenance: "Bảo trì",
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
    const resData = response.data.data || response.data;
    buildings.value = resData.data || resData || [];
    
    if (buildings.value.length > 0) {
      const queryBuildingId = Number(route.query.building);
      if (queryBuildingId && buildings.value.some(b => b.id === queryBuildingId)) {
        activeBuilding.value = queryBuildingId;
      } else if (!activeBuilding.value) {
        activeBuilding.value = buildings.value[0].id;
      }
    }
  } catch (error) {
    ElMessage.error("Không thể tải danh sách tòa nhà");
  }
};

const fetchRooms = async () => {
  if (!activeBuilding.value) {
    rooms.value = [];
    return;
  }
  
  loading.value = true;
  try {
    const params = { 
      per_page: 100,
      building_id: activeBuilding.value
    };
    const response = await api.get("/rooms", { params });
    const resData = response.data.data || response.data;
    rooms.value = resData.data || resData || [];
  } catch (error) {
    ElMessage.error("Lỗi khi tải danh sách phòng");
  } finally {
    loading.value = false;
  }
};

const openRoomDetail = async (room) => {
  selectedRoom.value = room;
  detailVisible.value = true;
  detailLoading.value = true;
  try {
    const response = await api.get(`/rooms/${room.id}`);
    const resData = response.data.data || response.data;
    selectedRoom.value = resData;
  } catch (error) {
    console.error("Fetch room detail error:", error);
  } finally {
    detailLoading.value = false;
  }
};

const showCreateDialog = () => {
  isEdit.value = false;
  form.value = {
    id: null,
    building_id: activeBuilding.value,
    room_number: "",
    floor: "1",
    price: null,
    status: "empty",
    description: "",
  };
  dialogVisible.value = true;
};

const showEditDialog = (room) => {
  isEdit.value = true;
  form.value = {
    id: room.id,
    building_id: room.building_id,
    room_number: room.room_number,
    floor: String(room.floor),
    price: parseFloat(room.price),
    status: room.status,
    description: room.description || "",
  };
  fileList.value = (room.images || []).map(img => ({
    name: img.id,
    url: img.image_url,
    id: img.id,
    is_primary: img.is_primary
  }));
  dialogVisible.value = true;
};

const uploadImage = async (options) => {
  const formData = new FormData();
  formData.append('image', options.file);
  try {
    const res = await api.post(`/rooms/${form.value.id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    ElMessage.success('Tải ảnh lên thành công');
    const newImage = res.data?.data || res.data;
    if (newImage && newImage.id) {
      const idx = fileList.value.findIndex(f => f.uid === options.file.uid);
      if (idx !== -1) {
        fileList.value[idx] = {
          name: newImage.id,
          url: newImage.image_url,
          id: newImage.id,
          is_primary: newImage.is_primary,
          uid: options.file.uid
        };
      }
    }
    options.onSuccess(res, options.file);
    fetchRooms(); // refresh background list
  } catch (err) {
    ElMessage.error(err.response?.data?.message || 'Lỗi khi tải ảnh lên');
    options.onError(err);
    fileList.value = fileList.value.filter(f => f.uid !== options.file.uid);
  }
};

const handleRemoveImage = async (file) => {
  if (!file.id) {
    fileList.value = fileList.value.filter(f => f.uid !== file.uid);
    return;
  }
  try {
    await ElMessageBox.confirm('Bạn có chắc muốn xóa ảnh này?', 'Cảnh báo', {
      type: 'warning'
    });
    await api.delete(`/rooms/${form.value.id}/images/${file.id}`);
    ElMessage.success('Xóa ảnh thành công');
    fileList.value = fileList.value.filter(f => f.id !== file.id);
    fetchRooms();
  } catch (err) {
    if (err !== 'cancel') ElMessage.error('Lỗi khi xóa ảnh');
  }
};

const handleSetPrimary = async (file) => {
  if (!file.id) return;
  try {
    await api.patch(`/rooms/${form.value.id}/images/${file.id}/primary`);
    ElMessage.success('Đặt làm ảnh chính thành công');
    fileList.value.forEach(f => f.is_primary = (f.id === file.id));
    fetchRooms();
  } catch (err) {
    ElMessage.error('Lỗi khi đặt ảnh chính');
  }
};

const submitForm = async () => {
  const valid = await formRef.value.validate().catch(() => false);
  if (!valid) return;

  try {
    loading.value = true;
    let response;
    if (isEdit.value) {
      response = await api.put(`/rooms/${form.value.id}`, form.value);
    } else {
      response = await api.post("/rooms", form.value);
    }

    // Chấp nhận 200/201 là thành công
    const isSuccess = response.status === 200 || response.status === 201 || response.success === true || response.data?.status === 200;

    if (isSuccess) {
      ElMessage.success(isEdit.value ? "Cập nhật thành công" : "Tạo phòng thành công");
      dialogVisible.value = false;
      fetchRooms();
    } else {
      ElMessage.error(response.message || response.data?.message || "Có lỗi xảy ra");
    }
  } catch (error) {
    ElMessage.error(error.response?.data?.message || "Có lỗi xảy ra khi lưu dữ liệu");
  } finally {
    loading.value = false;
  }
};

const deleteRoom = async (room) => {
  try {
    await ElMessageBox.confirm(`Bạn có chắc muốn xóa phòng ${room.room_number}?`, "Cảnh báo", {
      confirmButtonText: "Xóa ngay",
      cancelButtonText: "Hủy bỏ",
      type: "warning",
    });
    const response = await api.delete(`/rooms/${room.id}`);
    const isSuccess = response.status === 200 || response.data.status === 200 || response.data.success;

    if (isSuccess) {
      ElMessage.success("Đã xóa phòng thành công");
      fetchRooms();
    } else {
      ElMessage.error(response.data.message || "Không thể xóa phòng");
    }
  } catch (error) {
    if (error !== 'cancel') ElMessage.error(error.response?.data?.message || "Lỗi khi xóa phòng");
  }
};

onMounted(async () => {
  await fetchBuildings();
  await fetchRooms();
});
</script>

<style scoped>
/* (Giữ nguyên phần Style bên dưới) */
.custom-select-v3 {
  width: 160px;
  min-width: 130px;
  flex-shrink: 0;
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

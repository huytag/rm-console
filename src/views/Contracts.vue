<template>
  <div
    class="contracts-container min-h-full p-6 font-inter"
    style="background-color: #111827"
  >
    <!-- ===== 1. PAGE HEADER ===== -->
    <div class="flex items-start justify-between mb-8">
      <div>
        <h1 class="text-2xl font-black text-white mb-1">Danh sách Hợp đồng</h1>
        <p class="text-sm" style="color: #6b7280">
          Quản lý và theo dõi các hợp đồng thuê nhà hiện có trong hệ thống.
        </p>
      </div>
      <button
        class="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-105"
        style="background-color: #3b82f6"
        @click="openAddModal"
      >
        <el-icon><Plus /></el-icon>
        Thêm hợp đồng mới
      </button>
    </div>

    <!-- ===== 2. STAT CARDS ===== -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <!-- Đang hiệu lực -->
      <div
        class="flex items-center gap-4 p-5 rounded-2xl border"
        style="background-color: #1f2937; border-color: #374151"
      >
        <div
          class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
          style="background-color: rgba(16, 185, 129, 0.15)"
        >
          <el-icon size="22" style="color: #10b981"><CircleCheck /></el-icon>
        </div>
        <div>
          <p
            class="text-xs font-bold uppercase tracking-widest mb-1"
            style="color: #6b7280"
          >
            Đang hiệu lực
          </p>
          <p class="text-3xl font-black text-white">{{ stats.active }}</p>
        </div>
      </div>

      <!-- Sắp hết hạn -->
      <div
        class="flex items-center gap-4 p-5 rounded-2xl border"
        style="background-color: #1f2937; border-color: #374151"
      >
        <div
          class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
          style="background-color: rgba(245, 158, 11, 0.15)"
        >
          <el-icon size="22" style="color: #f59e0b"><Warning /></el-icon>
        </div>
        <div>
          <p
            class="text-xs font-bold uppercase tracking-widest mb-1"
            style="color: #6b7280"
          >
            Sắp hết hạn (30 ngày)
          </p>
          <p class="text-3xl font-black text-white">{{ stats.expiringSoon }}</p>
        </div>
      </div>

      <!-- Đã quá hạn -->
      <div
        class="flex items-center gap-4 p-5 rounded-2xl border"
        style="background-color: #1f2937; border-color: #374151"
      >
        <div
          class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
          style="background-color: rgba(239, 68, 68, 0.15)"
        >
          <el-icon size="22" style="color: #ef4444"><CircleClose /></el-icon>
        </div>
        <div>
          <p
            class="text-xs font-bold uppercase tracking-widest mb-1"
            style="color: #6b7280"
          >
            Đã quá hạn
          </p>
          <p class="text-3xl font-black text-white">{{ stats.expired }}</p>
        </div>
      </div>
    </div>

    <!-- ===== 3. FILTER BAR ===== -->
    <div
      class="p-5 rounded-2xl border mb-6"
      style="background-color: #1f2937; border-color: #374151"
    >
      <div class="flex flex-wrap items-end gap-5">
        <div class="flex flex-col gap-1.5">
          <label
            class="text-xs font-bold uppercase tracking-widest"
            style="color: #9ca3af"
            >Tòa nhà</label
          >
          <el-select
            v-model="filters.building"
            placeholder="Tất cả tòa nhà"
            clearable
            class="contracts-select"
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

        <div class="flex flex-col gap-1.5">
          <label
            class="text-xs font-bold uppercase tracking-widest"
            style="color: #9ca3af"
            >Tầng</label
          >
          <el-select
            v-model="filters.floor"
            placeholder="Tất cả các tầng"
            clearable
            class="contracts-select"
            style="width: 180px"
          >
            <el-option
              v-for="f in floorOptions"
              :key="f"
              :label="`Tầng ${f}`"
              :value="f"
            />
          </el-select>
        </div>

        <div class="flex flex-col gap-1.5">
          <label
            class="text-xs font-bold uppercase tracking-widest"
            style="color: #9ca3af"
            >Trạng thái</label
          >
          <el-select
            v-model="filters.status"
            placeholder="Tất cả trạng thái"
            clearable
            class="contracts-select"
            style="width: 200px"
          >
            <el-option label="Còn hạn" value="active" />
            <el-option label="Sắp hết hạn" value="expiring" />
            <el-option label="Hết hạn" value="expired" />
          </el-select>
        </div>

        <button
          class="px-5 py-2 rounded-xl text-sm font-bold transition-all hover:opacity-80"
          style="background-color: #3b82f6; color: #fff; height: 36px"
          @click="clearFilters"
        >
          Xóa bộ lọc
        </button>
      </div>
    </div>

    <!-- ===== 4. TABLE SECTION ===== -->
    <div
      class="rounded-2xl border overflow-hidden shadow-2xl"
      style="background-color: #111827; border-color: #374151"
    >
      <div class="overflow-x-auto">
        <table class="w-full text-sm border-collapse">
          <thead style="background-color: #1f2937">
            <tr style="border-bottom: 1px solid #374151">
              <th class="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-gray-500">ID</th>
              <th class="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-gray-500">Phòng</th>
              <th class="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-gray-500">Người thuê</th>
              <th class="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-gray-500">Số điện thoại</th>
              <th class="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-gray-500">Thời hạn</th>
              <th class="px-6 py-5 text-right text-[11px] font-black uppercase tracking-widest text-gray-500">Tiền cọc</th>
              <th class="px-6 py-5 text-right text-[11px] font-black uppercase tracking-widest text-gray-500">Giá thuê</th>
              <th class="px-6 py-5 text-center text-[11px] font-black uppercase tracking-widest text-gray-500">Trạng thái</th>
              <th class="px-6 py-5 text-center text-[11px] font-black uppercase tracking-widest text-gray-500">Thao tác</th>
            </tr>
          </thead>
          <tbody v-if="!loading" style="background-color: #111827">
            <tr
              v-for="(contract, index) in paginatedContracts"
              :key="contract.id"
              class="table-row-hover transition-colors"
              :style="index !== paginatedContracts.length - 1 ? 'border-bottom: 1px solid #1f2937;' : ''"
            >
              <!-- ID -->
              <td class="px-6 py-5">
                <span class="font-bold text-xs text-gray-400">#HĐ-{{ String(contract.id).padStart(4, '0') }}</span>
              </td>

              <!-- Phòng -->
              <td class="px-6 py-5">
                <p class="font-bold text-white text-sm">
                  {{ contract.room?.room_number || contract.room_number }}
                </p>
                <p class="text-[11px] text-gray-500 font-medium mt-0.5">
                  {{ contract.building_name || "Diamond Riverside" }}
                </p>
              </td>

              <!-- Người thuê -->
              <td class="px-6 py-5">
                <p class="font-bold text-white text-sm">
                  {{ contract.tenant?.name || contract.tenant_name }}
                </p>
              </td>

              <!-- Số điện thoại -->
              <td class="px-6 py-5">
                <span class="text-gray-400 font-medium text-sm">{{ contract.tenant?.phone || contract.phone }}</span>
              </td>

              <!-- Thời hạn -->
              <td class="px-6 py-5">
                <p class="font-bold text-sm" :style="{ color: getDateColor(contract) }">
                  {{ formatDate(contract.start_date) }}
                </p>
                <p class="text-[11px] text-gray-500 font-medium mt-0.5">
                  {{ formatDate(contract.end_date) }}
                </p>
              </td>

              <!-- Tiền cọc -->
              <td class="px-6 py-5 text-right">
                <span class="font-bold text-gray-300">{{ formatPrice(contract.deposit) }}</span>
              </td>

              <!-- Giá thuê -->
              <td class="px-6 py-5 text-right">
                <span class="font-black text-white text-sm">{{ formatPrice(contract.rent_price || contract.price) }}</span>
              </td>

              <!-- Trạng thái -->
              <td class="px-6 py-5 text-center">
                <span 
                  class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                  :style="getStatusStyle(contract.status)"
                >
                  {{ getStatusLabel(contract.status) }}
                </span>
              </td>

              <!-- Thao tác -->
              <td class="px-6 py-5 text-center">
                <div class="flex items-center justify-center gap-3">
                  <button class="text-gray-500 hover:text-blue-500 transition-colors" title="Xem chi tiết" @click="openDetails(contract)">
                    <el-icon size="16"><View /></el-icon>
                  </button>
                  <button class="text-gray-500 hover:text-emerald-500 transition-colors" title="Gia hạn">
                    <el-icon size="16"><RefreshRight /></el-icon>
                  </button>
                  <button class="text-gray-500 hover:text-emerald-500 transition-colors" title="In hợp đồng" @click="printContract(contract)">
                    <el-icon size="16"><Printer /></el-icon>
                  </button>

                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ===== 5. PAGINATION SECTION ===== -->
      <div
        class="flex items-center justify-between px-6 py-4"
        style="background-color: #1f2937; border-top: 1px solid #374151"
      >
        <p class="text-xs font-bold text-gray-500 uppercase tracking-widest">
          Tổng cộng <span class="text-white">{{ filteredContracts.length }}</span> hóa đơn
        </p>

        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <span class="text-[11px] font-bold text-gray-500 uppercase">Hiển thị</span>
            <el-select v-model="pageSize" style="width: 100px;" class="dark-select-mini">
              <el-option label="10/trang" :value="10" />
              <el-option label="20/trang" :value="20" />
            </el-select>
          </div>

          <div class="flex items-center gap-1">
            <button
              class="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30 text-gray-500 hover:text-white"
              :disabled="currentPage === 1"
              @click="currentPage--"
            >
              <el-icon><ArrowLeft /></el-icon>
            </button>

            <button
              v-for="page in visiblePages"
              :key="page"
              class="w-8 h-8 rounded-lg text-xs font-black transition-all"
              :class="page === currentPage ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-white'"
              @click="currentPage = page"
            >
              {{ page }}
            </button>

            <button
              class="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30 text-gray-500 hover:text-white"
              :disabled="currentPage === totalPages"
              @click="currentPage++"
            >
              <el-icon><ArrowRight /></el-icon>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- ===== 6. DETAILS MODAL ===== -->
    <el-dialog
      v-model="detailsVisible"
      title="Chi tiết Hợp đồng"
      width="800px"
      class="contract-details-dialog"
      :align-center="true"
    >
      <div v-if="selectedContract" class="p-4">
        <div class="grid grid-cols-2 gap-8">
          <!-- Left Column -->
          <div class="flex flex-col gap-6">
            <div class="detail-item">
              <label>Mã Hợp đồng</label>
              <p class="font-black text-blue-500 text-lg">#HĐ-{{ String(selectedContract.id).padStart(4, '0') }}</p>
            </div>
            <div class="detail-item">
              <label>Phòng / Tòa nhà</label>
              <p class="text-white font-bold">{{ selectedContract.room_number }} - {{ selectedContract.building_name }}</p>
            </div>
            <div class="detail-item">
              <label>Người thuê</label>
              <div class="flex items-center gap-3 mt-1">
                <div class="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs">
                  {{ selectedContract.tenant_name?.split(' ').pop()?.[0] }}
                </div>
                <p class="text-white font-bold">{{ selectedContract.tenant_name }}</p>
              </div>
            </div>
            <div class="detail-item">
              <label>Thời hạn hợp đồng</label>
              <div class="flex items-center gap-2 mt-1">
                <span class="text-emerald-500 font-bold">{{ selectedContract.start_date }}</span>
                <el-icon size="12" class="text-gray-600"><ArrowRight /></el-icon>
                <span class="text-rose-500 font-bold">{{ selectedContract.end_date }}</span>
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="flex flex-col gap-6">
            <div class="detail-item">
              <label>Trạng thái</label>
              <div class="mt-1">
                <span 
                  class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                  :style="getStatusStyle(selectedContract.status)"
                >
                  {{ getStatusLabel(selectedContract.status) }}
                </span>
              </div>
            </div>
            <div class="detail-item">
              <label>Tiền cọc</label>
              <p class="text-white font-black text-lg">{{ formatPrice(selectedContract.deposit) }}</p>
            </div>
            <div class="detail-item">
              <label>Giá thuê</label>
              <p class="text-white font-black text-lg">{{ formatPrice(selectedContract.rent_price) }}</p>
            </div>
            <div class="detail-item">
              <label>Ngày tạo / Cập nhật</label>
              <p class="text-xs text-gray-400 font-medium mt-1">
                Tạo: {{ selectedContract.created_at || '10/10/2023' }} <br/>
                Sửa: {{ selectedContract.updated_at || '15/10/2023' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Services Section -->
        <div class="mt-8 pt-8 border-t border-gray-800">
          <label class="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-4">Dịch vụ đi kèm</label>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="svc in selectedContract.services || [
                { name: 'Tiền điện', price: 3500, unit: 'kWh' },
                { name: 'Tiền nước', price: 25000, unit: 'm3' },
                { name: 'Internet', price: 150000, unit: 'Tháng' },
                { name: 'Vệ sinh', price: 50000, unit: 'Phòng' }
              ]" 
              :key="svc.name"
              class="flex items-center justify-between p-4 rounded-xl bg-gray-900/30 border border-gray-800 hover:border-blue-500/50 transition-colors"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-blue-400">
                  <el-icon size="18"><Service /></el-icon>
                </div>
                <div>
                  <p class="text-white font-bold text-sm">{{ svc.name }}</p>
                  <p class="text-[10px] text-gray-500 uppercase font-black tracking-widest">Đơn giá</p>
                </div>
              </div>
              <p class="text-white font-black">
                {{ formatPrice(svc.price) }}<span class="text-[10px] text-gray-500 font-bold ml-1">/ {{ svc.unit }}</span>
              </p>
            </div>
          </div>
        </div>

        <div class="mt-10 pt-8 border-t border-gray-800">
          <div class="detail-item mb-8">
            <label class="mb-3 block">Điều khoản hợp đồng</label>
            <div class="bg-gray-900/50 rounded-xl p-5 border border-gray-800">
              <p class="text-sm text-gray-300 leading-relaxed italic">
                {{ selectedContract.terms || "Chưa có điều khoản cụ thể được ghi nhận cho hợp đồng này. Vui lòng tham khảo bản hợp đồng giấy đã ký kết." }}
              </p>
            </div>
          </div>

          <div class="detail-item">
            <label class="mb-4 block">Quá trình ký hợp đồng</label>
            <el-timeline>
              <el-timeline-item
                timestamp="10/10/2023 09:00"
                placement="top"
                type="primary"
                :hollow="true"
              >
                <h4 class="text-white font-bold text-sm">Khởi tạo hợp đồng</h4>
                <p class="text-xs text-gray-500 mt-1">Hệ thống tạo bản thảo hợp đồng.</p>
              </el-timeline-item>
              <el-timeline-item
                timestamp="12/10/2023 14:30"
                placement="top"
                type="success"
              >
                <h4 class="text-white font-bold text-sm">Người thuê xác nhận</h4>
                <p class="text-xs text-gray-500 mt-1">Người thuê đã xem và đồng ý các điều khoản.</p>
              </el-timeline-item>
              <el-timeline-item
                timestamp="15/10/2023 10:15"
                placement="top"
                type="success"
              >
                <h4 class="text-white font-bold text-sm">Hoàn tất ký kết</h4>
                <p class="text-xs text-gray-500 mt-1">Hợp đồng có hiệu lực chính thức.</p>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-3 p-4">
          <el-button @click="detailsVisible = false" class="dark-btn-secondary">Đóng</el-button>
          <el-button type="primary" @click="printContract(selectedContract)" class="dark-btn-primary">
            <el-icon class="mr-2"><Printer /></el-icon> In hợp đồng
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
  CircleCheck,
  Warning,
  CircleClose,
  View,
  RefreshRight,
  Printer,
  Service,
  ArrowLeft,
  ArrowRight,
} from "@element-plus/icons-vue";

// ========== MOCK DATA ==========
const mockContracts = [
  {
    id: 982,
    room_number: "A-402",
    building_name: "Diamond Riverside",
    tenant_name: "Nguyễn Văn An",
    phone: "0901 234 567",
    start_date: "01/01/2024",
    end_date: "31/12/2024",
    deposit: 5000000,
    rent_price: 4500000,
    status: "active",
  },
  {
    id: 871,
    room_number: "B-105",
    building_name: "Sapphire Tower",
    tenant_name: "Lê Thị Mai",
    phone: "0933 888 999",
    start_date: "15/06/2023",
    end_date: "15/06/2024",
    deposit: 8000000,
    rent_price: 7200000,
    status: "expiring",
  },
  {
    id: 722,
    room_number: "A-201",
    building_name: "Diamond Riverside",
    tenant_name: "Trần Hoàng Long",
    phone: "0977 123 456",
    start_date: "01/05/2023",
    end_date: "01/05/2024",
    deposit: 4000000,
    rent_price: 3800000,
    status: "expired",
  },
  {
    id: 995,
    room_number: "C-702",
    building_name: "Ruby Residence",
    tenant_name: "Phạm Minh Tuấn",
    phone: "0911 222 333",
    start_date: "20/02/2024",
    end_date: "20/02/2025",
    deposit: 6000000,
    rent_price: 5500000,
    status: "active",
  },
  {
    id: 653,
    room_number: "D-301",
    building_name: "Sapphire Tower",
    tenant_name: "Ngô Thị Hồng",
    phone: "0944 555 666",
    start_date: "10/03/2024",
    end_date: "10/03/2025",
    deposit: 5500000,
    rent_price: 4800000,
    status: "active",
  },
  {
    id: 441,
    room_number: "B-204",
    building_name: "Ruby Residence",
    tenant_name: "Vũ Đức Thành",
    phone: "0912 777 888",
    start_date: "05/08/2023",
    end_date: "05/08/2024",
    deposit: 7000000,
    rent_price: 6200000,
    status: "expiring",
  },
  {
    id: 388,
    room_number: "E-501",
    building_name: "Diamond Riverside",
    tenant_name: "Hoàng Thị Lan",
    phone: "0908 111 222",
    start_date: "12/09/2023",
    end_date: "12/09/2024",
    deposit: 5000000,
    rent_price: 4200000,
    status: "expired",
  },
  {
    id: 560,
    room_number: "A-103",
    building_name: "Sapphire Tower",
    tenant_name: "Đinh Văn Khoa",
    phone: "0976 333 444",
    start_date: "01/04/2024",
    end_date: "01/04/2025",
    deposit: 6500000,
    rent_price: 5800000,
    status: "active",
  },
  {
    id: 319,
    room_number: "F-201",
    building_name: "Ruby Residence",
    tenant_name: "Bùi Thị Nga",
    phone: "0935 666 777",
    start_date: "20/07/2023",
    end_date: "20/07/2024",
    deposit: 4500000,
    rent_price: 4000000,
    status: "expiring",
  },
  {
    id: 712,
    room_number: "B-302",
    building_name: "Diamond Riverside",
    tenant_name: "Lý Văn Cường",
    phone: "0918 888 999",
    start_date: "15/11/2023",
    end_date: "15/11/2024",
    deposit: 7500000,
    rent_price: 6800000,
    status: "active",
  },
  {
    id: 205,
    room_number: "C-401",
    building_name: "Sapphire Tower",
    tenant_name: "Trịnh Thị Hoa",
    phone: "0962 000 111",
    start_date: "05/02/2023",
    end_date: "05/02/2024",
    deposit: 3500000,
    rent_price: 3200000,
    status: "expired",
  },
  {
    id: 834,
    room_number: "D-102",
    building_name: "Ruby Residence",
    tenant_name: "Phan Minh Đức",
    phone: "0949 222 333",
    start_date: "10/06/2024",
    end_date: "10/06/2025",
    deposit: 9000000,
    rent_price: 8500000,
    status: "active",
  },
];

// ========== STATE ==========
const contracts = ref(mockContracts);
const buildings = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(4);
const detailsVisible = ref(false);
const selectedContract = ref(null);

const filters = ref({
  building: null,
  floor: null,
  status: null,
});

// ========== COMPUTED ==========
const stats = computed(() => ({
  active: contracts.value.filter((c) => c.status === "active").length,
  expiringSoon: contracts.value.filter((c) => c.status === "expiring").length,
  expired: contracts.value.filter((c) => c.status === "expired").length,
}));

const floorOptions = computed(() => [1, 2, 3, 4, 5, 6, 7]);

const filteredContracts = computed(() => {
  return contracts.value.filter((c) => {
    if (filters.value.status && c.status !== filters.value.status) return false;
    return true;
  });
});

const totalPages = computed(
  () => Math.ceil(filteredContracts.value.length / pageSize.value) || 1,
);

const paginatedContracts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredContracts.value.slice(start, start + pageSize.value);
});

const visiblePages = computed(() => {
  const pages = [];
  const total = totalPages.value;
  for (let i = 1; i <= Math.min(total, 5); i++) pages.push(i);
  return pages;
});

// ========== METHODS ==========
const formatPrice = (price) => {
  if (!price) return "---";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
};

const formatDate = (dateStr) => dateStr || "---";

const getDateColor = (contract) => {
  if (contract.status === "expired") return "#EF4444";
  if (contract.status === "expiring") return "#F59E0B";
  return "#D1D5DB";
};

const getStatusLabel = (status) => {
  const map = {
    active: "Còn hạn",
    expiring: "Sắp hết hạn",
    expired: "Hết hạn",
    terminated: "Chấm dứt",
  };
  return map[status] || status;
};

const getStatusStyle = (status) => {
  const styles = {
    active: "background-color: rgba(16,185,129,0.15); color: #10B981;",
    expiring: "background-color: rgba(245,158,11,0.15); color: #F59E0B;",
    expired: "background-color: rgba(239,68,68,0.15); color: #EF4444;",
    terminated: "background-color: rgba(107,114,128,0.2); color: #9CA3AF;",
  };
  return styles[status] || styles.terminated;
};

const clearFilters = () => {
  filters.value = { building: null, floor: null, status: null };
  currentPage.value = 1;
};

const openAddModal = () => {
  ElMessage.info("Chức năng thêm hợp đồng đang phát triển");
};

const openDetails = (contract) => {
  selectedContract.value = contract;
  detailsVisible.value = true;
};

const printContract = (contract) => {
  ElMessage.info(`Đang chuẩn bị bản in cho hợp đồng: #HĐ-${String(contract.id).padStart(4, '0')}`);
};

// ========== FETCH ==========
const fetchContracts = async () => {
  loading.value = true;
  try {
    const response = await api.get("/contracts");
    const data = response.data || response;
    // Chỉ dùng API data nếu có dữ liệu thật
    if (data && Array.isArray(data) && data.length > 0) {
      contracts.value = data;
    }
  } catch {
    // Giữ nguyên mock data
  } finally {
    loading.value = false;
  }
};

const fetchBuildings = async () => {
  try {
    const res = await api.get("/buildings");
    const data = res.data || res;
    buildings.value = Array.isArray(data) ? data : [];
  } catch {
    buildings.value = [
      { id: 1, name: "Diamond Riverside" },
      { id: 2, name: "Sapphire Tower" },
      { id: 3, name: "Ruby Residence" },
    ];
  }
};

onMounted(async () => {
  await Promise.all([fetchContracts(), fetchBuildings()]);
});
</script>

<style scoped>
.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  background-color: #374151;
  color: #9ca3af;
  border: none;
  cursor: pointer;
}

.btn-view:hover {
  background-color: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
}

.btn-refresh:hover {
  background-color: rgba(16, 185, 129, 0.2);
  color: #10b981;
}



.font-inter {
  font-family: "Inter", sans-serif;
}

.table-row-hover:hover {
  background-color: rgba(55, 65, 81, 0.5);
}

/* Custom select dark */
.contracts-select :deep(.el-input__wrapper) {
  background-color: #111827 !important;
  border: 1px solid #374151 !important;
  box-shadow: none !important;
  border-radius: 10px;
  height: 36px;
}

.contracts-select :deep(.el-input__inner) {
  color: #d1d5db !important;
  font-weight: 600;
  font-size: 13px;
}

.contracts-select :deep(.el-select__placeholder) {
  color: #6b7280 !important;
}

.contracts-select :deep(.el-input__suffix .el-icon) {
  color: #6b7280 !important;
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

/* Modal Styles */
:deep(.contract-details-dialog) {
  background-color: #1f2937 !important;
  border-radius: 24px;
  border: 1px solid #374151;
}

:deep(.contract-details-dialog .el-dialog__body) {
  max-height: 75vh;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #374151 transparent;
}

:deep(.contract-details-dialog .el-dialog__title) {
  color: #fff !important;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1px;
}

:deep(.contract-details-dialog .el-dialog__headerbtn .el-dialog__close) {
  color: #9ca3af !important;
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

.dark-btn-secondary {
  background-color: #374151 !important;
  border: none !important;
  color: #d1d5db !important;
  border-radius: 12px !important;
  font-weight: bold !important;
}

.dark-btn-primary {
  background-color: #3b82f6 !important;
  border: none !important;
  color: #fff !important;
  border-radius: 12px !important;
  font-weight: bold !important;
}

:deep(.el-timeline-item__node) {
  background-color: #374151;
}

:deep(.el-timeline-item__content) {
  color: #d1d5db;
}
</style>

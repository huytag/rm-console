<template>
  <div class="contracts-page min-h-full p-6 font-inter">
    <!-- ===== 1. PAGE HEADER ===== -->
    <div class="flex items-start justify-between mb-8">
      <div>
        <h1 class="text-2xl font-black text-main mb-1">Danh sách Hợp đồng</h1>
        <p class="text-sm text-dim">
          Quản lý và theo dõi các hợp đồng thuê nhà hiện có trong hệ thống.
        </p>
      </div>
      <button
        class="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-105 shadow-lg shadow-blue-500/20"
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
      <div class="stat-card card-emerald flex items-center gap-4 p-5 rounded-2xl border border-main">
        <div
          class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-emerald-500/10"
        >
          <el-icon size="22" style="color: #10b981"><CircleCheck /></el-icon>
        </div>
        <div>
          <p class="text-xs font-bold uppercase tracking-widest mb-1 text-dim">
            Đang hiệu lực
          </p>
          <p class="text-3xl font-black text-main">{{ stats.active }}</p>
        </div>
      </div>

      <!-- Sắp hết hạn -->
      <div class="stat-card card-amber flex items-center gap-4 p-5 rounded-2xl border border-main">
        <div
          class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-amber-500/10"
        >
          <el-icon size="22" style="color: #f59e0b"><Warning /></el-icon>
        </div>
        <div>
          <p class="text-xs font-bold uppercase tracking-widest mb-1 text-dim">
            Sắp hết hạn (30 ngày)
          </p>
          <p class="text-3xl font-black text-main">{{ stats.expiringSoon }}</p>
        </div>
      </div>

      <!-- Đã quá hạn -->
      <div class="stat-card card-rose flex items-center gap-4 p-5 rounded-2xl border border-main">
        <div
          class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-rose-500/10"
        >
          <el-icon size="22" style="color: #ef4444"><CircleClose /></el-icon>
        </div>
        <div>
          <p class="text-xs font-bold uppercase tracking-widest mb-1 text-dim">
            Đã quá hạn
          </p>
          <p class="text-3xl font-black text-main">{{ stats.expired }}</p>
        </div>
      </div>
    </div>

    <!-- ===== 3. FILTER BAR ===== -->
    <div class="card-item p-5 rounded-2xl border border-main mb-6">
      <div class="flex flex-wrap items-end gap-5">
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-bold uppercase tracking-widest text-muted">Tòa nhà</label>
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
          <label class="text-xs font-bold uppercase tracking-widest text-muted">Tầng</label>
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
          <label class="text-xs font-bold uppercase tracking-widest text-muted">Trạng thái</label>
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
          class="px-5 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105 hover:bg-blue-500 hover:shadow-lg active:scale-95"
          style="background-color: #3b82f6; color: #fff; height: 36px"
          @click="clearFilters"
        >
          Xóa bộ lọc
        </button>
      </div>
    </div>

    <!-- ===== 4. TABLE SECTION ===== -->
    <div class="table-container rounded-2xl border border-main overflow-hidden shadow-2xl">
      <div class="overflow-x-auto">
        <table class="w-full text-sm border-collapse">
          <thead class="table-head">
            <tr class="border-b border-main">
              <th class="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-dim">ID</th>
              <th class="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-dim">Phòng</th>
              <th class="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-dim">Người thuê</th>
              <th class="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-dim">Số điện thoại</th>
              <th class="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-dim">Thời hạn</th>
              <th class="px-6 py-5 text-right text-[11px] font-black uppercase tracking-widest text-dim">Tiền cọc</th>
              <th class="px-6 py-5 text-right text-[11px] font-black uppercase tracking-widest text-dim">Giá thuê</th>
              <th class="px-6 py-5 text-center text-[11px] font-black uppercase tracking-widest text-dim">Trạng thái</th>
              <th class="px-6 py-5 text-center text-[11px] font-black uppercase tracking-widest text-dim">Thao tác</th>
            </tr>
          </thead>
          <tbody v-if="!loading" class="table-body">
            <tr
              v-for="(contract, index) in paginatedContracts"
              :key="contract.id"
              class="table-row transition-colors border-b last:border-0 border-row"
            >
              <!-- ID -->
              <td class="px-6 py-5">
                <span class="font-bold text-xs text-id">#HĐ-{{ String(contract.id).padStart(4, '0') }}</span>
              </td>

              <!-- Phòng -->
              <td class="px-6 py-5">
                <p class="font-bold text-main text-sm">
                  {{ contract.room?.room_number || contract.room_number }}
                </p>
                <p class="text-[11px] text-dim font-medium mt-0.5">
                  {{ contract.building_name || "Diamond Riverside" }}
                </p>
              </td>

              <!-- Người thuê -->
              <td class="px-6 py-5">
                <p class="font-bold text-main text-sm">
                  {{ contract.tenant?.name || contract.tenant_name }}
                </p>
              </td>

              <!-- Số điện thoại -->
              <td class="px-6 py-5">
                <span class="text-muted font-medium text-sm">{{ contract.tenant?.phone || contract.phone }}</span>
              </td>

              <!-- Thời hạn -->
              <td class="px-6 py-5">
                <p class="font-bold text-sm" :style="{ color: getDateColor(contract) }">
                  {{ formatDate(contract.start_date) }}
                </p>
                <p class="text-[11px] text-dim font-medium mt-0.5">
                  {{ formatDate(contract.end_date) }}
                </p>
              </td>

              <!-- Tiền cọc -->
              <td class="px-6 py-5 text-right">
                <span class="font-bold text-main opacity-80">{{ formatPrice(contract.deposit) }}</span>
              </td>

              <!-- Giá thuê -->
              <td class="px-6 py-5 text-right">
                <span class="font-black text-main text-sm">{{ formatPrice(contract.rent_price || contract.price) }}</span>
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
                  <button class="action-btn btn-view" title="Xem chi tiết" @click="openDetails(contract)">
                    <el-icon size="16"><View /></el-icon>
                  </button>
                  <button class="action-btn btn-extend" title="Gia hạn">
                    <el-icon size="16"><RefreshRight /></el-icon>
                  </button>
                  <button class="action-btn btn-print" title="In hợp đồng" @click="printContract(contract)">
                    <el-icon size="16"><Printer /></el-icon>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ===== 5. PAGINATION SECTION ===== -->
      <div class="pagination-bar flex items-center justify-between px-6 py-4 border-t border-main">
        <p class="text-xs font-bold text-dim uppercase tracking-widest">
          Tổng cộng <span class="text-main">{{ filteredContracts.length }}</span> hóa đơn
        </p>

        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <span class="text-[11px] font-bold text-dim uppercase">Hiển thị</span>
            <el-select v-model="pageSize" style="width: 100px;" class="mini-select">
              <el-option label="10/trang" :value="10" />
              <el-option label="20/trang" :value="20" />
            </el-select>
          </div>

          <div class="flex items-center gap-1">
            <button
              class="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30 text-muted hover:text-main"
              :disabled="currentPage === 1"
              @click="currentPage--"
            >
              <el-icon><ArrowLeft /></el-icon>
            </button>

            <button
              v-for="page in visiblePages"
              :key="page"
              class="w-8 h-8 rounded-lg text-xs font-black transition-all"
              :class="page === currentPage ? 'bg-blue-600 text-white' : 'text-muted hover:text-main'"
              @click="currentPage = page"
            >
              {{ page }}
            </button>

            <button
              class="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30 text-muted hover:text-main"
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
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Left Column -->
          <div class="flex flex-col gap-6">
            <div class="detail-item">
              <label>Mã Hợp đồng</label>
              <p class="font-black text-blue-500 text-lg">#HĐ-{{ String(selectedContract.id).padStart(4, '0') }}</p>
            </div>
            <div class="detail-item">
              <label>Phòng / Tòa nhà</label>
              <p class="text-main font-bold">{{ selectedContract.room_number }} - {{ selectedContract.building_name }}</p>
            </div>
            <div class="detail-item">
              <label>Người thuê</label>
              <div class="flex items-center gap-3 mt-1">
                <div class="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs">
                  {{ selectedContract.tenant_name?.split(' ').pop()?.[0] }}
                </div>
                <p class="text-main font-bold">{{ selectedContract.tenant_name }}</p>
              </div>
            </div>
            <div class="detail-item">
              <label>Thời hạn hợp đồng</label>
              <div class="flex items-center gap-2 mt-1">
                <span class="text-emerald-500 font-bold">{{ selectedContract.start_date }}</span>
                <el-icon size="12" class="text-dim opacity-50"><ArrowRight /></el-icon>
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
              <p class="text-main font-black text-lg">{{ formatPrice(selectedContract.deposit) }}</p>
            </div>
            <div class="detail-item">
              <label>Giá thuê</label>
              <p class="text-main font-black text-lg">{{ formatPrice(selectedContract.rent_price) }}</p>
            </div>
            <div class="detail-item">
              <label>Ngày tạo / Cập nhật</label>
              <p class="text-xs text-dim font-medium mt-1">
                Tạo: {{ selectedContract.created_at || '10/10/2023' }} <br/>
                Sửa: {{ selectedContract.updated_at || '15/10/2023' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Services Section -->
        <div class="mt-8 pt-8 border-t border-row">
          <label class="text-[10px] font-black uppercase tracking-widest text-dim block mb-4">Dịch vụ đi kèm</label>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="svc in selectedContract.services || [
                { name: 'Tiền điện', price: 3500, unit: 'kWh' },
                { name: 'Tiền nước', price: 25000, unit: 'm3' },
                { name: 'Internet', price: 150000, unit: 'Tháng' },
                { name: 'Vệ sinh', price: 50000, unit: 'Phòng' }
              ]" 
              :key="svc.name"
              class="flex items-center justify-between p-4 rounded-xl service-box border border-row transition-all"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <el-icon size="18"><Service /></el-icon>
                </div>
                <div>
                  <p class="text-main font-bold text-sm">{{ svc.name }}</p>
                  <p class="text-[10px] text-dim uppercase font-black tracking-widest">Đơn giá</p>
                </div>
              </div>
              <p class="text-main font-black">
                {{ formatPrice(svc.price) }}<span class="text-[10px] text-dim font-bold ml-1">/ {{ svc.unit }}</span>
              </p>
            </div>
          </div>
        </div>

        <div class="mt-10 pt-8 border-t border-row">
          <div class="detail-item mb-8">
            <label class="mb-3 block">Điều khoản hợp đồng</label>
            <div class="terms-box rounded-xl p-5 border border-row">
              <p class="text-sm text-dim leading-relaxed italic">
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
                <h4 class="text-main font-bold text-sm">Khởi tạo hợp đồng</h4>
                <p class="text-xs text-dim mt-1">Hệ thống tạo bản thảo hợp đồng.</p>
              </el-timeline-item>
              <el-timeline-item
                timestamp="12/10/2023 14:30"
                placement="top"
                type="success"
              >
                <h4 class="text-main font-bold text-sm">Người thuê xác nhận</h4>
                <p class="text-xs text-dim mt-1">Người thuê đã xem và đồng ý các điều khoản.</p>
              </el-timeline-item>
              <el-timeline-item
                timestamp="15/10/2023 10:15"
                placement="top"
                type="success"
              >
                <h4 class="text-main font-bold text-sm">Hoàn tất ký kết</h4>
                <p class="text-xs text-dim mt-1">Hợp đồng có hiệu lực chính thức.</p>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-3 p-4">
          <el-button @click="detailsVisible = false" class="btn-cancel">Đóng</el-button>
          <el-button type="primary" @click="printContract(selectedContract)" class="btn-confirm">
            <el-icon class="mr-2"><Printer /></el-icon> In hợp đồng
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog 
      v-model="addDialogVisible" 
      title="Khởi tạo Hợp đồng mới" 
      width="650px"
      class="theme-dialog-v3"
      append-to-body
    >
      <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-position="top" class="mt-2">
        <div class="grid grid-cols-1 gap-4">
          <el-form-item label="Tòa nhà" prop="building_id" required>
            <el-select v-model="addForm.building_id" class="!w-full">
              <el-option v-for="b in buildings" :key="b.id" :label="b.name" :value="b.id" />
            </el-select>
          </el-form-item>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="Chọn phòng" prop="room_id" required>
            <el-input v-model="addForm.room_id" placeholder="Ví dụ: A-101, B-202..." />
          </el-form-item>
          <el-form-item label="Họ tên người thuê" prop="tenant_name" required>
            <el-input v-model="addForm.tenant_name" placeholder="Nguyễn Văn A..." />
          </el-form-item>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="Số điện thoại" prop="phone" required>
            <el-input v-model="addForm.phone" placeholder="09xx.xxx.xxx" />
          </el-form-item>
          <el-form-item label="Ngày bắt đầu" prop="start_date" required>
            <el-date-picker v-model="addForm.start_date" type="date" placeholder="Chọn ngày" class="!w-full" format="DD/MM/YYYY" value-format="DD/MM/YYYY" />
          </el-form-item>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="Ngày kết thúc" prop="end_date" required>
            <el-date-picker v-model="addForm.end_date" type="date" placeholder="Chọn ngày" class="!w-full" format="DD/MM/YYYY" value-format="DD/MM/YYYY" />
          </el-form-item>
          <el-form-item label="Giá thuê (VNĐ/tháng)" prop="rent_price" required>
            <el-input v-model.number="addForm.rent_price" placeholder="Ví dụ: 5000000">
              <template #append>VNĐ</template>
            </el-input>
          </el-form-item>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="Tiền đặt cọc (VNĐ)" prop="deposit" required>
            <el-input v-model.number="addForm.deposit" placeholder="Ví dụ: 10000000">
              <template #append>VNĐ</template>
            </el-input>
          </el-form-item>
          <el-form-item label="Trạng thái hợp đồng" prop="status" required>
            <el-select v-model="addForm.status" class="!w-full">
              <el-option label="Hoạt động" value="active" />
              <el-option label="Hết hạn" value="expired" />
              <el-option label="Đã chấm dứt" value="terminated" />
            </el-select>
          </el-form-item>
        </div>

        <el-form-item label="Quá trình ký kết hợp đồng" prop="signing_process">
          <el-input v-model="addForm.signing_process" type="textarea" :rows="3" placeholder="Nhập các giai đoạn: Đặt cọc, Gửi dự thảo, Hoàn tất..." />
        </el-form-item>

        <el-form-item label="File đính kèm (Điều khoản/Hợp đồng scan)" prop="attachments">
          <el-upload
            class="contract-upload-v3"
            action="#"
            :auto-upload="false"
            multiple
            v-model:file-list="addForm.attachments"
          >
            <el-button type="primary" link class="!text-xs font-bold">
              <el-icon class="mr-1"><Upload /></el-icon> Tải lên tài liệu hoặc ảnh scan
            </el-button>
            <template #tip>
              <div class="text-[10px] text-dim mt-1">
                Hỗ trợ định dạng PDF, JPG, PNG (Tối đa 10MB/file)
              </div>
            </template>
          </el-upload>
        </el-form-item>

        <!-- Dịch vụ đi kèm -->
        <div class="mt-6 mb-4 pt-6 border-t border-dashed border-row">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-[11px] font-black uppercase tracking-widest text-dim flex items-center gap-2">
              <el-icon class="text-blue-500"><Service /></el-icon>
              Dịch vụ đi kèm
            </h3>
            <el-button type="primary" link @click="addServiceRow" class="!text-xs font-bold">
              <el-icon class="mr-1"><Plus /></el-icon> Thêm dịch vụ mới
            </el-button>
          </div>
          
          <div v-for="(svc, index) in addForm.services" :key="index" class="grid grid-cols-12 gap-3 mb-3 items-end">
            <div class="col-span-6">
              <el-form-item :label="index === 0 ? 'Tên dịch vụ' : ''" class="!mb-0">
                <el-input v-model="svc.name" placeholder="Ví dụ: Phí gửi xe, Vệ sinh..." />
              </el-form-item>
            </div>
            <div class="col-span-5">
              <el-form-item :label="index === 0 ? 'Giá dịch vụ (đ)' : ''" class="!mb-0">
                <el-input v-model.number="svc.price" placeholder="0">
                  <template #append>đ</template>
                </el-input>
              </el-form-item>
            </div>
            <div class="col-span-1 flex justify-center pb-2">
              <el-button type="danger" link @click="removeServiceRow(index)" :disabled="addForm.services.length <= 1">
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </div>
        </div>
      </el-form>

      <template #footer>
        <div class="flex justify-end gap-3 px-4 pb-4 mt-4">
          <el-button @click="addDialogVisible = false" class="theme-btn-cancel">Hủy bỏ</el-button>
          <el-button type="primary" @click="submitAddForm" class="theme-btn-submit">
            Ký hợp đồng ngay
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
  Delete,
  Upload,
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
const addDialogVisible = ref(false);
const addFormRef = ref(null);
const selectedContract = ref(null);

const addForm = ref({
  building_id: null,
  room_id: '',
  tenant_name: '',
  phone: '',
  start_date: '',
  end_date: '',
  rent_price: null,
  deposit: null,
  status: 'active',
  services: [
    { name: 'Điện', price: 3500 },
    { name: 'Nước', price: 100000 }
  ],
  signing_process: '',
  attachments: []
});

const addRules = {
  building_id: [{ required: true, message: 'Vui lòng chọn tòa nhà', trigger: 'change' }],
  room_id: [{ required: true, message: 'Vui lòng nhập phòng', trigger: 'blur' }],
  tenant_name: [{ required: true, message: 'Vui lòng nhập tên người thuê', trigger: 'blur' }],
  phone: [{ required: true, message: 'Vui lòng nhập số điện thoại', trigger: 'blur' }],
  start_date: [{ required: true, message: 'Vui lòng chọn ngày bắt đầu', trigger: 'change' }],
  end_date: [{ required: true, message: 'Vui lòng chọn ngày kết thúc', trigger: 'change' }],
  rent_price: [{ required: true, message: 'Vui lòng nhập giá thuê', trigger: 'blur' }],
  deposit: [{ required: true, message: 'Vui lòng nhập tiền cọc', trigger: 'blur' }],
  status: [{ required: true, message: 'Vui lòng chọn trạng thái', trigger: 'change' }],
};

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
  if (contract.status === "expired") return "#EF4444"; // Rose
  if (contract.status === "expiring") return "#F59E0B"; // Amber
  // In Light mode, we want a darker gray. In Dark mode, a lighter gray.
  // Using a neutral color that works fairly well on both, or we can use a CSS variable.
  return "var(--text-main)";
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
  addForm.value = {
    id: '',
    building_id: null,
    room_id: '',
    tenant_name: '',
    phone: '',
    start_date: '',
    end_date: '',
    rent_price: null,
    deposit: null,
    status: 'active',
    services: [
      { name: 'Điện', price: 3500 },
      { name: 'Nước', price: 100000 }
    ],
    signing_process: '',
    attachments: []
  };
  addDialogVisible.value = true;
};

const addServiceRow = () => {
  addForm.value.services.push({ name: '', price: null });
};

const removeServiceRow = (index) => {
  if (addForm.value.services.length > 1) {
    addForm.value.services.splice(index, 1);
  }
};

const submitAddForm = async () => {
  const valid = await addFormRef.value.validate().catch(() => false)
  if (!valid) return
  console.log('Submit contract:', addForm.value);
  ElMessage.success("Thêm hợp đồng mới thành công (giả lập)");
  addDialogVisible.value = false;
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
  --action-btn-bg: #f1f5f9;
  --action-btn-color: #64748b;
  --card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --stat-active-bg: rgba(16, 185, 129, 0.1);
  --stat-expiring-bg: rgba(245, 158, 11, 0.1);
  --stat-expired-bg: rgba(239, 68, 68, 0.1);
  --text-id: #3B82F6;
}

html.dark {
  --bg-page: #111827;
  --bg-card: #1f2937;
  --bg-table-head: #1f2937;
  --bg-table-body: #111827;
  --text-main: #ffffff;
  --text-dim: #6b7280;
  --text-muted: #9ca3af;
  --border-main: #374151;
  --border-row: #1f2937;
  --action-btn-bg: #374151;
  --action-btn-color: #9ca3af;
  --card-shadow: none;
  --stat-active-bg: rgba(16, 185, 129, 0.15);
  --stat-expiring-bg: rgba(245, 158, 11, 0.15);
  --stat-expired-bg: rgba(239, 68, 68, 0.15);
  --text-id: #9ca3af;
}
</style>

<style scoped>
.contracts-page {
  background-color: var(--bg-page) !important;
  color: var(--text-main);
  transition: background-color 0.3s ease, color 0.3s ease;
  min-height: 100%;
}

.text-main { color: var(--text-main); }
.text-dim { color: var(--text-dim); }
.text-muted { color: var(--text-muted); }
.border-main { border-color: var(--border-main); }
.text-id { color: var(--text-id); }
.border-row { border-color: var(--border-row); }

.card-item {
  background-color: var(--bg-card) !important;
  border-color: var(--border-main) !important;
  box-shadow: var(--card-shadow);
}

.stat-card {
  transition: all 0.3s ease;
  backdrop-filter: blur(12px);
}

.card-emerald { background-color: rgba(16, 185, 129, 0.05) !important; border-color: rgba(16, 185, 129, 0.1) !important; }
.card-amber { background-color: rgba(245, 158, 11, 0.05) !important; border-color: rgba(245, 158, 11, 0.1) !important; }
.card-rose { background-color: rgba(239, 68, 68, 0.05) !important; border-color: rgba(239, 68, 68, 0.1) !important; }

html.dark .card-emerald { background-color: rgba(16, 185, 129, 0.1) !important; border-color: rgba(16, 185, 129, 0.2) !important; }
html.dark .card-amber { background-color: rgba(245, 158, 11, 0.1) !important; border-color: rgba(245, 158, 11, 0.2) !important; }
html.dark .card-rose { background-color: rgba(239, 68, 68, 0.1) !important; border-color: rgba(239, 68, 68, 0.2) !important; }

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.2);
}

.card-emerald:hover { background-color: rgba(16, 185, 129, 0.15) !important; }
.card-amber:hover { background-color: rgba(245, 158, 11, 0.15) !important; }
.card-rose:hover { background-color: rgba(239, 68, 68, 0.15) !important; }

.table-container {
  background-color: var(--bg-page);
  border-color: var(--border-main);
}

.table-head {
  background-color: var(--bg-table-head);
}

.table-head tr {
  border-bottom-color: var(--border-main);
}

.table-body {
  background-color: var(--bg-table-body);
}

.table-row {
  border-bottom-color: var(--border-row);
}

.table-row:hover {
  background-color: var(--bg-card);
}

.pagination-bar {
  background-color: var(--bg-table-head);
  border-top-color: var(--border-main);
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--action-btn-bg);
  color: var(--action-btn-color);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-view:hover {
  background-color: rgba(59, 130, 246, 0.15) !important;
  color: #3b82f6 !important;
}

.btn-extend:hover {
  background-color: rgba(16, 185, 129, 0.15) !important;
  color: #10b981 !important;
}

.btn-print:hover {
  background-color: rgba(245, 158, 11, 0.15) !important;
  color: #f59e0b !important;
}

/* Custom Select Styling */
:deep(.contracts-select .el-input__wrapper),
:deep(.mini-select .el-input__wrapper) {
  background-color: var(--bg-page) !important;
  border: 1px solid var(--border-main) !important;
  box-shadow: none !important;
  border-radius: 10px;
}

:deep(.contracts-select .el-input__inner),
:deep(.mini-select .el-input__inner) {
  color: var(--text-main) !important;
}

/* Modal Styles */
:deep(.contract-details-dialog) {
  background-color: var(--bg-card) !important;
  border-radius: 24px !important;
  border: 1px solid var(--border-main) !important;
}

:deep(.contract-details-dialog .el-dialog__title) {
  color: var(--text-main) !important;
  font-weight: 900;
  text-transform: uppercase;
}

.detail-item label {
  display: block;
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-bottom: 4px;
}

.service-box, .terms-box {
  background-color: var(--bg-page);
  border-color: var(--border-row);
}

.btn-cancel {
  background-color: var(--action-btn-bg) !important;
  border: none !important;
  color: var(--text-main) !important;
  border-radius: 12px !important;
  font-weight: bold !important;
}

.btn-confirm {
  background-color: #3b82f6 !important;
  border: none !important;
  color: #fff !important;
  border-radius: 12px !important;
  font-weight: bold !important;
}

:deep(.el-timeline-item__content) {
  color: var(--text-main);
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

/* Upload Styling */
:deep(.contract-upload-v3 .el-upload-list) {
  margin-top: 12px;
}
:deep(.contract-upload-v3 .el-upload-list__item) {
  background-color: var(--bg-page);
  border: 1px solid var(--border-row);
  border-radius: 12px;
  padding: 8px 12px;
  transition: all 0.2s ease;
}
:deep(.contract-upload-v3 .el-upload-list__item:hover) {
  background-color: var(--bg-card);
  border-color: #3b82f6;
}
:deep(.contract-upload-v3 .el-upload-list__item .el-upload-list__item-name) {
  color: var(--text-main);
  font-weight: 600;
  font-size: 12px;
}
</style>

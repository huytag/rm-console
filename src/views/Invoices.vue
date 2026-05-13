<template>
  <div class="invoices-page min-h-full p-6 font-inter">
    <!-- Top Bar -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-black text-main">Danh Sách Hóa Đơn</h1>
      <div class="flex items-center gap-4">
        <el-select
          v-model="filters.status"
          placeholder="Tất cả trạng thái"
          clearable
          class="theme-select"
          style="width: 180px;"
        >
          <el-option label="Chờ thanh toán" value="unpaid" />
          <el-option label="Đã thanh toán" value="paid" />
          <el-option label="Quá hạn" value="overdue" />
          <el-option label="Thanh toán 1 phần" value="partial" />
        </el-select>
        
        <button
          class="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-105"
          style="background-color: #3B82F6;"
          @click="openAddModal"
        >
          <el-icon><Plus /></el-icon>
          Thêm hóa đơn
        </button>
      </div>
    </div>

    <!-- Table Section -->
    <div class="rounded-2xl border border-main overflow-hidden shadow-2xl bg-table">
      <div class="overflow-x-auto">
        <table class="w-full text-sm border-collapse">
          <thead class="bg-header">
            <tr class="border-b border-main">
              <th class="px-5 py-4 text-left text-[11px] font-black uppercase tracking-widest text-dim">ID</th>
              <th class="px-5 py-4 text-left text-[11px] font-black uppercase tracking-widest text-dim">Phòng / Tòa nhà</th>
              <th class="px-5 py-4 text-center text-[11px] font-black uppercase tracking-widest text-dim">Tháng / Năm</th>
              <th class="px-5 py-4 text-right text-[11px] font-black uppercase tracking-widest text-dim">Tiền phòng</th>
              <th class="px-5 py-4 text-right text-[11px] font-black uppercase tracking-widest text-dim">Tổng tiền</th>
              <th class="px-5 py-4 text-right text-[11px] font-black uppercase tracking-widest text-dim">Đã trả</th>
              <th class="px-5 py-4 text-center text-[11px] font-black uppercase tracking-widest text-dim">Trạng thái</th>
              <th class="px-5 py-4 text-left text-[11px] font-black uppercase tracking-widest text-dim">Hạn trả</th>
              <th class="px-5 py-4 text-center text-[11px] font-black uppercase tracking-widest text-dim">Thao tác</th>
            </tr>
          </thead>
          <tbody v-if="!loading" class="bg-table">
            <tr
              v-for="(row, index) in paginatedInvoices"
              :key="row.id"
              class="table-row-hover transition-colors border-b last:border-0 border-main"
            >
              <!-- ID -->
              <td class="px-5 py-4">
                <span class="font-bold text-xs text-id">{{ row.invoice_code || `#HD-${String(row.id).padStart(4, '0')}` }}</span>
              </td>

              <!-- Phòng -->
              <td class="px-5 py-4">
                <p class="font-bold text-main text-sm mb-0.5">{{ row.contract?.room?.room_number || row.room_number }}</p>
                <p class="text-[11px] text-dim font-medium">{{ row.building_name || 'N/A' }}</p>
              </td>

              <!-- Tháng/Năm -->
              <td class="px-5 py-4 text-center text-main font-bold">{{ row.month }}/{{ row.year }}</td>

              <!-- Tiền phòng -->
              <td class="px-5 py-4 text-right text-dim font-medium">{{ formatPrice(row.room_price) }}</td>

              <!-- Tổng tiền -->
              <td class="px-5 py-4 text-right">
                <span class="text-main font-black text-sm">{{ formatPrice(row.total_amount) }}</span>
              </td>

              <!-- Đã trả -->
              <td class="px-5 py-4 text-right">
                <span class="text-main font-black text-sm">{{ formatPrice(row.paid_amount) }}</span>
              </td>

              <!-- Trạng thái -->
              <td class="px-5 py-4 text-center">
                <span
                  class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                  :style="getStatusStyle(row.status)"
                >
                  {{ getStatusLabel(row.status) }}
                </span>
              </td>

              <!-- Hạn thanh toán -->
              <td class="px-5 py-4">
                <span class="text-xs font-bold text-dim">{{ row.due_date }}</span>
              </td>

              <!-- Thao tác -->
              <td class="px-5 py-4 text-center">
                <div class="flex items-center justify-center gap-3">
                  <button class="action-btn btn-view" title="Xem chi tiết" @click="openInvoiceDetails(row)">
                    <el-icon size="16"><View /></el-icon>
                  </button>
                  <button class="action-btn btn-print" title="In hóa đơn" @click="exportPdf(row)">
                    <el-icon size="16"><Printer /></el-icon>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between px-6 py-4 bg-header border-t border-main">
        <p class="text-xs font-bold text-dim uppercase tracking-widest">
          Tổng cộng <span class="text-main">{{ filteredInvoices.length }}</span> hóa đơn
        </p>

        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <span class="text-[11px] font-bold text-dim uppercase">Hiển thị</span>
            <el-select v-model="pageSize" style="width: 100px;" class="theme-select-mini">
              <el-option label="10/trang" :value="10" />
              <el-option label="20/trang" :value="20" />
            </el-select>
          </div>

          <div class="flex items-center gap-1">
            <button
              class="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30 text-dim hover:text-main"
              :disabled="currentPage === 1"
              @click="currentPage--"
            >
              <el-icon><ArrowLeft /></el-icon>
            </button>

            <button
              v-for="page in visiblePages"
              :key="page"
              class="w-8 h-8 rounded-lg text-xs font-black transition-all"
              :class="page === currentPage ? 'bg-blue-600 text-white' : 'text-dim hover:text-main'"
              @click="currentPage = page"
            >
              {{ page }}
            </button>

            <button
              class="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30 text-dim hover:text-main"
              :disabled="currentPage === totalPages"
              @click="currentPage++"
            >
              <el-icon><ArrowRight /></el-icon>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- QR Payment Dialog -->
    <el-dialog v-model="qrVisible" title="Thanh toán qua VietQR" width="400px" center class="theme-dialog">
      <div class="flex flex-col items-center justify-center p-2 min-h-[200px]" v-loading="qrLoading">
        <div v-if="currentInvoice?.payment_qr" class="text-center w-full">
          <p class="font-bold text-lg mb-4 text-blue-500">Số tiền: {{ formatPrice(currentInvoice.total_amount) }}</p>
          <img :src="currentInvoice.payment_qr" class="w-[250px] h-[250px] rounded-xl mb-4 mx-auto object-contain border-main border-2" />
          <p class="text-sm text-dim">Dùng ứng dụng ngân hàng để quét mã QR</p>
        </div>
        <div v-else class="flex flex-col items-center justify-center w-full h-full">
          <button class="px-6 py-2.5 rounded-xl font-bold text-white transition-all hover:opacity-90" style="background-color: #3B82F6;" @click="generateQR">
            Tạo mã QR thanh toán
          </button>
        </div>
      </div>
    </el-dialog>

    <!-- Invoice Details Dialog -->
    <el-dialog
      v-model="invoiceDetailsVisible"
      title="Chi tiết Hóa đơn"
      width="700px"
      class="invoice-details-dialog theme-dialog"
      :align-center="true"
    >
      <div v-if="selectedInvoice" class="p-4 overflow-y-auto max-h-[75vh]">
        <div class="grid grid-cols-2 gap-8">
          <!-- Left Column -->
          <div class="flex flex-col gap-6">
            <div class="detail-item">
              <label>Mã Hóa đơn</label>
              <p class="font-black text-blue-500 text-lg">{{ selectedInvoice.invoice_code || `#HD-${String(selectedInvoice.id).padStart(4, '0')}` }}</p>
            </div>
            <div class="detail-item">
              <label>Mã Hợp đồng</label>
              <p class="text-main font-bold">#HĐ-{{ String(selectedInvoice.contract_id || 982).padStart(4, '0') }}</p>
            </div>
            <div class="detail-item">
              <label>Thời gian</label>
              <p class="text-main font-bold">Tháng {{ selectedInvoice.month }} / {{ selectedInvoice.year }}</p>
            </div>
            <div class="detail-item">
              <label>Giá phòng</label>
              <p class="text-main font-black">{{ formatPrice(selectedInvoice.room_price) }}</p>
            </div>
            <div class="detail-item">
              <label>Tổng tiền</label>
              <p class="text-emerald-400 font-black text-xl">{{ formatPrice(selectedInvoice.total_amount) }}</p>
            </div>
          </div>

          <!-- Right Column -->
          <div class="flex flex-col gap-6">
            <div class="detail-item">
              <label>Trạng thái</label>
              <div class="mt-1">
                <span
                  class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                  :style="getStatusStyle(selectedInvoice.status)"
                >
                  {{ getStatusLabel(selectedInvoice.status) }}
                </span>
              </div>
            </div>
            <div class="detail-item">
              <label>Hạn chót thanh toán</label>
              <p class="text-rose-500 font-bold">{{ selectedInvoice.due_date }}</p>
            </div>
            <div class="detail-item">
              <label>Số tiền đã trả</label>
              <p class="text-main font-black">{{ formatPrice(selectedInvoice.paid_amount) }}</p>
            </div>
            <div class="detail-item">
              <label>Hình thức thanh toán</label>
              <p class="text-main font-bold">{{ selectedInvoice.payment_method || 'Chuyển khoản ngân hàng' }}</p>
            </div>
            <div class="detail-item">
              <label>Ngày tạo / Cập nhật</label>
              <p class="text-xs text-dim font-medium mt-1">
                Tạo: {{ selectedInvoice.created_at || '01/10/2023' }} <br/>
                Sửa: {{ selectedInvoice.updated_at || '05/10/2023' }}
              </p>
            </div>
          </div>
        </div>

        <div class="mt-8 pt-6 border-t border-main">
          <label class="text-[10px] font-black uppercase tracking-widest text-dim block mb-4">Thông tin Điện & Nước</label>
          <div class="grid grid-cols-1 gap-4">
            <!-- Điện Section -->
            <div class="bg-section border border-main rounded-2xl p-5">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center text-yellow-500 shadow-lg shadow-yellow-500/10">
                    <el-icon size="24"><Lightning /></el-icon>
                  </div>
                  <div>
                    <h4 class="text-main font-black text-base uppercase tracking-wider">Chỉ số Điện</h4>
                    <p class="text-[10px] text-dim font-black uppercase tracking-widest mt-0.5">Tiêu thụ: <span class="text-yellow-500">{{ (selectedInvoice.elec_current || 1250) - (selectedInvoice.elec_previous || 1120) }} kWh</span></p>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-sub-section p-3 rounded-xl border border-main">
                  <span class="text-[10px] font-black text-dim uppercase block mb-1">Chỉ số Đầu (Tháng trước)</span>
                  <p class="text-main font-black text-lg">{{ selectedInvoice.elec_previous || 1120 }} <span class="text-xs text-dim font-medium ml-1">kWh</span></p>
                </div>
                <div class="bg-sub-section p-3 rounded-xl border border-main">
                  <span class="text-[10px] font-black text-dim uppercase block mb-1">Chỉ số Cuối (Tháng này)</span>
                  <p class="text-yellow-500 font-black text-lg">{{ selectedInvoice.elec_current || 1250 }} <span class="text-xs text-dim font-medium ml-1">kWh</span></p>
                </div>
              </div>
            </div>

            <!-- Nước Section -->
            <div class="bg-section border border-main rounded-2xl p-5">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 shadow-lg shadow-blue-500/10">
                    <el-icon size="24"><Odometer /></el-icon>
                  </div>
                  <div>
                    <h4 class="text-main font-black text-base uppercase tracking-wider">Chỉ số Nước</h4>
                    <p class="text-[10px] text-dim font-black uppercase tracking-widest mt-0.5">Tiêu thụ: <span class="text-blue-400">{{ (selectedInvoice.water_current || 85) - (selectedInvoice.water_previous || 78) }} m³</span></p>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-sub-section p-3 rounded-xl border border-main">
                  <span class="text-[10px] font-black text-dim uppercase block mb-1">Chỉ số Đầu (Tháng trước)</span>
                  <p class="text-main font-black text-lg">{{ selectedInvoice.water_previous || 78 }} <span class="text-xs text-dim font-medium ml-1">m³</span></p>
                </div>
                <div class="bg-sub-section p-3 rounded-xl border border-main">
                  <span class="text-[10px] font-black text-dim uppercase block mb-1">Chỉ số Cuối (Tháng này)</span>
                  <p class="text-blue-400 font-black text-lg">{{ selectedInvoice.water_current || 85 }} <span class="text-xs text-dim font-medium ml-1">m³</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8 pt-6 border-t border-main">
          <div class="detail-item">
            <label class="mb-2 block">Ghi chú</label>
            <div class="bg-section rounded-xl p-4 border border-main">
              <p class="text-sm text-dim italic">
                {{ selectedInvoice.notes || "Không có ghi chú nào cho hóa đơn này." }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-3 p-4">
          <el-button @click="invoiceDetailsVisible = false" class="theme-btn-secondary">Đóng</el-button>
          <el-button type="success" @click="showPaymentQR(selectedInvoice)" v-if="selectedInvoice.status !== 'paid'" class="theme-btn-success">
            Thanh toán QR
          </el-button>
          <el-button type="primary" @click="exportPdf(selectedInvoice)" class="theme-btn-primary">
            <el-icon class="mr-2"><Printer /></el-icon> In hóa đơn
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog 
      v-model="addDialogVisible" 
      title="Khởi tạo Hóa đơn mới" 
      width="750px"
      class="theme-dialog-v3"
      append-to-body
    >
      <el-form :model="addForm" :rules="rules" ref="formRef" label-position="top" class="mt-2">
        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="Tòa nhà" prop="building_name" required>
            <el-select v-model="addForm.building_name" class="!w-full">
              <el-option label="Tòa nhà Blue Moon" value="Blue Moon" />
              <el-option label="Sunrise Tower" value="Sunrise Tower" />
            </el-select>
          </el-form-item>
          <el-form-item label="Mã phòng" prop="room_number" required>
            <el-input v-model="addForm.room_number" placeholder="P.101..." />
          </el-form-item>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <el-form-item label="Mã hợp đồng" prop="contract_id" required>
            <el-input v-model="addForm.contract_id" placeholder="HĐ-982..." />
          </el-form-item>
          <el-form-item label="Tháng và Năm" prop="month_year" required>
            <el-date-picker v-model="addForm.month_year" type="month" placeholder="Chọn tháng" class="!w-full" format="MM/YYYY" value-format="MM/YYYY" />
          </el-form-item>
          <el-form-item label="Giá phòng" prop="room_price" required>
            <el-input v-model.number="addForm.room_price" placeholder="Giá...">
              <template #append>VNĐ</template>
            </el-input>
          </el-form-item>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <el-form-item label="Tổng tiền" prop="total_amount" required>
            <el-input v-model.number="addForm.total_amount" placeholder="Tổng...">
              <template #append>VNĐ</template>
            </el-input>
          </el-form-item>
          <el-form-item label="Số tiền đã trả" prop="paid_amount" required>
            <el-input v-model.number="addForm.paid_amount" placeholder="Đã trả...">
              <template #append>VNĐ</template>
            </el-input>
          </el-form-item>
          <el-form-item label="Trạng thái" prop="status" required>
            <el-select v-model="addForm.status" class="!w-full">
              <el-option label="Đã thanh toán" value="paid" />
              <el-option label="Chưa thanh toán" value="unpaid" />
              <el-option label="Thanh toán một phần" value="partial" />
            </el-select>
          </el-form-item>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="Hạn trả" prop="due_date" required>
            <el-date-picker v-model="addForm.due_date" type="date" placeholder="Chọn ngày" class="!w-full" format="DD/MM/YYYY" value-format="DD/MM/YYYY" />
          </el-form-item>
          <el-form-item label="Hình thức thanh toán" prop="payment_method" required>
            <el-select v-model="addForm.payment_method" class="!w-full">
              <el-option label="Tiền mặt" value="Tiền mặt" />
              <el-option label="Chuyển khoản" value="Chuyển khoản" />
            </el-select>
          </el-form-item>
        </div>

        <!-- Utility Readings -->
        <div class="mt-4 p-4 rounded-xl border border-dashed border-row bg-header">
          <p class="text-[10px] font-black uppercase tracking-widest text-dim mb-4 flex items-center gap-2">
            <el-icon class="text-blue-500"><Lightning /></el-icon> Chỉ số điện nước
          </p>
          <div class="grid grid-cols-2 gap-x-8 gap-y-4">
            <div class="space-y-3">
              <p class="text-[9px] font-bold text-main uppercase">Điện (kWh)</p>
              <div class="grid grid-cols-2 gap-3">
                <el-form-item prop="elec_previous" required class="!mb-0">
                  <el-input v-model.number="addForm.elec_previous" placeholder="Tháng trước" size="small" />
                </el-form-item>
                <el-form-item prop="elec_current" required class="!mb-0">
                  <el-input v-model.number="addForm.elec_current" placeholder="Tháng này" size="small" />
                </el-form-item>
              </div>
            </div>
            <div class="space-y-3">
              <p class="text-[9px] font-bold text-main uppercase">Nước (m³)</p>
              <div class="grid grid-cols-2 gap-3">
                <el-form-item prop="water_previous" required class="!mb-0">
                  <el-input v-model.number="addForm.water_previous" placeholder="Tháng trước" size="small" />
                </el-form-item>
                <el-form-item prop="water_current" required class="!mb-0">
                  <el-input v-model.number="addForm.water_current" placeholder="Tháng này" size="small" />
                </el-form-item>
              </div>
            </div>
          </div>
        </div>

        <el-form-item label="Ghi chú hóa đơn" prop="notes" class="mt-4">
          <el-input v-model="addForm.notes" type="textarea" :rows="2" placeholder="Nhập ghi chú hoặc diễn giải..." />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="flex justify-end gap-3 px-4 pb-4 mt-4">
          <el-button @click="addDialogVisible = false" class="theme-btn-cancel-v3">Hủy bỏ</el-button>
          <el-button type="primary" @click="submitAddForm" class="theme-btn-submit-v3">
            Xuất hóa đơn
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import api from '../axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, ArrowLeft, ArrowRight, View, Printer, Lightning, Odometer } from '@element-plus/icons-vue'

// ========== MOCK DATA ==========
const mockInvoices = [
  { id: 21, invoice_code: 'HD-0021', room_number: 'Phòng 101', building_name: 'Blue Moon', month: 10, year: 2023, room_price: 3500000, total_amount: 4250000, paid_amount: 4250000, status: 'paid', due_date: '05/10/2023' },
  { id: 22, invoice_code: 'HD-0022', room_number: 'Phòng 203', building_name: 'Green House', month: 10, year: 2023, room_price: 2800000, total_amount: 3120000, paid_amount: 0, status: 'unpaid', due_date: '05/10/2023' },
  { id: 23, invoice_code: 'HD-0023', room_number: 'Phòng 302', building_name: 'Sunlight Apartment', month: 9, year: 2023, room_price: 4500000, total_amount: 5400000, paid_amount: 1000000, status: 'overdue', due_date: '05/09/2023' },
  { id: 24, invoice_code: 'HD-0024', room_number: 'Phòng 105', building_name: 'Blue Moon', month: 10, year: 2023, room_price: 3000000, total_amount: 3800000, paid_amount: 3800000, status: 'paid', due_date: '05/10/2023' },
  { id: 25, invoice_code: 'HD-0025', room_number: 'Phòng 404', building_name: 'Green House', month: 10, year: 2023, room_price: 2500000, total_amount: 2950000, paid_amount: 0, status: 'unpaid', due_date: '05/10/2023' },
  { id: 26, invoice_code: 'HD-0026', room_number: 'Phòng 201', building_name: 'Blue Moon', month: 10, year: 2023, room_price: 3200000, total_amount: 3500000, paid_amount: 0, status: 'unpaid', due_date: '05/10/2023' },
  { id: 27, invoice_code: 'HD-0027', room_number: 'Phòng 305', building_name: 'Sunlight Apartment', month: 9, year: 2023, room_price: 4000000, total_amount: 4800000, paid_amount: 2000000, status: 'partial', due_date: '05/09/2023' },
  { id: 28, invoice_code: 'HD-0028', room_number: 'Phòng 202', building_name: 'Green House', month: 10, year: 2023, room_price: 3000000, total_amount: 3300000, paid_amount: 0, status: 'unpaid', due_date: '05/10/2023' },
  { id: 29, invoice_code: 'HD-0029', room_number: 'Phòng 401', building_name: 'Sunlight Apartment', month: 10, year: 2023, room_price: 4200000, total_amount: 4600000, paid_amount: 4600000, status: 'paid', due_date: '05/10/2023' },
  { id: 30, invoice_code: 'HD-0030', room_number: 'Phòng 102', building_name: 'Blue Moon', month: 10, year: 2023, room_price: 3500000, total_amount: 4000000, paid_amount: 0, status: 'unpaid', due_date: '05/10/2023' },
  { id: 31, invoice_code: 'HD-0031', room_number: 'Phòng 303', building_name: 'Green House', month: 10, year: 2023, room_price: 2800000, total_amount: 3200000, paid_amount: 0, status: 'unpaid', due_date: '05/10/2023' },
]

// ========== STATE ==========
const invoices = ref(mockInvoices)
const loading = ref(false)

const filters = ref({
  status: null,
})

const currentPage = ref(1)
const pageSize = ref(10)
const invoiceDetailsVisible = ref(false)
const selectedInvoice = ref(null)


// ========== COMPUTED ==========
const filteredInvoices = computed(() => {
  let result = invoices.value
  if (filters.value.status) {
    result = result.filter(i => i.status === filters.value.status)
  }
  return result
})

const totalPages = computed(() => Math.ceil(filteredInvoices.value.length / pageSize.value) || 1)

const paginatedInvoices = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredInvoices.value.slice(start, start + pageSize.value)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  for (let i = 1; i <= Math.min(total, 5); i++) pages.push(i)
  return pages
})

// Reset page to 1 when page size changes
watch(pageSize, () => {
  currentPage.value = 1
})

// ========== METHODS ==========
const formatPrice = (price) => {
  if (!price) return '0đ'
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ'
}

const getStatusLabel = (status) => {
  const labels = {
    unpaid: 'Chờ thanh toán',
    paid: 'Đã thanh toán',
    partial: 'Thanh toán 1 phần',
    overdue: 'Quá hạn'
  }
  return labels[status] || status
}

const getStatusStyle = (status) => {
  const styles = {
    paid: 'color: #10B981; background-color: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2);',
    unpaid: 'color: #F59E0B; background-color: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.2);',
    overdue: 'color: #EF4444; background-color: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2);',
    partial: 'color: #3B82F6; background-color: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2);',
  }
  return styles[status] || 'color: #9CA3AF; background-color: rgba(156, 163, 175, 0.1);'
}

const fetchInvoices = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      per_page: pageSize.value,
      ...(filters.value.status && { status: filters.value.status }),
    }
    const response = await api.get('/invoices', { params })
    const apiData = response.data?.data || response.data || response
    if (apiData && Array.isArray(apiData) && apiData.length > 0) {
      invoices.value = apiData
    }
  } catch (error) {
    // Keep mock data if failed
  } finally {
    loading.value = false
  }
}

const approvePayment = async (invoice) => {
  try {
    await ElMessageBox.confirm(
      'Xác nhận duyệt thanh toán cho hóa đơn này?',
      'Xác nhận',
      { type: 'warning' }
    )
    
    await api.put(`/invoices/${invoice.id}/approve`)
    ElMessage.success('Duyệt thanh toán thành công')
    fetchInvoices()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Failed to approve payment')
    }
  }
}

const exportPdf = (invoice) => {
  window.open(`/api/invoices/${invoice.id}/pdf`, '_blank')
}

const generateInvoices = async () => {
  try {
    const now = new Date()
    await api.post('/invoices/generate', {
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    })
    ElMessage.success('Đã tạo hóa đơn tháng')
    fetchInvoices()
  } catch (error) {
    ElMessage.error('Failed to generate invoices')
  }
}

// ========== QR DIALOG ==========
const qrVisible = ref(false)
const qrLoading = ref(false)
const currentInvoice = ref(null)

const viewDetail = (invoice) => {
  ElMessage.info(`Xem chi tiết hóa đơn: ${invoice.invoice_code}`)
}

const openInvoiceDetails = (invoice) => {
  selectedInvoice.value = invoice;
  invoiceDetailsVisible.value = true;
};

const showPaymentQR = async (invoice) => {
  currentInvoice.value = invoice
  qrVisible.value = true
}

const generateQR = async () => {
  if (!currentInvoice.value) return
  qrLoading.value = true
  try {
    const response = await api.post(`/invoices/${currentInvoice.value.id}/generate-qr`)
    currentInvoice.value.payment_qr = response.data.data.qr_url
    ElMessage.success('Đã tạo mã QR')
  } catch (error) {
    ElMessage.error('Không thể tạo mã QR')
  } finally {
    qrLoading.value = false
  }
}

// ========== ADD INVOICE MODAL ==========
const addDialogVisible = ref(false)
const formRef = ref(null)

const rules = {
  building_name: [{ required: true, message: 'Vui lòng chọn tòa nhà', trigger: 'change' }],
  room_number: [{ required: true, message: 'Vui lòng nhập phòng', trigger: 'blur' }],
  contract_id: [{ required: true, message: 'Vui lòng nhập mã hợp đồng', trigger: 'blur' }],
  month_year: [{ required: true, message: 'Vui lòng chọn tháng/năm', trigger: 'change' }],
  room_price: [{ required: true, message: 'Vui lòng nhập giá phòng', trigger: 'blur' }],
  total_amount: [{ required: true, message: 'Vui lòng nhập tổng tiền', trigger: 'blur' }],
  paid_amount: [{ required: true, message: 'Vui lòng nhập số tiền đã trả', trigger: 'blur' }],
  status: [{ required: true, message: 'Vui lòng chọn trạng thái', trigger: 'change' }],
  due_date: [{ required: true, message: 'Vui lòng chọn hạn trả', trigger: 'change' }],
  payment_method: [{ required: true, message: 'Vui lòng chọn hình thức thanh toán', trigger: 'change' }],
  elec_previous: [{ required: true, message: 'Vui lòng nhập chỉ số điện trước', trigger: 'blur' }],
  elec_current: [{ required: true, message: 'Vui lòng nhập chỉ số điện sau', trigger: 'blur' }],
  water_previous: [{ required: true, message: 'Vui lòng nhập chỉ số nước trước', trigger: 'blur' }],
  water_current: [{ required: true, message: 'Vui lòng nhập chỉ số nước sau', trigger: 'blur' }],
}
const addForm = ref({
  building_name: '',
  room_number: '',
  contract_id: '',
  month_year: '',
  room_price: null,
  total_amount: null,
  paid_amount: null,
  status: 'unpaid',
  due_date: '',
  notes: '',
  payment_method: 'Chuyển khoản',
  elec_previous: null,
  elec_current: null,
  water_previous: null,
  water_current: null
})

const openAddModal = () => {
  addForm.value = {
    building_name: '',
    room_number: '',
    contract_id: '',
    month_year: '',
    room_price: null,
    total_amount: null,
    paid_amount: null,
    status: 'unpaid',
    due_date: '',
    notes: '',
    payment_method: 'Chuyển khoản',
    elec_previous: null,
    elec_current: null,
    water_previous: null,
    water_current: null
  }
  addDialogVisible.value = true
}

const submitAddForm = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  console.log('Submit new invoice:', addForm.value)
  ElMessage.success('Khởi tạo hóa đơn thành công (giả lập)')
  addDialogVisible.value = false
}

onMounted(() => {
  fetchInvoices()
})
</script>

<style>
/* Global Theme Variables for this page */
:root {
  --bg-page: #f8fafc;
  --bg-table: #ffffff;
  --bg-header: #f8fafc;
  --bg-section: #f1f5f9;
  --bg-sub-section: #ffffff;
  --text-main: #1e293b;
  --text-dim: #64748b;
  --border-main: #e2e8f0;
  --select-bg: #ffffff;
  --btn-secondary-bg: #f1f5f9;
  --btn-secondary-text: #475569;
  --text-id: #3B82F6;
}

html.dark {
  --bg-page: #111827;
  --bg-table: #111827;
  --bg-header: #1f2937;
  --bg-section: rgba(17, 24, 39, 0.4);
  --bg-sub-section: rgba(31, 41, 55, 0.3);
  --text-main: #ffffff;
  --text-dim: #9ca3af;
  --border-main: #374151;
  --select-bg: #1f2937;
  --btn-secondary-bg: #374151;
  --btn-secondary-text: #d1d5db;
  --text-id: #6b7280;
}
</style>

<style scoped>
.invoices-page {
  background-color: var(--bg-page);
  color: var(--text-main);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.text-main { color: var(--text-main); }
.text-dim { color: var(--text-dim); }
.bg-table { background-color: var(--bg-table); }
.bg-header { background-color: var(--bg-header); }
.bg-section { background-color: var(--bg-section); }
.bg-sub-section { background-color: var(--bg-sub-section); }
.text-id { color: var(--text-id); }
.border-main { border-color: var(--border-main); }

.font-inter {
  font-family: 'Inter', sans-serif;
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

.btn-print:hover {
  background-color: rgba(245, 158, 11, 0.15) !important;
  color: #f59e0b !important;
}

/* Custom Select Theme */
.theme-select :deep(.el-input__wrapper) {
  background-color: var(--select-bg) !important;
  border: 1px solid var(--border-main) !important;
  box-shadow: none !important;
  border-radius: 8px;
  height: 40px;
}
.theme-select :deep(.el-input__inner) {
  color: var(--text-main) !important;
  font-weight: 500;
}
.theme-select :deep(.el-select__placeholder) {
  color: var(--text-dim) !important;
}

.theme-select-mini :deep(.el-input__wrapper) {
  background-color: var(--bg-table) !important;
  border: 1px solid var(--border-main) !important;
  box-shadow: none !important;
  border-radius: 8px;
  height: 32px;
}
.theme-select-mini :deep(.el-input__inner) {
  color: var(--text-main) !important;
  font-weight: 500;
  font-size: 13px;
}

/* Override Element Plus Dialog for Theme */
:deep(.theme-dialog .el-dialog) {
  background-color: var(--bg-table) !important;
  border: 1px solid var(--border-main);
  border-radius: 20px;
}
:deep(.theme-dialog .el-dialog__title) {
  color: var(--text-main) !important;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1px;
}
:deep(.theme-dialog .el-dialog__headerbtn .el-dialog__close) {
  color: var(--text-dim) !important;
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
  border-radius: 10px !important;
  font-weight: bold !important;
}

.theme-btn-primary {
  background-color: #3b82f6 !important;
  border: none !important;
  color: #fff !important;
  border-radius: 10px !important;
  font-weight: bold !important;
}

.theme-btn-success {
  background-color: #10b981 !important;
  border: none !important;
  color: #fff !important;
  border-radius: 10px !important;
  font-weight: bold !important;
}

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background: var(--border-main);
  border-radius: 10px;
}
::-webkit-scrollbar-track {
  background: transparent;
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
  background-color: var(--bg-header) !important;
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

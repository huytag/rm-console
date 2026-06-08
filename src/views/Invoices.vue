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
          size="large"
          class="theme-select"
          style="width: 180px;"
          @change="fetchInvoices"
        >
          <el-option label="Chờ thanh toán" value="unpaid" />
          <el-option label="Đã thanh toán" value="paid" />
          <el-option label="Quá hạn" value="overdue" />
          <el-option label="Thanh toán 1 phần" value="partial" />
        </el-select>

        <el-date-picker
          v-model="filterDate"
          type="month"
          placeholder="Chọn tháng/năm"
          format="MM/YYYY"
          value-format="YYYY-MM"
          size="large"
          class="theme-date-picker"
          style="width: 180px;"
          @change="handleDateChange"
        />
        
        <button
          class="flex items-center justify-center gap-2 px-5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-105"
          style="background-color: #10B981; height: 40px;"
          @click="generateMonthlyInvoices"
        >
          <el-icon><Calendar /></el-icon>
          Tạo HĐ tháng này
        </button>
        <button
          class="flex items-center justify-center gap-2 px-5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-105"
          style="background-color: #3B82F6; height: 40px;"
          @click="openCreateInvoiceModal"
        >
          <el-icon><Plus /></el-icon>
          Tạo hóa đơn
        </button>
      </div>
    </div>

    <!-- Table Section -->
    <div class="rounded-2xl border border-main overflow-hidden shadow-2xl bg-table" v-loading="loading">
      <div class="overflow-x-auto">
        <table class="w-full text-sm border-collapse whitespace-nowrap">
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
          <tbody class="bg-table">
            <tr
              v-for="row in invoices"
              :key="row.id"
              class="table-row-hover transition-colors border-b last:border-0 border-main"
            >
              <!-- ID -->
              <td class="px-5 py-4">
                <span class="font-bold text-xs text-id">{{ row.invoice_code || `#HD-${String(row.id).padStart(4, '0')}` }}</span>
              </td>

              <!-- Phòng -->
              <td class="px-5 py-4">
                <p class="font-bold text-main text-sm mb-0.5">{{ row.contract?.room?.room_number || row.room_number || '---' }}</p>
                <p class="text-[11px] text-dim font-medium">{{ row.contract?.room?.building?.name || row.building_name || 'N/A' }}</p>
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
                  <button class="action-btn btn-print-amber" title="In hóa đơn" @click="printInvoice(row)">
                    <el-icon size="16"><Printer /></el-icon>
                  </button>
                  <button class="action-btn btn-money" title="Xác nhận thanh toán (Offline)" @click="showPaymentQR(row)" v-if="row.status !== 'paid'">
                    <el-icon size="16"><Money /></el-icon>
                  </button>
                  <button class="action-btn text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-600" title="Thanh toán Online" @click="payOnline(row)" v-if="row.status !== 'paid'">
                    <el-icon size="16"><CreditCard /></el-icon>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 flex items-center justify-between bg-header border-t border-main">
        <span class="text-[11px] font-bold text-dim uppercase tracking-widest">
          Tổng cộng <span class="text-main">{{ pagination.total }}</span> hóa đơn
        </span>

        <div class="flex items-center gap-4">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50]"
            :total="pagination.total"
            layout="sizes, prev, pager, next"
            @current-change="fetchInvoices"
            @size-change="fetchInvoices"
            class="custom-pagination"
          />
        </div>
      </div>
    </div>

    <!-- QR Payment Dialog -->
    <el-dialog v-model="qrVisible" title="Xác nhận thanh toán" width="90%" style="max-width: 450px" center class="theme-dialog">
      <div class="flex flex-col items-center justify-center p-2" v-loading="qrLoading">
        <div v-if="qrData" class="text-center w-full">
          <p class="font-bold text-lg mb-2 text-blue-500">Số tiền: {{ formatPrice(qrData.amount) }}</p>
          <img :src="qrData.qr_url" class="w-[250px] h-[250px] rounded-xl mb-4 mx-auto object-contain border-main border-2" />
          <div class="bg-section p-4 rounded-xl mb-6 text-left border border-main">
            <p class="text-xs text-dim mb-1 font-bold uppercase">Nội dung chuyển khoản</p>
            <p class="text-sm font-black text-main">{{ qrData.content }}</p>
          </div>
          <el-button type="primary" class="!w-full !rounded-xl !h-12 font-bold" @click="confirmPayment">
            Đã chuyển khoản thành công
          </el-button>
        </div>
      </div>
    </el-dialog>

    <!-- Invoice Details Dialog -->
    <el-dialog
      v-model="invoiceDetailsVisible"
      title="Chi tiết Hóa đơn"
      width="90%" style="max-width: 750px"
      class="invoice-details-dialog theme-dialog"
      :align-center="true"
    >
      <div v-if="selectedInvoice" class="p-4 overflow-y-auto max-h-[75vh]" v-loading="detailsLoading">
        <div class="grid grid-cols-2 gap-8">
          <!-- Left Column -->
          <div class="flex flex-col gap-6">
            <div class="detail-item">
              <label class="text-[10px] font-black uppercase tracking-widest text-dim">Mã Hóa đơn</label>
              <p class="font-black text-blue-500 text-lg">{{ selectedInvoice.invoice_code || `#HD-${String(selectedInvoice.id).padStart(4, '0')}` }}</p>
            </div>
            <div class="detail-item">
              <label class="text-[10px] font-black uppercase tracking-widest text-dim">Khách thuê</label>
              <p class="text-main font-bold">{{ selectedInvoice.contract?.tenant?.name || 'N/A' }}</p>
              <p class="text-xs text-dim">{{ selectedInvoice.contract?.tenant?.phone || '' }}</p>
            </div>
            <div class="detail-item">
              <label class="text-[10px] font-black uppercase tracking-widest text-dim">Thời gian</label>
              <p class="text-main font-bold">Tháng {{ selectedInvoice.month }} / {{ selectedInvoice.year }}</p>
            </div>
            <div class="detail-item">
              <label class="text-[10px] font-black uppercase tracking-widest text-dim">Giá phòng</label>
              <p class="text-main font-black">{{ formatPrice(selectedInvoice.room_price) }}</p>
            </div>
          </div>

          <!-- Right Column -->
          <div class="flex flex-col gap-6">
            <div class="detail-item">
              <label class="text-[10px] font-black uppercase tracking-widest text-dim">Trạng thái</label>
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
              <label class="text-[10px] font-black uppercase tracking-widest text-dim">Hạn thanh toán</label>
              <p class="text-rose-500 font-bold">{{ selectedInvoice.due_date }}</p>
            </div>
            <div class="detail-item">
              <label class="text-[10px] font-black uppercase tracking-widest text-dim">Tổng tiền thanh toán</label>
              <p class="text-emerald-500 font-black text-xl">{{ formatPrice(selectedInvoice.total_amount) }}</p>
            </div>
            <div class="detail-item">
              <label class="text-[10px] font-black uppercase tracking-widest text-dim">Đã thanh toán</label>
              <p class="text-main font-black">{{ formatPrice(selectedInvoice.paid_amount) }}</p>
            </div>
          </div>
        </div>

        <!-- Utilities Section -->
        <div class="mt-8 pt-6 border-t border-main" v-if="selectedInvoice.utilities?.length">
          <label class="text-[10px] font-black uppercase tracking-widest text-dim block mb-4">Chi tiết Dịch vụ & Tiện ích</label>
          <div class="space-y-3">
            <div v-for="u in selectedInvoice.utilities" :key="u.service.name" class="bg-section border border-main rounded-xl p-4 flex justify-between items-center">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <el-icon><Lightning v-if="u.service.name.includes('điện')" /><Odometer v-else /></el-icon>
                </div>
                <div>
                  <p class="text-sm font-black text-main uppercase">{{ u.service.name }}</p>
                  <p class="text-[10px] text-dim font-bold">Chỉ số: {{ u.old_index }} → {{ u.new_index }} ({{ u.new_index - u.old_index }} {{ u.service.unit }})</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-black text-main">{{ formatPrice(u.total_amount) }}</p>
                <p class="text-[10px] text-dim font-medium">{{ formatPrice(u.unit_price) }} / {{ u.service.unit }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Payments Section -->
        <div class="mt-8 pt-6 border-t border-main" v-if="selectedInvoice.payments?.length">
          <label class="text-[10px] font-black uppercase tracking-widest text-dim block mb-4">Lịch sử thanh toán</label>
          <div class="space-y-2">
            <div v-for="p in selectedInvoice.payments" :key="p.id" class="flex justify-between items-center text-xs p-2 rounded-lg bg-header border border-main">
              <span class="text-dim font-bold">{{ formatDate(p.paid_at) }}</span>
              <span class="text-main font-black">{{ formatPrice(p.amount) }}</span>
              <span class="text-[10px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">{{ p.method }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- Print Preview Dialog -->
    <el-dialog
      v-model="printPreviewVisible"
      title="Xem Trước Trước Hóa Đơn In"
      width="90%" style="max-width: 800px"
      class="theme-dialog"
      :align-center="true"
    >
      <div v-loading="printLoading" class="p-2 relative bg-section rounded-xl border border-main" style="max-height: 70vh; overflow-y: auto;">
        
        <!-- START: Printable Area (styled for A4 paper ratio) -->
        <div id="printable-invoice" class="bg-white p-8 mx-auto w-full max-w-[210mm] shadow-sm relative no-dark-mode" style="min-height: 285mm;">
          
          <div v-if="invoiceToPrint">
            <!-- Header -->
            <div class="flex justify-between items-start border-b-2 border-gray-300 pb-6 mb-6">
              <div>
                <h1 class="text-3xl font-black text-gray-800 uppercase tracking-widest">HÓA ĐƠN</h1>
                <p class="text-sm font-bold text-gray-500 mt-1">
                  Mã: {{ invoiceToPrint.invoice_code || `#HD-${String(invoiceToPrint.id).padStart(4, '0')}` }}
                </p>
              </div>
              <div class="text-right">
                <h2 class="text-2xl font-black text-blue-600 mb-1">MANAGEMENT TRỌ</h2>
                <p class="text-sm font-medium text-gray-600">{{ invoiceToPrint.contract?.room?.building?.name || invoiceToPrint.building_name || 'Hệ thống Quản lý' }}</p>
                <p class="text-sm font-medium text-gray-600">Phòng: <span class="font-bold text-gray-800">{{ invoiceToPrint.contract?.room?.room_number || invoiceToPrint.room_number || '---' }}</span></p>
              </div>
            </div>

            <!-- Customer & Date Info -->
            <div class="grid grid-cols-2 gap-8 mb-8">
              <div>
                <p class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Khách thuê</p>
                <p class="text-lg font-black text-gray-800">{{ invoiceToPrint.contract?.tenant?.name || '---' }}</p>
                <p class="text-sm font-medium text-gray-600">{{ invoiceToPrint.contract?.tenant?.phone || '---' }}</p>
              </div>
              <div class="text-right">
                <p class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Thông tin thanh toán</p>
                <p class="text-sm font-medium flex justify-end gap-4">
                  <span class="text-gray-500 w-24 text-left">Kỳ:</span> 
                  <span class="text-gray-800 font-bold">Tháng {{ invoiceToPrint.month }}/{{ invoiceToPrint.year }}</span>
                </p>
                <p class="text-sm font-medium flex justify-end gap-4 mt-1">
                  <span class="text-gray-500 w-24 text-left">Ngày in:</span> 
                  <span class="text-gray-800 font-bold">{{ new Date().toLocaleDateString('vi-VN') }}</span>
                </p>
                <p class="text-sm font-medium flex justify-end gap-4 mt-1">
                  <span class="text-gray-500 w-24 text-left">Trạng thái:</span> 
                  <span class="font-bold" :class="invoiceToPrint.status === 'paid' ? 'text-green-600' : 'text-red-600'">
                    {{ getStatusLabel(invoiceToPrint.status) }}
                  </span>
                </p>
              </div>
            </div>

            <!-- Table Items -->
            <div class="mb-8">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="border-b-2 border-gray-800">
                    <th class="py-3 px-2 font-black text-xs text-gray-700 uppercase tracking-widest w-1/2">Chi tiết khoản thu</th>
                    <th class="py-3 px-2 font-black text-xs text-gray-700 uppercase tracking-widest text-center w-1/4">Đơn giá / Chỉ số</th>
                    <th class="py-3 px-2 font-black text-xs text-gray-700 uppercase tracking-widest text-right w-1/4">Thành tiền</th>
                  </tr>
                </thead>
                <tbody class="text-gray-700">
                  <!-- Tiền phòng -->
                  <tr class="border-b border-gray-200 bg-gray-50">
                    <td class="py-4 px-2">
                      <p class="font-bold text-gray-900">Tiền thuê phòng</p>
                      <p class="text-xs text-gray-500 mt-1">Phí cố định theo hợp đồng</p>
                    </td>
                    <td class="py-4 px-2 text-center text-sm font-medium text-gray-800">---</td>
                    <td class="py-4 px-2 text-right font-black text-gray-900">{{ formatPrice(invoiceToPrint.room_price) }}</td>
                  </tr>

                  <!-- Dịch vụ & Tiện ích -->
                  <tr v-for="u in invoiceToPrint.utilities" :key="u.service.name" class="border-b border-gray-200">
                    <td class="py-4 px-2">
                      <p class="font-bold text-gray-900">{{ u.service.name }}</p>
                      <p v-if="u.service.type !== 'fixed' && u.old_index !== null" class="text-[11px] text-gray-500 mt-1">
                        Chỉ số cũ: <span class="font-bold text-gray-700">{{ u.old_index }}</span> - Mới: <span class="font-bold text-gray-700">{{ u.new_index }}</span>
                        ({{ u.new_index - u.old_index }} {{ u.service.unit }})
                      </p>
                      <p v-else class="text-[11px] text-gray-500 mt-1">Cố định hàng tháng</p>
                    </td>
                    <td class="py-4 px-2 text-center text-sm font-medium text-gray-800">
                      {{ formatPrice(u.unit_price) }} / {{ u.service.unit }}
                    </td>
                    <td class="py-4 px-2 text-right font-black text-gray-900">{{ formatPrice(u.total_amount) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Totals -->
            <div class="flex justify-end mb-8 mt-6">
              <div class="w-1/2 p-4">
                 <div class="flex justify-between items-center mb-3">
                   <span class="font-bold text-gray-600 text-sm">Tổng cộng hợp lệ:</span>
                   <span class="font-black text-lg text-gray-900">{{ formatPrice(invoiceToPrint.total_amount) }}</span>
                 </div>
                 <div class="flex justify-between items-center mb-3">
                   <span class="font-bold text-gray-600 text-sm">Đã trả:</span>
                   <span class="font-black text-md text-gray-700">{{ formatPrice(invoiceToPrint.paid_amount) }}</span>
                 </div>
                 <hr class="border-gray-300 my-3">
                 <div class="flex justify-between items-center">
                   <span class="font-black text-gray-900 text-sm uppercase">Cần thanh toán:</span>
                   <span class="font-black text-3xl text-blue-600">{{ formatPrice(invoiceToPrint.total_amount - (invoiceToPrint.paid_amount || 0)) }}</span>
                 </div>
              </div>
            </div>

            <!-- Footer / Signatures -->
            <div class="grid grid-cols-2 gap-8 text-center pt-8 mt-8">
               <div>
                 <p class="font-bold text-gray-800 text-sm">Người lập phiếu</p>
                 <p class="text-xs text-gray-500 mt-1">(Ký, ghi rõ họ tên)</p>
                 <div class="h-24"></div>
               </div>
               <div>
                 <p class="font-bold text-gray-800 text-sm">Khách thuê</p>
                 <p class="text-xs text-gray-500 mt-1">(Ký, ghi rõ họ tên)</p>
                 <div class="h-24"></div>
               </div>
            </div>


          </div>
        </div>
        <!-- END: Printable Area -->
      </div>
      
      <template #footer>
        <div class="flex justify-end gap-3 mt-4">
          <el-button @click="printPreviewVisible = false" class="custom-btn-cancel">Hủy</el-button>
          <el-button type="primary" @click="confirmPrint" class="custom-btn-submit flex items-center justify-center gap-2" style="background-color: #10b981 !important;">
            <el-icon size="16"><Printer /></el-icon> Tiến hành In
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- Generate Invoices Dialog -->
    <el-dialog v-model="createInvoiceVisible" title="Tạo Hóa Đơn Mới" width="90%" style="max-width: 600px" class="theme-dialog-v3" top="5vh">
      <el-form :model="createForm" label-position="top">
        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="Mã hợp đồng" class="col-span-2" required>
            <el-input v-model="createForm.contract_id" placeholder="Nhập ID hợp đồng" />
          </el-form-item>
          
          <el-form-item label="Tháng" class="col-span-1" required>
            <el-input-number v-model="createForm.month" :min="1" :max="12" class="!w-full !text-left" :controls="false" />
          </el-form-item>
          
          <el-form-item label="Năm" class="col-span-1" required>
            <el-input-number v-model="createForm.year" :min="2000" class="!w-full !text-left" :controls="false" />
          </el-form-item>

          <el-form-item label="Giá phòng" class="col-span-1" required>
            <el-input-number v-model="createForm.room_price" :min="0" :step="100000" class="!w-full !text-left" :controls="false" />
          </el-form-item>

          <el-form-item label="Tổng tiền" class="col-span-1" required>
            <el-input-number v-model="createForm.total_amount" :min="0" :step="100000" class="!w-full !text-left" :controls="false" />
          </el-form-item>

          <el-form-item label="Đã trả" class="col-span-1" required>
            <el-input-number v-model="createForm.paid_amount" :min="0" :step="100000" class="!w-full !text-left" :controls="false" />
          </el-form-item>

          <el-form-item label="Trạng thái" class="col-span-1" required>
            <el-select v-model="createForm.status" class="!w-full">
              <el-option label="Chưa thanh toán" value="unpaid" />
              <el-option label="Đã thanh toán" value="paid" />
              <el-option label="Thanh toán 1 phần" value="partial" />
            </el-select>
          </el-form-item>

          <el-form-item label="Hạn trả" class="col-span-2" required>
            <el-date-picker v-model="createForm.due_date" type="date" placeholder="Chọn ngày" format="DD/MM/YYYY" value-format="YYYY-MM-DD" class="!w-full" />
          </el-form-item>

          <el-form-item label="Ghi chú" class="col-span-2">
            <el-input v-model="createForm.note" type="textarea" :rows="3" placeholder="Nhập ghi chú" class="!w-full" />
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <div class="flex justify-end gap-3 px-4 pb-4 mt-4">
          <el-button @click="createInvoiceVisible = false" class="theme-btn-cancel">Hủy bỏ</el-button>
          <el-button type="primary" @click="confirmGenerateInvoices" :loading="generateLoading" class="theme-btn-submit">Lưu Hóa Đơn</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Refresh, View, Printer, Lightning, Odometer, Money, ArrowRight, Calendar, CreditCard } from '@element-plus/icons-vue'

// ========== STATE ==========
const invoices = ref([])
const loading = ref(false)
const detailsLoading = ref(false)
const filters = ref({ status: null, month: null, year: null })
const filterDate = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const pagination = ref({ total: 0 })

const invoiceDetailsVisible = ref(false)
const selectedInvoice = ref(null)

const printPreviewVisible = ref(false)
const printLoading = ref(false)
const invoiceToPrint = ref(null)

const createInvoiceVisible = ref(false)
const generateLoading = ref(false)
const createForm = ref({
  contract_id: '',
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
  room_price: 0,
  total_amount: 0,
  paid_amount: 0,
  status: 'unpaid',
  due_date: '',
  note: ''
})

const qrVisible = ref(false)
const qrLoading = ref(false)
const qrData = ref(null)

// ========== METHODS ==========
const formatPrice = (price) => {
  if (price === null || price === undefined) return '0đ'
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ'
}

const formatDate = (dateStr) => {
  if (!dateStr) return '---'
  return new Date(dateStr).toLocaleDateString('vi-VN')
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

const handleDateChange = (val) => {
  if (val) {
    const [year, month] = val.split('-')
    filters.value.year = parseInt(year)
    filters.value.month = parseInt(month)
  } else {
    filters.value.year = null
    filters.value.month = null
  }
  fetchInvoices()
}

const fetchInvoices = async () => {
  loading.value = true
  try {
    // Lưu ý: api (axios instance) đã được cấu hình interceptor để trả về response.data
    const response = await api.get('/invoices', {
      params: {
        page: currentPage.value,
        per_page: pageSize.value,
        status: filters.value.status,
        month: filters.value.month,
        year: filters.value.year
      }
    })
    
    // response lúc này chính là object { success: true, data: { ... } } hoặc { ... } trực tiếp
    const payload = response.data || response;
    
    // invoices.value phải là mảng nằm trong data.data hoặc chính là payload
    invoices.value = payload.data || (Array.isArray(payload) ? payload : []);
    
    // Cập nhật tổng số bản ghi cho phân trang
    pagination.value.total = payload.total || payload.meta?.total || (Array.isArray(payload) ? payload.length : 0);
    
    if (invoices.value.length === 0) {
      console.warn("API trả về danh sách trống");
    }
  } catch (error) {
    console.error("Fetch invoices error:", error);
    ElMessage.error('Lỗi khi tải danh sách hóa đơn');
  } finally {
    loading.value = false
  }
}

const openInvoiceDetails = async (invoice) => {
  selectedInvoice.value = invoice
  invoiceDetailsVisible.value = true
  detailsLoading.value = true
  try {
    const response = await api.get(`/invoices/${invoice.id}`)
    selectedInvoice.value = response.data || response
  } catch (error) {
    ElMessage.error('Không thể lấy chi tiết hóa đơn')
  } finally {
    detailsLoading.value = false
  }
}

const generateMonthlyInvoices = async () => {
  try {
    await ElMessageBox.confirm('Bạn có chắc chắn muốn tạo hóa đơn tự động cho tất cả hợp đồng đang hoạt động trong tháng này không?', 'Tạo hóa đơn hàng tháng', {
      confirmButtonText: 'Tạo',
      cancelButtonText: 'Hủy',
      type: 'warning'
    })
    
    loading.value = true
    const response = await api.post('/invoices/generate-monthly')
    ElMessage.success(response.message || 'Tạo hóa đơn hàng tháng thành công')
    fetchInvoices()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(error.response?.data?.message || 'Lỗi khi tạo hóa đơn hàng tháng')
    }
  } finally {
    loading.value = false
  }
}

const payOnline = async (invoice) => {
  try {
    const response = await api.post(`/invoices/${invoice.id}/pay`)
    const paymentUrl = response.payment_url || response.data?.payment_url;
    if (paymentUrl) {
      window.open(paymentUrl, '_blank')
      ElMessageBox.confirm('Vui lòng hoàn thành thanh toán trên tab mới. Nếu thanh toán thành công, vui lòng tải lại danh sách hóa đơn.', 'Đang thanh toán', {
        confirmButtonText: 'Đã hoàn thành',
        cancelButtonText: 'Đóng',
        type: 'info'
      }).then(() => fetchInvoices()).catch(() => {})
    } else {
      ElMessage.error('Không tìm thấy đường dẫn thanh toán từ máy chủ')
    }
  } catch (error) {
    ElMessage.error(error.response?.data?.message || 'Lỗi khi yêu cầu thanh toán online')
  }
}

const showPaymentQR = async (invoice) => {
  selectedInvoice.value = invoice
  qrVisible.value = true
  qrLoading.value = true
  try {
    // Cập nhật đúng route và method theo api.php của backend
    const response = await api.post(`/invoices/${invoice.id}/generate-qr`)
    qrData.value = response.data || response
  } catch (error) {
    ElMessage.error('Không thể tạo mã QR thanh toán')
  } finally {
    qrLoading.value = false
  }
}

const confirmPayment = async () => {
  try {
    await ElMessageBox.confirm('Xác nhận bạn đã chuyển khoản thành công?', 'Xác nhận', {
      confirmButtonText: 'Đã chuyển',
      cancelButtonText: 'Kiểm tra lại',
      type: 'success'
    })
    
    // Cập nhật đúng route theo api.php của backend
    const response = await api.post(`/invoices/${selectedInvoice.value.id}/approve`, {
      amount: selectedInvoice.value.total_amount,
      method: 'bank_transfer',
      note: 'Thanh toán qua QR'
    })
    
    const isSuccess = response.success || response.status === 'success';

    if (isSuccess) {
      ElMessage.success('Xác nhận thanh toán thành công!')
      qrVisible.value = false
      fetchInvoices()
    }
  } catch (error) {
    if (error !== 'cancel') ElMessage.error('Lỗi khi xác nhận thanh toán')
  }
}

const openCreateInvoiceModal = () => {
  const now = new Date()
  createForm.value = {
    contract_id: '',
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    room_price: 0,
    total_amount: 0,
    paid_amount: 0,
    status: 'unpaid',
    due_date: '',
    note: ''
  }
  createInvoiceVisible.value = true
}

const confirmGenerateInvoices = async () => {
  if (!createForm.value.contract_id) {
    ElMessage.warning('Vui lòng nhập mã hợp đồng')
    return
  }
  
  generateLoading.value = true
  try {
    const response = await api.post('/invoices', {
      contract_id: createForm.value.contract_id,
      month: createForm.value.month,
      year: createForm.value.year,
      room_price: createForm.value.room_price,
      total_amount: createForm.value.total_amount,
      paid_amount: createForm.value.paid_amount,
      status: createForm.value.status,
      due_date: createForm.value.due_date,
      note: createForm.value.note
    })
    
    const isSuccess = response.success || response.status === 'success' || response.id || (response.data && response.data.id);

    if (isSuccess || response) {
      ElMessage.success(`Đã tạo hóa đơn mới thành công!`)
      createInvoiceVisible.value = false
      fetchInvoices()
    } else {
      ElMessage.error(response.message || 'Lỗi khi tạo hóa đơn')
    }
  } catch (error) {
    const msg = error.response?.data?.message || 'Lỗi khi tạo hóa đơn'
    ElMessage.error(msg)
  } finally {
    generateLoading.value = false
  }
}

const printInvoice = async (invoice) => {
  invoiceToPrint.value = invoice
  printPreviewVisible.value = true
  printLoading.value = true
  try {
    const response = await api.get(`/invoices/${invoice.id}`)
    invoiceToPrint.value = response.data || response
  } catch (error) {
    ElMessage.error('Không thể lấy chi tiết hóa đơn để in')
  } finally {
    printLoading.value = false
  }
}

const confirmPrint = () => {
  const originalElement = document.getElementById('printable-invoice')
  if (!originalElement) return
  
  // Clone element to avoid breaking the original Vue reactivity
  const clone = originalElement.cloneNode(true)
  clone.style.height = 'auto'
  clone.style.minHeight = 'auto'
  clone.style.overflow = 'visible'
  
  // Create a clean host detached from Vue and el-dialog
  const printHost = document.createElement('div')
  printHost.id = 'print-host'
  printHost.appendChild(clone)
  
  // Append to body at root level
  document.body.appendChild(printHost)

  // Delay for browser to render the DOM change before printing
  setTimeout(() => {
    window.print()
    
    // Clean up after print dialog closes
    setTimeout(() => {
      const host = document.getElementById('print-host')
      if (host) document.body.removeChild(host)
    }, 500)
  }, 200)
}

onMounted(() => {
  fetchInvoices()
})
</script>

<style>
/* Ẩn clone host trên màn hình thường, tránh chớp nháy UI */
@media screen {
  #print-host {
    display: none !important;
  }
}

/* CSS cho tính năng Print (Chạy gốc trình duyệt) */
@media print {
  /* Ẩn toàn bộ ứng dụng Vue và các Overlays của Element Plus */
  body > * {
    display: none !important;
  }
  
  /* Chỉ hiển thị duy nhất container chứa clone để in */
  body > #print-host {
    display: block !important;
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    width: 100vw !important;
    background-color: #ffffff !important;
    margin: 0 !important;
    padding: 5mm !important;
  }

  body > #print-host * {
    color-adjust: exact !important;
    print-color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
  }
  
  @page { margin: 0; }
}

/* Global Theme Variables for this page */
:root {
  --bg-page: #f8fafc;
  --bg-card: #ffffff;
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
  --bg-card: #1f2937;
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
.font-inter { font-family: 'Inter', sans-serif; }
.invoices-page { background-color: var(--bg-page); color: var(--text-main); }
.table-row-hover:hover { background-color: var(--bg-header); }
.text-main { color: var(--text-main); }
.text-dim { color: var(--text-dim); }
.bg-table { background-color: var(--bg-table); }
.bg-header { background-color: var(--bg-header); }
.bg-section { background-color: var(--bg-section); }
.text-id { color: var(--text-id); }
.border-main { border-color: var(--border-main); }

.action-btn {
  width: 32px; height: 32px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  background-color: var(--btn-secondary-bg); color: var(--text-dim);
  border: none; cursor: pointer; transition: all 0.2s ease;
}
.btn-view:hover { background-color: rgba(59, 130, 246, 0.15) !important; color: #3b82f6 !important; }
.btn-print-amber:hover { background-color: rgba(245, 158, 11, 0.15) !important; color: #f59e0b !important; }
.btn-money:hover { background-color: rgba(16, 185, 129, 0.15) !important; color: #10b981 !important; }

/* Custom Pagination */
:deep(.custom-pagination .el-pager li) { background: transparent; color: var(--text-dim); font-weight: 800; }
:deep(.custom-pagination .el-pager li.is-active) { color: #3b82f6; font-size: 16px; }

/* Dialog Theme */
:deep(.theme-dialog .el-dialog) { background-color: var(--bg-table) !important; border: 1px solid var(--border-main); border-radius: 24px; overflow: hidden; }
:deep(.theme-dialog .el-dialog__header) { padding: 24px 32px; border-bottom: 1px solid var(--border-main); margin: 0; }
:deep(.theme-dialog .el-dialog__title) { color: var(--text-main) !important; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; }

/* Theme Select & Date Picker */
:deep(.theme-select .el-input__wrapper),
:deep(.theme-date-picker .el-input__wrapper) {
  background-color: var(--bg-table) !important;
  box-shadow: 0 0 0 1px var(--border-main) inset !important;
  border-radius: 12px;
}
:deep(.theme-select .el-input__inner),
:deep(.theme-date-picker .el-input__inner) {
  color: var(--text-main) !important;
  font-weight: 600;
}
:deep(.el-picker__popper) {
  background-color: var(--bg-table) !important;
  border: 1px solid var(--border-main) !important;
}

/* Custom Invoice Dialog (matching screenshot exactly) */
:deep(.custom-invoice-dialog) {
  border-radius: 12px;
  overflow: hidden;
  background-color: var(--bg-card) !important;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
  border: 1px solid var(--border-main);
}

:deep(.custom-invoice-dialog .el-dialog__header) {
  padding: 20px 24px;
  margin-right: 0;
  border-bottom: 1px solid var(--border-main);
}

:deep(.custom-invoice-dialog .el-dialog__title) {
  font-weight: 500;
  font-size: 1.125rem;
  color: var(--text-main);
  text-transform: none;
  letter-spacing: normal;
}

:deep(.custom-invoice-dialog .el-dialog__body) {
  padding: 24px;
}

:deep(.custom-invoice-dialog .el-form-item__label) {
  font-weight: 500;
  color: var(--text-main);
  font-size: 13px;
  text-transform: none;
  letter-spacing: normal;
  margin-bottom: 6px;
  padding-bottom: 0;
}

:deep(.custom-invoice-dialog .el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label::before) {
  color: #ef4444; /* red asterisk */
}

:deep(.custom-invoice-dialog .el-input__wrapper),
:deep(.custom-invoice-dialog .el-select__wrapper),
:deep(.custom-invoice-dialog .el-textarea__inner) {
  background-color: var(--bg-page) !important;
  box-shadow: none !important;
  border: 1px solid var(--border-main) !important;
  border-radius: 6px;
}

:deep(.custom-invoice-dialog .el-textarea__inner) {
  padding: 8px 12px;
  color: var(--text-main);
}

:deep(.custom-invoice-dialog .el-input__inner) {
  font-weight: 400;
  font-size: 14px;
  color: var(--text-main);
}

.custom-btn-cancel {
  border-radius: 8px;
  height: 40px;
  padding: 0 24px;
  font-weight: 600;
  border: 1px solid var(--border-main);
  background: transparent;
  color: var(--text-dim);
  transition: all 0.2s;
}

.custom-btn-cancel:hover {
  background-color: var(--bg-table);
  color: var(--text-main);
}

.custom-btn-submit {
  border-radius: 8px;
  height: 40px;
  padding: 0 24px;
  font-weight: 600;
  background-color: #3b82f6 !important;
  border: none !important;
  color: white !important;
  box-shadow: 0 0 12px rgba(59, 130, 246, 0.4);
  transition: all 0.2s;
}

.custom-btn-submit:hover {
  background-color: #2563eb !important;
  box-shadow: 0 0 16px rgba(59, 130, 246, 0.6);
}
</style>

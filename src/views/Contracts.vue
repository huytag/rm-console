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
          <label class="text-xs font-bold uppercase tracking-widest text-muted">Trạng thái</label>
          <el-select
            v-model="filters.status"
            placeholder="Tất cả trạng thái"
            clearable
            size="large"
            class="contracts-select"
            style="width: 200px"
            @change="handleFilterChange"
          >
            <el-option label="Hoạt động" value="active" />
            <el-option label="Hết hạn" value="expired" />
            <el-option label="Đã chấm dứt" value="terminated" />
          </el-select>
        </div>

        <button
          class="px-5 rounded-xl text-sm font-bold transition-all flex items-center justify-center hover:scale-105 hover:opacity-80 hover:shadow-lg active:scale-95"
          style="background-color: rgba(16, 185, 129, 0.15); color: #10b981; height: 40px"
          @click="clearFilters"
        >
          Xóa bộ lọc
        </button>
      </div>
    </div>

    <!-- ===== 4. TABLE SECTION ===== -->
    <div class="table-container rounded-2xl border border-main overflow-hidden shadow-2xl">
      <div class="overflow-x-auto">
        <table class="w-full text-sm border-collapse whitespace-nowrap">
          <thead class="table-head">
            <tr class="border-b border-main">
              <th class="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-dim">ID</th>
              <th class="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-dim">Phòng</th>
              <th class="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-dim">Người thuê</th>
              <th class="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-dim">Số điện thoại</th>
              <th class="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-dim">Thời hạn</th>
              <th class="px-6 py-5 text-right text-[11px] font-black uppercase tracking-widest text-dim">Tiền cọc</th>
              <th class="px-6 py-5 text-right text-[11px] font-black uppercase tracking-widest text-dim">Giá phòng</th>
              <th class="px-6 py-5 text-center text-[11px] font-black uppercase tracking-widest text-dim">Trạng thái</th>
              <th class="px-6 py-5 text-center text-[11px] font-black uppercase tracking-widest text-dim">Thao tác</th>
            </tr>
          </thead>
          <tbody v-if="!loading" class="table-body">
            <tr
              v-for="(contract, index) in contracts"
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

              <!-- Giá phòng -->
              <td class="px-6 py-5 text-right">
                <span class="font-black text-main text-sm">{{ formatPrice(contract.room?.price) }}</span>
              </td>

              <!-- Trạng thái -->
              <td class="px-6 py-5 text-center">
                <span 
                  class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                  :style="getStatusStyle(contract.status)"
                >
                  {{ contract.status_label || getStatusLabel(contract.status) }}
                </span>
              </td>

              <!-- Thao tác -->
              <td class="px-6 py-5 text-center">
                <div class="flex items-center justify-center gap-3">
                  <button class="action-btn btn-view" title="Xem chi tiết" @click="openDetails(contract)">
                    <el-icon size="16"><View /></el-icon>
                  </button>
                  <button class="action-btn btn-edit" title="Chỉnh sửa" @click="openEditModal(contract)">
                    <el-icon size="16"><Edit /></el-icon>
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
          Tổng cộng <span class="text-main">{{ totalContracts }}</span> hợp đồng
        </p>

        <div class="flex items-center gap-4">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50]"
            :total="totalContracts"
            layout="sizes, prev, pager, next"
            @size-change="fetchContracts"
            @current-change="fetchContracts"
            class="custom-pagination"
          />
        </div>
      </div>
    </div>
    <!-- ===== 6. DETAILS MODAL ===== -->
    <el-dialog
      v-model="detailsVisible"
      title="Chi tiết Hợp đồng"
      width="90%" style="max-width: 800px"
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
              <label>Người thuê</label>
              <div class="flex items-center gap-3 mt-1">
                <div class="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs">
                  {{ (selectedContract.tenant?.name || 'U').split(' ').pop()?.[0] }}
                </div>
                <p class="text-main font-bold">{{ selectedContract.tenant?.name || 'Khách thuê' }}</p>
                <p class="text-[10px] text-dim">{{ selectedContract.tenant?.email }}</p>
              </div>
            </div>

            <div class="detail-item">
              <label>Thời hạn hợp đồng</label>
              <div class="flex items-center gap-2 mt-1">
                <span class="text-emerald-500 font-bold">{{ formatDate(selectedContract.start_date) }}</span>
                <el-icon size="12" class="text-dim opacity-50"><ArrowRight /></el-icon>
                <span class="text-rose-500 font-bold">{{ formatDate(selectedContract.end_date) }}</span>
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
              <label>Tiền cọc / Giá thuê</label>
              <div class="flex flex-col gap-1">
                <p class="text-amber-500 font-black text-lg">{{ formatPrice(selectedContract.deposit) }} <span class="text-[10px] text-dim font-bold">CỌC</span></p>
                <p class="text-emerald-500 font-black text-lg">{{ formatPrice(selectedContract.rent_price || selectedContract.price) }} <span class="text-[10px] text-dim font-bold">THUÊ</span></p>
              </div>
            </div>
            <div class="detail-item">
              <label>Phòng / Tòa nhà</label>
              <p class="text-main font-bold mt-1">{{ selectedContract.room?.room_number }} - {{ selectedContract.room?.building?.name }}</p>
              <p class="text-[10px] text-dim">{{ selectedContract.room?.building?.address }}</p>
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
            <label class="mb-4 block">Hợp đồng đã ký (Tài liệu đính kèm)</label>
            <div class="p-4 rounded-2xl border border-dashed border-main bg-section/30 flex flex-col items-center gap-4">
              <div v-if="selectedContract.signed_contract_path" class="flex items-center gap-2 text-emerald-500 font-bold">
                <el-icon><DocumentChecked /></el-icon>
                <span>Đã có bản scan hợp đồng</span>
                <el-link :href="selectedContract.signed_contract_path" target="_blank" type="primary">Xem tệp</el-link>
              </div>
              <div v-else class="text-dim text-xs italic">Chưa tải lên bản scan hợp đồng đã ký</div>
              
              <el-upload
                action="#"
                :auto-upload="false"
                :on-change="handleSignedUpload"
                :show-file-list="false"
              >
                <el-button type="primary" size="small" class="!rounded-lg" :loading="uploading">
                  <el-icon class="mr-1"><Upload /></el-icon> Tải lên bản đã ký
                </el-button>
              </el-upload>
            </div>
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

    <!-- Print Preview Dialog -->
    <el-dialog
      v-model="printPreviewVisible"
      title="Xem Trước Hợp Đồng In"
      width="90%" style="max-width: 800px"
      class="theme-dialog"
      :align-center="true"
    >
      <div v-loading="printLoading" class="p-2 relative bg-section rounded-xl border border-main" style="max-height: 70vh; overflow-y: auto;">
        
        <!-- START: Printable Area -->
        <div id="printable-contract" class="bg-white p-10 mx-auto w-full max-w-[210mm] shadow-sm relative text-black" style="min-height: 285mm; color: #000 !important;">
          <div v-if="contractToPrint">
            <!-- Quốc hiệu -->
            <div class="text-center mb-8">
              <h2 class="font-black text-lg uppercase" style="color: #000;">Cộng hòa xã hội chủ nghĩa Việt Nam</h2>
              <h3 class="font-bold text-sm underline pb-4" style="color: #000;">Độc lập - Tự do - Hạnh phúc</h3>
              <h1 class="font-black text-2xl uppercase mt-6" style="color: #000;">Hợp đồng thuê phòng</h1>
              <p class="text-xs italic mt-2" style="color: #000;">Mã hợp đồng: #HĐ-{{ String(contractToPrint.id).padStart(4, '0') }}</p>
            </div>

            <!-- Content -->
            <div class="text-sm leading-relaxed mb-6" style="color: #000;">
              <p class="mb-4">Hôm nay, ngày {{ new Date().getDate() }} tháng {{ new Date().getMonth() + 1 }} năm {{ new Date().getFullYear() }}, tại khu trọ <strong>{{ contractToPrint.room?.building?.name || contractToPrint.building_name || 'Diamond Riverside' }}</strong>. Chúng tôi gồm có:</p>
              
              <h3 class="font-bold uppercase mt-4 mb-2">Bên Cho Thuê (Bên A):</h3>
              <ul class="list-none pl-4 mb-4 space-y-1">
                <li><strong>Đại diện:</strong> Ban quản lý tòa nhà</li>
                <li><strong>Địa chỉ khu trọ:</strong> {{ contractToPrint.room?.building?.address || '........................................................' }}</li>
              </ul>
              
              <h3 class="font-bold uppercase mt-4 mb-2">Bên Thuê (Bên B):</h3>
              <ul class="list-none pl-4 mb-4 space-y-1">
                <li><strong>Ông/Bà:</strong> {{ contractToPrint.tenant?.name || contractToPrint.tenant_name || '................................' }}</li>
                <li><strong>Số điện thoại:</strong> {{ contractToPrint.tenant?.phone || contractToPrint.phone || '................................' }}</li>
                <li><strong>Email:</strong> {{ contractToPrint.tenant?.email || '................................' }}</li>
              </ul>
              
              <h3 class="font-bold uppercase mt-4 mb-2">Điều Khoản Mướn Phòng:</h3>
              <ul class="list-none pl-4 mb-4 space-y-2">
                <li><strong>Phòng thuê:</strong> Phòng số {{ contractToPrint.room?.room_number || contractToPrint.room_number }}</li>
                <li><strong>Đơn giá thuê:</strong> {{ formatPrice(contractToPrint.room?.price || contractToPrint.rent_price || contractToPrint.price) }} / tháng.</li>
                <li><strong>Thời hạn hợp đồng:</strong> Từ ngày {{ formatDate(contractToPrint.start_date) }} đến ngày {{ formatDate(contractToPrint.end_date) }}.</li>
                <li><strong>Tiền đặt cọc:</strong> {{ formatPrice(contractToPrint.deposit) }}. Số tiền này sẽ được hoàn trả sau khi kết thúc hợp đồng theo các quy định nếu không có vi phạm.</li>
              </ul>

              <h3 class="font-bold uppercase mt-4 mb-2">Dịch Vụ Đi Kèm:</h3>
              <ul class="list-none pl-4 mb-4 space-y-1">
                <li v-for="svc in contractToPrint.services || []" :key="svc.name">
                  - {{ svc.name }}: {{ formatPrice(svc.price || svc.unit_price) }} {{ svc.unit ? '/ ' + svc.unit : '' }}
                </li>
                <li v-if="!contractToPrint.services || contractToPrint.services.length === 0" class="italic text-gray-500">
                  (Chưa có thông tin dịch vụ chi tiết lúc ký)
                </li>
              </ul>

              <h3 class="font-bold uppercase mt-6 mb-2">Các Thỏa Thuận Khác:</h3>
              <div class="pl-4 mb-4 italic text-sm text-gray-800 min-h-[60px] border border-gray-400 p-4 bg-gray-50 rounded">
                {{ contractToPrint.terms || 'Hai bên cam kết thực hiện đúng nội quy khu trọ và các hợp đồng pháp lý liên quan.' }}
              </div>
            </div>

            <!-- Signatures -->
            <div class="grid grid-cols-2 gap-8 text-center mt-12 pb-12" style="color: #000;">
              <div>
                <p class="font-bold uppercase">Đại diện Bên Cho Thuê</p>
                <p class="text-xs italic mb-24">(Ký, ghi rõ họ tên)</p>
              </div>
              <div>
                <p class="font-bold uppercase">Người Thuê Phòng</p>
                <p class="text-xs italic mb-24">(Ký, ghi rõ họ tên)</p>
              </div>
            </div>
            
          </div>
        </div>
        <!-- END: Printable Area -->
      </div>
      
      <template #footer>
        <div class="flex justify-end gap-3 mt-4">
          <el-button @click="printPreviewVisible = false" class="theme-btn-cancel">Hủy</el-button>
          <el-button type="primary" @click="confirmPrint" class="theme-btn-submit flex items-center justify-center gap-2" style="background-color: #10b981 !important;">
            <el-icon size="16"><Printer /></el-icon> Tiến hành In
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog 
      v-model="addDialogVisible" 
      :title="isEdit ? 'Cập nhật Hợp đồng' : 'Khởi tạo Hợp đồng mới'" 
      width="90%" style="max-width: 650px"
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
            <el-select v-model="addForm.room_id" class="!w-full" placeholder="Chọn phòng">
              <el-option v-for="r in filteredRoomsByBuilding" :key="r.id" :label="r.room_number" :value="r.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="Chọn khách thuê" prop="tenant_id" required>
            <el-select v-model="addForm.tenant_id" class="!w-full" placeholder="Chọn khách thuê">
              <el-option v-for="t in allTenants" :key="t.id" :label="t.name" :value="t.id" />
            </el-select>
          </el-form-item>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="Ngày bắt đầu" prop="start_date" required>
            <el-date-picker v-model="addForm.start_date" type="date" placeholder="Chọn ngày" class="!w-full" format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
          </el-form-item>
          <el-form-item label="Ngày kết thúc" prop="end_date" required>
            <el-date-picker v-model="addForm.end_date" type="date" placeholder="Chọn ngày" class="!w-full" format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
          </el-form-item>
        </div>

        <div class="grid grid-cols-1 gap-4">
          <el-form-item label="Tiền đặt cọc (VNĐ)" prop="deposit" required>
            <el-input v-model.number="addForm.deposit" placeholder="Ví dụ: 2500000">
              <template #append>VNĐ</template>
            </el-input>
          </el-form-item>
        </div>

        <div class="grid grid-cols-1 gap-4">
          <el-form-item label="Trạng thái" prop="status" required>
            <el-select v-model="addForm.status" class="!w-full">
              <el-option label="Hoạt động" value="active" />
              <el-option label="Hết hạn" value="expired" />
              <el-option label="Đã chấm dứt" value="terminated" />
            </el-select>
          </el-form-item>
        </div>

        <el-form-item label="Điều khoản hợp đồng" prop="terms">
          <el-input v-model="addForm.terms" type="textarea" :rows="3" placeholder="Nhập các điều khoản bổ sung..." />
        </el-form-item>

        <!-- Dịch vụ đi kèm -->
        <div class="mt-6 mb-4 pt-6 border-t border-dashed border-row">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-[11px] font-black uppercase tracking-widest text-dim flex items-center gap-2">
              <el-icon class="text-blue-500"><Service /></el-icon>
              Dịch vụ đi kèm
            </h3>
            <el-button type="primary" link @click="addServiceRow" class="!text-xs font-bold">
              <el-icon class="mr-1"><Plus /></el-icon> Thêm dịch vụ
            </el-button>
          </div>
          
          <div v-for="(svc, index) in addForm.services" :key="index" class="grid grid-cols-12 gap-3 mb-3 items-end">
            <div class="col-span-6">
              <el-form-item :label="index === 0 ? 'Dịch vụ' : ''" class="!mb-0">
                <el-select v-model="svc.service_id" class="!w-full" placeholder="Chọn dịch vụ">
                  <el-option v-for="s in allServices" :key="s.id" :label="s.name" :value="s.id" />
                </el-select>
              </el-form-item>
            </div>
            <div class="col-span-5">
              <el-form-item :label="index === 0 ? 'Giá áp dụng (đ)' : ''" class="!mb-0">
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
          <el-button type="primary" @click="submitAddForm" class="theme-btn-submit" :loading="isSubmitting">
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
  Edit,
  Delete,
  RefreshRight,
  Printer,
  Service,
  ArrowLeft,
  ArrowRight,
  Upload,
  DocumentChecked,
} from "@element-plus/icons-vue";
import { ElMessageBox } from 'element-plus';

// ========== STATE ==========
const contracts = ref([]);
const buildings = ref([]);
const availableRooms = ref([]);
const allTenants = ref([]);
const allServices = ref([]);
const loading = ref(false);
const uploading = ref(false);
const isSubmitting = ref(false);
const isEdit = ref(false);
const editId = ref(null);

const currentPage = ref(1);
const pageSize = ref(10);
const totalContracts = ref(0);
const detailsVisible = ref(false);
const addDialogVisible = ref(false);
const addFormRef = ref(null);
const selectedContract = ref(null);

const printPreviewVisible = ref(false);
const printLoading = ref(false);
const contractToPrint = ref(null);

const addForm = ref({
  building_id: null,
  room_id: null,
  tenant_id: null,
  start_date: "",
  end_date: "",
  deposit: null,
  status: "active",
  terms: "",
  services: [{ service_id: null, price: 0 }],
});

const addRules = {
  room_id: [{ required: true, message: "Vui lòng chọn phòng", trigger: "change" }],
  tenant_id: [{ required: true, message: "Vui lòng chọn khách thuê", trigger: "change" }],
  start_date: [{ required: true, message: "Vui lòng chọn ngày bắt đầu", trigger: "change" }],
  end_date: [{ required: true, message: "Vui lòng chọn ngày kết thúc", trigger: "change" }],
  price: [], // Remove price rule as it's not used
  deposit: [{ required: true, message: "Vui lòng nhập tiền cọc", trigger: "blur" }],
  status: [{ required: true, message: "Vui lòng chọn trạng thái", trigger: "change" }],
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

const floorOptions = computed(() => []);

const filteredContracts = computed(() => {
  return contracts.value;
});

// ========== API METHODS ==========
const fetchContracts = async () => {
  loading.value = true;
  try {
    const response = await api.get("/contracts", {
      params: {
        page: currentPage.value,
        per_page: pageSize.value,
        status: filters.value.status
      }
    });
    const resData = response.data?.data || response.data;
    const finalData = Array.isArray(resData) ? resData : (resData?.data || []);
    contracts.value = finalData;
    
    // Update total count
    totalContracts.value = response.data?.total || response.data?.meta?.total || (Array.isArray(resData) ? resData.length : 0);
    
    console.log("Danh sách hợp đồng đã tải:", contracts.value);
  } catch (error) {
    console.error("Lỗi khi tải hợp đồng:", error);
    ElMessage.error("Không thể tải danh sách hợp đồng từ máy chủ");
  } finally {
    loading.value = false;
  }
};

const handleFilterChange = () => {
  currentPage.value = 1;
  fetchContracts();
};

const filteredRoomsByBuilding = computed(() => {
  if (!addForm.value.building_id) return availableRooms.value;
  return availableRooms.value.filter(r => r.building_id === addForm.value.building_id);
});

const fetchSupportData = async () => {
  try {
    const [bRes, rRes, cRes, sRes] = await Promise.all([
      api.get("/buildings"),
      api.get("/rooms"),
      api.get("/contracts"), // Lấy khách thuê từ hợp đồng
      api.get("/services")
    ]);
    
    const parseData = (res) => {
      const d = res?.data || res;
      return Array.isArray(d) ? d : (d?.data || []);
    };

    buildings.value = parseData(bRes);
    availableRooms.value = parseData(rRes);
    allServices.value = parseData(sRes);
    
    // Trích xuất tenants duy nhất từ danh sách hợp đồng
    const tenantsMap = new Map();
    const contractList = parseData(cRes);
    contractList.forEach(c => {
      if (c.tenant) tenantsMap.set(c.tenant.id, c.tenant);
    });
    allTenants.value = Array.from(tenantsMap.values());
    
    console.log("Dữ liệu hỗ trợ đã tải thành công:", {
      buildings: buildings.value.length,
      rooms: availableRooms.value.length,
      tenants: allTenants.value.length,
      services: allServices.value.length
    });
  } catch (error) {
    console.error("Lỗi tải dữ liệu hỗ trợ:", error);
    ElMessage.error("Không thể tải dữ liệu phòng hoặc khách thuê từ máy chủ");
  }
};

const handleSignedUpload = async (file) => {
  if (!selectedContract.value) return;
  uploading.value = true;
  try {
    const formData = new FormData();
    formData.append('file', file.raw);
    const response = await api.post(`/contracts/${selectedContract.value.id}/upload-signed`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    if (response.success || response.status === 200) {
      ElMessage.success("Đã tải lên hợp đồng đã ký thành công");
      fetchContracts();
      detailsVisible.value = false;
    }
  } catch (error) {
    ElMessage.error("Lỗi khi tải lên file");
  } finally {
    uploading.value = false;
  }
};



const openAddModal = () => {
  isEdit.value = false;
  editId.value = null;
  addForm.value = {
    room_id: null,
    tenant_id: null,
    start_date: '',
    end_date: '',
    deposit: null,
    rent_price: null,
    status: 'active',
    terms: '',
    services: [{ service_id: null, price: 0 }]
  };
  addDialogVisible.value = true;
};

const openEditModal = (contract) => {
  isEdit.value = true;
  editId.value = contract.id;
  addForm.value = {
    building_id: contract.room?.building?.id || contract.room?.building_id || null,
    room_id: contract.room_id,
    tenant_id: contract.tenant_id,
    start_date: contract.start_date,
    end_date: contract.end_date,
    deposit: contract.deposit,
    status: contract.status,
    terms: contract.terms || '',
    services: contract.services ? contract.services.map(s => ({ 
      service_id: s.id, 
      price: s.pivot?.price || s.price || s.unit_price || 0
    })) : [{ service_id: null, price: 0 }]
  };
  addDialogVisible.value = true;
};

const submitAddForm = async () => {
  const valid = await addFormRef.value.validate().catch(() => false);
  if (!valid) return;

  isSubmitting.value = true;
  try {
    const servicesPayload = (addForm.value.services || []).map(s => ({
      service_id: Number(s.service_id),
      price: Number(s.price)
    })).filter(s => {
      return s.service_id > 0 && allServices.value.some(realS => realS.id === s.service_id);
    });

    const payload = {
      room_id: Number(addForm.value.room_id),
      tenant_id: Number(addForm.value.tenant_id),
      start_date: addForm.value.start_date,
      end_date: addForm.value.end_date,
      deposit: Number(addForm.value.deposit),
      status: addForm.value.status,
      terms: addForm.value.terms,
    };

    if (servicesPayload.length > 0) {
      payload.services = servicesPayload;
    }

    console.log("Dữ liệu gửi lên Backend:", payload);

    let response;
    if (isEdit.value) {
      response = await api.put(`/contracts/${editId.value}`, payload);
    } else {
      response = await api.post("/contracts", payload);
    }

    // Kiểm tra status trong body (vì backend có thể trả về HTTP 200 nhưng status 422 trong JSON)
    const resStatus = response?.status || 200;
    if (resStatus >= 400) {
      throw new Error(response?.message || "Có lỗi xảy ra từ máy chủ");
    }

    ElMessage.success(isEdit.value ? "Cập nhật hợp đồng thành công" : "Ký hợp đồng thành công");
    addDialogVisible.value = false;
    fetchContracts();
  } catch (error) {
    console.error("Lỗi khi lưu hợp đồng:", error);
    const errorMsg = error.response?.data?.message || error.message || "Lỗi khi lưu dữ liệu";
    ElMessage.error(errorMsg);
  } finally {
    isSubmitting.value = false;
  }
};

const addServiceRow = () => {
  addForm.value.services.push({ service_id: null, price: 0 });
};

const removeServiceRow = (index) => {
  addForm.value.services.splice(index, 1);
};

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

const printContract = async (contract) => {
  contractToPrint.value = contract;
  printPreviewVisible.value = true;
  printLoading.value = true;
  try {
    const response = await api.get(`/contracts/${contract.id}`);
    const data = response.data || response;
    contractToPrint.value = data;
  } catch (error) {
    console.error("Lỗi lấy chi tiết in:", error);
    ElMessage.error("Không thể lấy chi tiết hợp đồng để in, dùng dữ liệu sơ lược");
    contractToPrint.value = contract;
  } finally {
    printLoading.value = false;
  }
};

const confirmPrint = () => {
  const originalElement = document.getElementById('printable-contract');
  if (!originalElement) return;
  
  const clone = originalElement.cloneNode(true);
  clone.style.height = 'auto';
  clone.style.minHeight = 'auto';
  clone.style.overflow = 'visible';
  
  const printHost = document.createElement('div');
  printHost.id = 'print-host';
  printHost.appendChild(clone);
  
  document.body.appendChild(printHost);

  setTimeout(() => {
    window.print();
    setTimeout(() => {
      const host = document.getElementById('print-host');
      if (host) document.body.removeChild(host);
    }, 500);
  }, 200);
};

const clearFilters = () => {
  filters.value = { building: null, floor: null, status: null };
  currentPage.value = 1;
  fetchContracts();
};
onMounted(() => {
  fetchContracts();
  fetchSupportData();
});
</script>

<style>
/* Ẩn clone host trên màn hình thường, tránh chớp nháy UI */
@media screen {
  #print-host {
    display: none !important;
  }
}

/* CSS cho định dạng In Browser Gốc */
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

/* Global Theme Variables */
:root {
  --bg-page: #f8fafc;
  --bg-card: #ffffff;
  --bg-table-head: #f8fafc;
  --bg-table-body: #ffffff;
  --bg-print-inner: #f1f5f9;
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
  --bg-print-inner: rgba(17, 24, 39, 0.4);
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

/* Match Invoices.vue print dialog styles */
:deep(.contract-print-dialog) {
  background-color: var(--bg-table-body) !important;
}

.contract-print-wrapper {
  background-color: var(--bg-print-inner);
}
</style>

<template>
  <el-dialog
    v-model="visible"
    title="Ký Điện Tử Hợp Đồng"
    width="90%" 
    style="max-width: 700px"
    class="theme-dialog-v3"
    append-to-body
    :close-on-click-modal="false"
    @open="handleOpen"
  >
    <div v-loading="loading" class="p-2 relative bg-section min-h-[400px] flex flex-col">
      <!-- Top Steps -->
      <div class="mb-8 mt-2 px-4">
        <el-steps :active="activeStep" align-center finish-status="success">
          <el-step title="Ký tên" description="Các bên ký xác nhận" />
          <el-step title="Xác nhận" description="Xác nhận & Hoàn tất" />
        </el-steps>
      </div>

      <div class="flex-1 px-4 pb-4 flex flex-col justify-center">
        <!-- Error State -->
        <div v-if="error" class="text-center text-rose-500 bg-rose-50 p-4 rounded-xl mb-4 border border-rose-200">
          <el-icon size="24" class="mb-2"><Warning /></el-icon>
          <p class="font-bold">{{ error }}</p>
          <el-button size="small" class="mt-3" @click="fetchStatus">Thử lại</el-button>
        </div>

        <!-- Content Wrapper -->
        <div v-else-if="!loading" class="w-full max-w-[500px] mx-auto">
          
          <!-- STEP 0: NO SESSION (KHỞI TẠO) -->
          <div v-if="!session" class="text-center py-6">
            <div class="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <el-icon size="32"><DocumentAdd /></el-icon>
            </div>
            <h3 class="font-black text-main text-lg mb-2">Chưa có phiên ký nào</h3>
            <p class="text-sm text-dim mb-6">
              Bạn cần khởi tạo phiên ký điện tử để bắt đầu thu thập chữ ký từ khách thuê và ban quản lý.
            </p>
            <el-button 
              type="primary" 
              class="theme-btn-submit !w-full" 
              style="height: 44px"
              :loading="actionLoading"
              @click="startSession"
            >
              <el-icon class="mr-2"><VideoPlay /></el-icon> Bắt đầu phiên ký
            </el-button>
          </div>

          <!-- STEP 1: SIGNING (KÝ TÊN) -->
          <div v-else-if="['pending_signature', 'partially_signed'].includes(session.status)" class="flex flex-col gap-5">
            <div class="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-xl">
              <div>
                <span class="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-1">Mã hợp đồng</span>
                <span class="font-black text-main">#HĐ-{{ String(contractId).padStart(4, '0') }}</span>
              </div>
              <div class="text-right">
                <span class="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-1">Trạng thái</span>
                <span class="font-bold text-amber-500">Đang chờ ký</span>
              </div>
            </div>

            <!-- Tiến trình ký của hai bên -->
            <div class="p-4 rounded-xl border border-dashed border-main bg-section/50 text-left">
              <h4 class="text-[11px] font-black uppercase tracking-widest text-dim mb-3">Tiến trình ký kết</h4>
              <div class="flex flex-col gap-3">
                <div class="flex items-center justify-between text-sm">
                  <span class="font-bold text-main">Đại diện BQL (Bên A)</span>
                  <span v-if="session.signatures?.admin" class="text-emerald-500 font-bold flex items-center gap-1.5 text-xs">
                    <el-icon><CircleCheck /></el-icon> Đã ký ({{ formatDate(session.signatures.admin.signed_at) }})
                  </span>
                  <span v-else class="text-amber-500 font-bold flex items-center gap-1.5 text-xs">
                    <el-icon><Warning /></el-icon> Chưa ký
                  </span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="font-bold text-main">Khách thuê: {{ contractObj?.tenant?.name || 'Bên B' }}</span>
                  <span v-if="session.signatures?.tenant" class="text-emerald-500 font-bold flex items-center gap-1.5 text-xs">
                    <el-icon><CircleCheck /></el-icon> Đã ký ({{ formatDate(session.signatures.tenant.signed_at) }})
                  </span>
                  <span v-else class="text-amber-500 font-bold flex items-center gap-1.5 text-xs">
                    <el-icon><Warning /></el-icon> Chưa ký
                  </span>
                </div>
              </div>
            </div>

            <!-- Admin Action Required -->
            <div v-if="!hasAdminSigned" class="border border-main p-4 rounded-2xl bg-white shadow-sm">
              <p class="text-sm font-bold text-main mb-3">Vui lòng ký tên của bạn (Đại diện BQL):</p>
              
              <SignatureCanvas 
                ref="signatureCanvasRef" 
                :height="200" 
                @update:empty="val => isCanvasEmpty = val"
              />

              <el-button 
                type="primary" 
                class="theme-btn-submit !w-full mt-4" 
                style="height: 44px"
                :disabled="isCanvasEmpty"
                :loading="actionLoading"
                @click="submitSignature"
              >
                Gửi chữ ký
              </el-button>
            </div>

            <!-- Admin has signed, waiting for Tenant -->
            <div v-else-if="hasAdminSigned" class="text-center py-8 bg-white border border-main rounded-2xl shadow-sm">
              <div class="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <el-icon size="32"><Check /></el-icon>
              </div>
              <h3 class="font-black text-main text-lg mb-2">Bạn đã ký thành công</h3>
              <p class="text-sm text-dim mb-4 px-6">
                Đang chờ khách thuê thực hiện ký tên trên ứng dụng. 
              </p>
              <div class="flex justify-center gap-2">
                <el-button plain size="small" @click="fetchStatus" :loading="actionLoading">
                  <el-icon class="mr-1"><RefreshRight /></el-icon> Làm mới
                </el-button>
              </div>
            </div>
          </div>

          <!-- STEP 2: CONFIRMING (XÁC NHẬN) -->
          <div v-else-if="session.status === 'pending_final_confirmation'" class="text-center py-6 bg-white border border-main rounded-2xl shadow-sm px-6">
            <div class="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <el-icon size="32"><WarningFilled /></el-icon>
            </div>
            <h3 class="font-black text-main text-lg mb-2">Đã đủ chữ ký 2 bên</h3>
            <p class="text-sm text-dim mb-6">
              Bạn có xác nhận đồng ý với mọi điều khoản và tiến hành sinh bản PDF cuối cùng không?
            </p>

            <!-- Tiến trình xác nhận của hai bên -->
            <div class="mb-6 p-4 rounded-xl border border-dashed border-main bg-section/50 text-left">
              <h4 class="text-[11px] font-black uppercase tracking-widest text-dim mb-3">Tiến trình xác nhận</h4>
              <div class="flex flex-col gap-3">
                <div class="flex items-center justify-between text-sm">
                  <span class="font-bold text-main">Đại diện BQL (Bên A)</span>
                  <span v-if="session.confirmations?.admin" class="text-emerald-500 font-bold flex items-center gap-1.5 text-xs">
                    <el-icon><CircleCheck /></el-icon> Đã xác nhận ({{ formatDate(session.confirmations.admin.confirmed_at) }})
                  </span>
                  <span v-else class="text-amber-500 font-bold flex items-center gap-1.5 text-xs">
                    <el-icon><Warning /></el-icon> Chưa xác nhận
                  </span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="font-bold text-main">Khách thuê: {{ contractObj?.tenant?.name || 'Bên B' }}</span>
                  <span v-if="session.confirmations?.tenant" class="text-emerald-500 font-bold flex items-center gap-1.5 text-xs">
                    <el-icon><CircleCheck /></el-icon> Đã xác nhận ({{ formatDate(session.confirmations.tenant.confirmed_at) }})
                  </span>
                  <span v-else class="text-amber-500 font-bold flex items-center gap-1.5 text-xs">
                    <el-icon><Warning /></el-icon> Chưa xác nhận
                  </span>
                </div>
              </div>
            </div>
            
            <div v-if="!hasAdminConfirmed">
              <div class="bg-gray-50 border border-gray-200 p-3 rounded-lg text-xs text-left mb-4 italic text-dim">
                "Tôi xác nhận đã đọc, hiểu rõ và đồng ý với toàn bộ nội dung của Hợp đồng thuê phòng này."
              </div>
              <el-button 
                type="primary" 
                class="theme-btn-submit !w-full" 
                style="height: 44px; background-color: #f59e0b !important; border-color: #f59e0b;"
                :loading="actionLoading"
                @click="submitConfirmation"
              >
                Tôi xác nhận & Đồng ý
              </el-button>
            </div>
            <div v-else class="text-emerald-500 font-bold flex items-center justify-center gap-2">
              <el-icon><CircleCheck /></el-icon> Bạn đã xác nhận. Chờ khách thuê...
            </div>
          </div>

          <!-- STEP 3: FINALIZE (HOÀN TẤT) -->
          <div v-else-if="session.status === 'ready_for_mock_finalize'" class="text-center py-6 bg-white border border-main rounded-2xl shadow-sm px-6">
            <div class="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <el-icon size="32"><DocumentChecked /></el-icon>
            </div>
            <h3 class="font-black text-main text-lg mb-2">Phiên ký đã hoàn tất</h3>
            <p class="text-sm text-dim mb-6">
              Hệ thống đã ghi nhận đầy đủ chữ ký và xác nhận. Vui lòng đóng dấu hợp đồng để lưu trữ pháp lý.
            </p>
            <el-button 
              type="primary" 
              class="theme-btn-submit !w-full" 
              style="height: 44px; background-color: #6366f1 !important; border-color: #6366f1;"
              :loading="actionLoading"
              @click="finalizeContract"
            >
              <el-icon class="mr-2"><Stamp /></el-icon> Đóng dấu Mock CA & Lưu
            </el-button>
          </div>

          <!-- STEP 4: COMPLETED -->
          <div v-else-if="session.status === 'completed'" class="text-center py-8">
            <div class="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
              <el-icon size="40"><CircleCheckFilled /></el-icon>
            </div>
            <h3 class="font-black text-main text-2xl mb-2">Hợp đồng đã đóng dấu</h3>
            <p class="text-sm text-dim mb-6">
              Phiên ký kết đã thành công. Bản PDF cuối cùng đã được lưu an toàn.
            </p>
            <el-button plain @click="close" class="!px-8 font-bold">
              Đóng
            </el-button>
          </div>

        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import api from '../axios';
import SignatureCanvas from './SignatureCanvas.vue';
import { 
  DocumentAdd, VideoPlay, Check, RefreshRight, 
  Warning, WarningFilled, CircleCheck, DocumentChecked, 
  Stamp, CircleCheckFilled 
} from '@element-plus/icons-vue';

const props = defineProps({
  contractId: {
    type: [Number, String],
    required: true
  }
});

const emit = defineEmits(['close', 'success']);

const visible = ref(false);
const loading = ref(false);
const actionLoading = ref(false);
const error = ref('');
const session = ref(null);
const contractObj = ref(null);
const isCanvasEmpty = ref(true);
const signatureCanvasRef = ref(null);

const activeStep = computed(() => {
  if (!session.value) return 0;
  switch (session.value.status) {
    case 'pending_signature':
    case 'partially_signed':
      return 0; // Bước 1: Ký tên
    case 'pending_final_confirmation':
    case 'ready_for_mock_finalize':
      return 1; // Bước 2: Xác nhận
    case 'completed':
      return 2; // Hoàn thành
    default:
      return 0;
  }
});

const hasAdminSigned = computed(() => {
  if (!session.value || !session.value.signatures) return false;
  return Object.values(session.value.signatures).some(sig => sig.signer_role === 'admin');
});

const hasAdminConfirmed = computed(() => {
  if (!session.value || !session.value.confirmations) return false;
  return Object.values(session.value.confirmations).some(conf => conf.role === 'admin');
});

const open = (contractData) => {
  if (contractData) {
    contractObj.value = contractData;
  }
  visible.value = true;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "---";
  try {
    const d = new Date(dateStr);
    return d.toLocaleString("vi-VN");
  } catch {
    return dateStr;
  }
};

// Re-sign functions removed

const close = () => {
  visible.value = false;
  emit('close');
};

const handleOpen = async () => {
  await fetchStatus();
  if (!session.value && !error.value) {
    await startSession(true);
  }
};

const fetchStatus = async () => {
  loading.value = true;
  error.value = '';
  try {
    const res = await api.get(`/contracts/${props.contractId}/signing/status`);
    if (res.data) {
      if (res.data.status === 'not_started') {
        session.value = null;
      } else {
        session.value = res.data;
      }
    }
  } catch (err) {
    console.error("Lỗi khi lấy trạng thái ký:", err);
    error.value = err.response?.data?.message || 'Không thể tải trạng thái phiên ký. Vui lòng thử lại sau.';
  } finally {
    loading.value = false;
  }
};

const startSession = async (silent = false) => {
  actionLoading.value = true;
  try {
    const res = await api.post(`/contracts/${props.contractId}/signing/start`);
    if (!silent) {
      ElMessage.success('Khởi tạo phiên ký thành công!');
    }
    if (res.data) {
      session.value = res.data;
    } else {
      await fetchStatus();
    }
  } catch (err) {
    console.error(err);
    const msg = err.response?.data?.message || 'Không thể khởi tạo phiên ký';
    ElMessage.error(msg);
    if (silent) {
      error.value = msg;
    }
  } finally {
    actionLoading.value = false;
  }
};

const submitSignature = async () => {
  if (!signatureCanvasRef.value || signatureCanvasRef.value.isEmpty) {
    ElMessage.warning('Vui lòng vẽ chữ ký trước khi gửi.');
    return;
  }

  const base64Signature = signatureCanvasRef.value.getBase64();
  if (!base64Signature) return;

  actionLoading.value = true;
  try {
    await api.post(`/contracts/${props.contractId}/signing/sign`, {
      signature_payload: base64Signature,
      document_hash: session.value.document_hash
    });
    ElMessage.success('Đã gửi chữ ký thành công!');
    await fetchStatus();
  } catch (err) {
    console.error(err);
    const msg = err.response?.data?.message || 'Lỗi khi gửi chữ ký';
    ElMessage.error(msg);
  } finally {
    actionLoading.value = false;
  }
};

const submitConfirmation = async () => {
  actionLoading.value = true;
  try {
    await api.post(`/contracts/${props.contractId}/signing/confirm`, {
      accepted: true
    });
    ElMessage.success('Đã xác nhận thành công!');
    await fetchStatus();
  } catch (err) {
    console.error(err);
    const msg = err.response?.data?.message || 'Lỗi khi gửi xác nhận';
    ElMessage.error(msg);
  } finally {
    actionLoading.value = false;
  }
};

const finalizeContract = async () => {
  actionLoading.value = true;
  try {
    await api.post(`/contracts/${props.contractId}/signing/finalize-mock`);
    ElMessage.success('Đã sinh PDF và khóa hợp đồng thành công!');
    await fetchStatus();
    emit('success');
  } catch (err) {
    console.error(err);
    const msg = err.response?.data?.message || 'Lỗi khi finalize hợp đồng';
    ElMessage.error(msg);
  } finally {
    actionLoading.value = false;
  }
};

defineExpose({
  open,
  close
});
</script>

<style scoped>
/* Inherit themes from main application if needed */
</style>

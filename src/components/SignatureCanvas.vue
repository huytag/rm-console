<template>
  <div class="signature-canvas-container relative w-full flex flex-col gap-3">
    <!-- Header/Label -->
    <div class="flex items-center justify-between px-1">
      <span class="text-xs font-black uppercase tracking-widest text-dim">
        <slot name="label">Vùng Ký Tên</slot>
      </span>
      <button 
        v-if="!disabled"
        @click="clearCanvas" 
        class="text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors flex items-center gap-1 bg-rose-500/10 px-2 py-1 rounded-md"
        type="button"
      >
        <el-icon><RefreshLeft /></el-icon> Ký lại
      </button>
    </div>

    <!-- Canvas Wrapper -->
    <div 
      class="canvas-wrapper relative w-full bg-white rounded-2xl overflow-hidden border-2 transition-all duration-300 shadow-sm"
      :class="[
        disabled ? 'border-gray-200 bg-gray-50 opacity-70 cursor-not-allowed' : 'border-dashed border-blue-300 hover:border-blue-500 cursor-crosshair'
      ]"
      :style="{ height: height + 'px' }"
    >
      <canvas
        ref="canvasRef"
        class="w-full h-full block"
        @mousedown="startDrawing"
        @mousemove="draw"
        @mouseup="stopDrawing"
        @mouseleave="stopDrawing"
        @touchstart.prevent="startDrawingTouch"
        @touchmove.prevent="drawTouch"
        @touchend.prevent="stopDrawing"
      ></canvas>

      <!-- Placeholder Text if Empty -->
      <div 
        v-if="isEmpty && !disabled" 
        class="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-blue-300/50"
      >
        <el-icon size="32" class="mb-2"><EditPen /></el-icon>
        <span class="text-sm font-bold tracking-wide">Ký vào vùng này</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { RefreshLeft, EditPen } from '@element-plus/icons-vue';

const props = defineProps({
  height: {
    type: Number,
    default: 200
  },
  disabled: {
    type: Boolean,
    default: false
  },
  strokeColor: {
    type: String,
    default: '#1e293b' // slate-800
  },
  lineWidth: {
    type: Number,
    default: 3
  }
});

const emit = defineEmits(['update:empty']);

const canvasRef = ref(null);
const isDrawing = ref(false);
const isEmpty = ref(true);

let ctx = null;

const initCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  // Handle high-DPI displays for crisp rendering
  const rect = canvas.parentElement.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  
  canvas.width = rect.width * dpr;
  canvas.height = props.height * dpr;
  
  ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = props.strokeColor;
  ctx.lineWidth = props.lineWidth;
  
  // Fill with transparent background
  ctx.fillStyle = 'transparent';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

// Adjust canvas on window resize
const handleResize = () => {
  if (isEmpty.value) {
    initCanvas();
  }
};

onMounted(() => {
  initCanvas();
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});

// Mouse Events
const startDrawing = (e) => {
  if (props.disabled) return;
  isDrawing.value = true;
  if (isEmpty.value) {
    isEmpty.value = false;
    emit('update:empty', false);
  }
  
  const rect = canvasRef.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  ctx.beginPath();
  ctx.moveTo(x, y);
};

const draw = (e) => {
  if (!isDrawing.value || props.disabled) return;
  
  const rect = canvasRef.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  ctx.lineTo(x, y);
  ctx.stroke();
};

const stopDrawing = () => {
  if (isDrawing.value) {
    ctx.closePath();
    isDrawing.value = false;
  }
};

// Touch Events
const startDrawingTouch = (e) => {
  if (props.disabled) return;
  const touch = e.touches[0];
  const mouseEvent = new MouseEvent('mousedown', {
    clientX: touch.clientX,
    clientY: touch.clientY
  });
  startDrawing(mouseEvent);
};

const drawTouch = (e) => {
  if (props.disabled) return;
  const touch = e.touches[0];
  const mouseEvent = new MouseEvent('mousemove', {
    clientX: touch.clientX,
    clientY: touch.clientY
  });
  draw(mouseEvent);
};

// Public Methods
const clearCanvas = () => {
  if (!ctx || !canvasRef.value) return;
  
  // Save current transform
  ctx.save();
  // Reset transform to clear the whole canvas correctly across DPR
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
  // Restore transform
  ctx.restore();
  
  isEmpty.value = true;
  emit('update:empty', true);
};

const getBase64 = () => {
  if (isEmpty.value || !canvasRef.value) return null;
  // Return PNG data URL
  return canvasRef.value.toDataURL('image/png');
};

defineExpose({
  clearCanvas,
  getBase64,
  isEmpty
});
</script>

<style scoped>
.canvas-wrapper {
  touch-action: none; /* Prevent scrolling when signing on mobile */
}
</style>

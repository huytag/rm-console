
<template>
  <el-container class="app-container">
    <el-aside v-if="showLayout" width="220px" class="sidebar">
      <div class="logo">
        <h3>QL Phòng Trọ</h3>
      </div>
      <el-menu :default-active="route.path" router class="sidebar-menu">
        <el-menu-item index="/">
          <el-icon><HomeFilled /></el-icon>
          <span>Tổng quan</span>
        </el-menu-item>

        <el-sub-menu index="room-management">
          <template #title>
            <el-icon><House /></el-icon>
            <span>Phòng</span>
          </template>
          <el-menu-item index="/rooms">Sơ đồ phòng</el-menu-item>
          <el-menu-item index="/buildings">Tòa nhà</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="contracts">
          <template #title>
            <el-icon><Document /></el-icon>
            <span>Hợp đồng</span>
          </template>
          <el-menu-item index="/contracts">Danh sách HĐ</el-menu-item>
          <el-menu-item index="/reservations">Cọc giữ phòng</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="finance">
          <template #title>
            <el-icon><Wallet /></el-icon>
            <span>Tài chính</span>
          </template>
          <el-menu-item index="/invoices">Hóa đơn</el-menu-item>
          <el-menu-item index="/financial">Phiếu thu/chi</el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/tenants">
          <el-icon><User /></el-icon>
          <span>Người thuê</span>
        </el-menu-item>

        <el-menu-item index="/services">
          <el-icon><Setting /></el-icon>
          <span>Dịch vụ</span>
        </el-menu-item>

        <el-menu-item index="/utilities">
          <el-icon><Odometer /></el-icon>
          <span>Tiện ích</span>
        </el-menu-item>

        <el-sub-menu index="assets">
          <template #title>
            <el-icon><Box /></el-icon>
            <span>Tài sản</span>
          </template>
          <el-menu-item index="/assets">Quản lý tài sản</el-menu-item>
          <el-menu-item index="/maintenance">Yêu cầu bảo trì</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="staff">
          <template #title>
            <el-icon><UserFilled /></el-icon>
            <span>Nhân viên</span>
          </template>
          <el-menu-item index="/staff">Danh sách NV</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="reports">
          <template #title>
            <el-icon><DataAnalysis /></el-icon>
            <span>Báo cáo</span>
          </template>
          <el-menu-item index="/reports/revenue">Doanh thu</el-menu-item>
          <el-menu-item index="/reports/debtors">Công nợ</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="system">
          <template #title>
            <el-icon><Tools /></el-icon>
            <span>Hệ thống</span>
          </template>
          <el-menu-item index="/system-config">Cấu hình</el-menu-item>
          <el-menu-item index="/audit-log">Nhật ký</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>

    <!-- Mobile Drawer Sidebar -->
    <el-drawer
      v-model="isDrawerOpen"
      direction="ltr"
      size="240px"
      :with-header="false"
      class="mobile-drawer"
    >
      <div class="logo">
        <h3>QL Phòng Trọ</h3>
      </div>
      <el-menu :default-active="route.path" router class="sidebar-menu" @select="isDrawerOpen = false">
        <el-menu-item index="/">
          <el-icon><HomeFilled /></el-icon>
          <span>Tổng quan</span>
        </el-menu-item>

        <el-sub-menu index="room-management">
          <template #title>
            <el-icon><House /></el-icon>
            <span>Phòng</span>
          </template>
          <el-menu-item index="/rooms">Sơ đồ phòng</el-menu-item>
          <el-menu-item index="/buildings">Tòa nhà</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="contracts">
          <template #title>
            <el-icon><Document /></el-icon>
            <span>Hợp đồng</span>
          </template>
          <el-menu-item index="/contracts">Danh sách HĐ</el-menu-item>
          <el-menu-item index="/reservations">Cọc giữ phòng</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="finance">
          <template #title>
            <el-icon><Wallet /></el-icon>
            <span>Tài chính</span>
          </template>
          <el-menu-item index="/invoices">Hóa đơn</el-menu-item>
          <el-menu-item index="/financial">Phiếu thu/chi</el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/tenants">
          <el-icon><User /></el-icon>
          <span>Người thuê</span>
        </el-menu-item>

        <el-menu-item index="/services">
          <el-icon><Setting /></el-icon>
          <span>Dịch vụ</span>
        </el-menu-item>

        <el-menu-item index="/utilities">
          <el-icon><Odometer /></el-icon>
          <span>Tiện ích</span>
        </el-menu-item>

        <el-sub-menu index="assets">
          <template #title>
            <el-icon><Box /></el-icon>
            <span>Tài sản</span>
          </template>
          <el-menu-item index="/assets">Quản lý tài sản</el-menu-item>
          <el-menu-item index="/maintenance">Yêu cầu bảo trì</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="staff">
          <template #title>
            <el-icon><UserFilled /></el-icon>
            <span>Nhân viên</span>
          </template>
          <el-menu-item index="/staff">Danh sách NV</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="reports">
          <template #title>
            <el-icon><DataAnalysis /></el-icon>
            <span>Báo cáo</span>
          </template>
          <el-menu-item index="/reports/revenue">Doanh thu</el-menu-item>
          <el-menu-item index="/reports/debtors">Công nợ</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="system">
          <template #title>
            <el-icon><Tools /></el-icon>
            <span>Hệ thống</span>
          </template>
          <el-menu-item index="/system-config">Cấu hình</el-menu-item>
          <el-menu-item index="/audit-log">Nhật ký</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-drawer>

    <el-container>
      <el-header v-if="showLayout" class="header">
        <div class="header-left">
          <el-icon v-if="isMobile" class="mobile-menu-btn" @click="isDrawerOpen = true"><Expand /></el-icon>
          <h2>{{ pageTitle }}</h2>
        </div>
        <div class="header-right">
          <el-switch
            v-model="isDark"
            inline-prompt
            :active-icon="Moon"
            :inactive-icon="Sunny"
            @change="toggleDark"
            style="--el-switch-on-color: #334155; margin-right: 15px"
          />

          <el-badge
            :value="unreadCount"
            :hidden="unreadCount === 0"
            class="notif-badge"
          >
            <el-popover placement="bottom" :width="300" trigger="click">
              <template #reference>
                <el-icon class="notif-icon"><BellFilled /></el-icon>
              </template>
              <div class="notif-panel">
                <div class="notif-header">
                  <span>Thông báo</span>
                  <el-button
                    link
                    type="primary"
                    size="small"
                    @click="markAllRead"
                    >Đọc tất cả</el-button
                  >
                </div>
                <div class="notif-list" v-loading="notifLoading">
                  <div
                    v-for="notif in notifications"
                    :key="notif.id"
                    :class="['notif-item', { unread: !notif.read_at }]"
                    @click="markRead(notif)"
                  >
                    <p class="notif-data">{{ notif.data.message }}</p>
                    <span class="notif-time">{{
                      formatDate(notif.created_at)
                    }}</span>
                  </div>
                  <p v-if="notifications.length === 0" class="notif-empty">
                    Không có thông báo mới
                  </p>
                </div>
              </div>
            </el-popover>
          </el-badge>

          <el-dropdown @command="handleCommand">
            <span class="user-dropdown">
              <el-avatar
                :size="32"
                src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                class="user-avatar"
              />
              {{ user?.name || "Admin" }}
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">Hồ sơ</el-dropdown-item>
                <el-dropdown-item command="logout" divided
                  >Đăng xuất</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main :class="['main-content', { 'no-layout': !showLayout }]">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "./stores/auth";
import api from "./axios";
import {
  HomeFilled,
  House,
  Document,
  Wallet,
  User,
  Setting,
  Box,
  UserFilled,
  DataAnalysis,
  BellFilled,
  Sunny,
  Moon,
  Tools,
  Odometer,
  Expand,
} from "@element-plus/icons-vue";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const user = computed(() => authStore.user);
const isMobile = ref(false);
const isDrawerOpen = ref(false);

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

const showLayout = computed(() => {
  return !["/login", "/register"].includes(route.path);
});

const notifications = ref([]);
const notifLoading = ref(false);
const unreadCount = computed(
  () => notifications.value.filter((n) => !n.read_at).length,
);

const fetchNotifications = async () => {
  notifLoading.value = true;
  try {
    const res = await api.get("/notifications");
    notifications.value = res.data.data.data;
  } catch (error) {
    console.error(error);
  } finally {
    notifLoading.value = false;
  }
};

const markRead = async (notif) => {
  if (notif.read_at) return;
  try {
    await api.post(`/notifications/${notif.id}/read`);
    notif.read_at = new Date().toISOString();
  } catch (error) {
    console.error(error);
  }
};

const markAllRead = async () => {
  try {
    await api.post("/notifications/read-all");
    fetchNotifications();
  } catch (error) {
    console.error(error);
  }
};

const formatDate = (date) => {
  const d = new Date(date);
  return `${d.getHours()}:${d.getMinutes()} ${d.getDate()}/${d.getMonth() + 1}`;
};

const pageTitle = computed(() => {
  const titles = {
    "/": "Tổng quan",
    "/rooms": "Sơ đồ phòng",
    "/buildings": "Tòa nhà",
    "/invoices": "Hóa đơn",
    "/contracts": "Hợp đồng",
    "/reservations": "Cọc giữ phòng",
    "/financial": "Phiếu thu/chi",
    "/tenants": "Người thuê",
    "/services": "Dịch vụ",
    "/utilities": "Tiện ích",
    "/assets": "Tài sản",
    "/staff": "Nhân viên",
    "/maintenance": "Sửa chữa & Bảo trì",
    "/reports/revenue": "Báo cáo Doanh thu",
    "/reports/debtors": "Quản lý Công nợ",
    "/system-config": "Cấu hình hệ thống",
    "/audit-log": "Nhật ký hệ thống",
  };
  return titles[route.path] || "Rental Management";
});

const handleCommand = async (command) => {
  if (command === "logout") {
    await authStore.logout();
    window.location.href = "/login";
  }
};

const isDark = ref(false);

const toggleDark = () => {
  if (isDark.value) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
};

let scrollTimeout;
const handleGlobalScroll = () => {
  document.documentElement.classList.add("is-scrolling");
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    document.documentElement.classList.remove("is-scrolling");
  }, 800); // Ẩn đi sau 0.8s khi dừng cuộn
};

onMounted(() => {
  if (localStorage.getItem("theme") === "dark") {
    isDark.value = true;
    document.documentElement.classList.add("dark");
  }
  fetchNotifications();
  checkMobile();
  window.addEventListener("resize", checkMobile);
  window.addEventListener("scroll", handleGlobalScroll, true);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
  window.removeEventListener("scroll", handleGlobalScroll, true);
  clearTimeout(scrollTimeout);
});
</script>

<style scoped>
.app-container {
  height: 100vh;
  background: #f8fafc;
}

:deep(.el-menu--inline) {
  background-color: transparent !important;
}

.sidebar {
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

@media (max-width: 768px) {
  .sidebar {
    display: none;
  }
}

.mobile-drawer {
  background: #ffffff;
}

html.dark .mobile-drawer {
  background: #1e293b;
}

.logo {
  height: 70px;
  display: flex;
  align-items: center;
  padding-left: 24px;
  background: transparent;
}

.logo h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: 0.5px;
}

.sidebar-menu {
  border: none;
  background: transparent;
  padding: 10px 0;
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  height: 50px;
  line-height: 50px;
  margin: 4px 12px;
  border-radius: 8px;
  color: #64748b !important;
  transition: all 0.2s ease;
}

:deep(.el-menu-item:hover),
:deep(.el-sub-menu__title:hover) {
  background: #f8fafc !important;
  color: #1e293b !important;
}

:deep(.el-menu-item.is-active) {
  background: #3b82f6 !important;
  color: #fff !important;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.header {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  border-bottom: 1px solid #e2e8f0;
  height: 70px !important;
}

.header-left h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
}

.header-left {
  display: flex;
  align-items: center;
}

.mobile-menu-btn {
  font-size: 24px;
  cursor: pointer;
  margin-right: 15px;
  color: #1e293b;
}

html.dark .mobile-menu-btn {
  color: #f8fafc;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.notif-badge {
  cursor: pointer;
}

.notif-icon {
  font-size: 22px;
  color: #eab308 !important;
  transition: all 0.2s ease;
}

.notif-icon:hover {
  color: #facc15 !important;
  transform: scale(1.1);
}

.notif-panel {
  padding: 5px;
}

.notif-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-weight: 600;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 8px;
}

.notif-item {
  padding: 10px;
  border-bottom: 1px solid #f8fafc;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.notif-item:hover {
  background: #f1f5f9;
}

.notif-item.unread {
  background: #f0f9ff;
}

.notif-item.unread:hover {
  background: #e0f2fe;
}

.notif-data {
  margin: 0;
  font-size: 13px;
  line-height: 1.4;
  color: #1e293b;
}

.notif-time {
  font-size: 11px;
  color: #94a3b8;
}

.notif-empty {
  text-align: center;
  color: #94a3b8;
  font-size: 13px;
  padding: 20px 0;
}

.user-avatar {
  border: 2px solid #fff;
  box-shadow: 0 0 0 1px #e2e8f0;
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  border-radius: 20px;
  background: #f1f5f9;
  color: #475569;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.user-dropdown:hover {
  background: #e2e8f0;
}

.main-content {
  padding: 32px;
  overflow-y: auto;
}
.main-content.no-layout {
  padding: 0;
  height: 100vh;
}

@media (max-width: 768px) {
  .header {
    padding: 0 16px !important;
  }
  .main-content {
    padding: 16px;
  }
  .header-left h2 {
    font-size: 18px;
  }
  .user-dropdown {
    padding: 4px 8px;
  }
  .user-dropdown span:last-child {
    display: none;
  }
  .notif-icon {
    font-size: 20px;
  }
  .logo {
    padding-left: 16px;
  }
  
  /* Global form styles for mobile */
  :global(.el-form--inline .el-form-item) {
    display: flex;
    width: 100%;
    margin-right: 0 !important;
    margin-bottom: 12px;
  }
  :global(.el-form--inline .el-form-item__content) {
    width: 100%;
  }
  :global(.el-select), :global(.el-date-editor.el-input) {
    width: 100% !important;
  }
  :global(.el-button) {
    width: 100%;
  }
  :global(.el-table) {
    overflow-x: auto;
  }
}
</style>

<style>
html.dark body {
  background-color: #0f172a !important;
}

html.dark .app-container {
  background-color: transparent !important;
}

html.dark .header {
  background: rgba(15, 23, 42, 0.8) !important;
  border-bottom: 1px solid #1e293b !important;
}

html.dark .sidebar {
  background: #1e293b !important;
  border-right: none !important;
}

html.dark .sidebar .logo {
  background: rgba(255, 255, 255, 0.03) !important;
}

html.dark .sidebar .logo h3 {
  color: #f8fafc !important;
}

html.dark .el-menu-item,
html.dark .el-sub-menu__title {
  color: #94a3b8 !important;
}

html.dark .el-menu-item:hover,
html.dark .el-sub-menu__title:hover {
  background: rgba(255, 255, 255, 0.05) !important;
  color: #fff !important;
}

html.dark .header-left h2,
html.dark .user-dropdown {
  color: #f8fafc !important;
}

html.dark .user-dropdown {
  background: #1e293b !important;
}

html.dark .user-dropdown:hover {
  background: #334155 !important;
}

.el-card {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
}
.el-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08) !important;
}
html.dark .el-card:hover {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4) !important;
}

.el-table tbody tr {
  transition: background-color 0.2s ease !important;
}
.el-table tbody tr:hover > td.el-table__cell {
  background-color: rgba(59, 130, 246, 0.08) !important;
}
html.dark .el-table tbody tr:hover > td.el-table__cell {
  background-color: rgba(59, 130, 246, 0.15) !important;
}

.el-button {
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
}
.el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1) !important;
}
.el-button:active {
  transform: translateY(1px);
  box-shadow: none !important;
}

/* --- TÙY CHỈNH THANH CUỘN (SCROLLBAR) --- */
/* Mặc định thu nhỏ và ẩn màu nền */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: transparent;
  border-radius: 4px;
}

/* Chỉ hiện khi người dùng đang lăn chuột (nhờ vào class is-scrolling) */
html.is-scrolling ::-webkit-scrollbar-thumb {
  background-color: rgba(144, 147, 153, 0.3);
}

/* Hoặc khi người dùng di chuột trực tiếp lên trên vị trí thanh cuộn */
::-webkit-scrollbar-thumb:hover {
  background-color: rgba(144, 147, 153, 0.5) !important;
}

/* Chế độ tối (Dark mode) */
html.dark.is-scrolling ::-webkit-scrollbar-thumb {
  background-color: rgba(144, 147, 153, 0.5);
}

html.dark ::-webkit-scrollbar-thumb:hover {
  background-color: rgba(144, 147, 153, 0.8) !important;
}
</style>

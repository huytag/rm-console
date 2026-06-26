import axios from 'axios'
import { ElMessage } from 'element-plus'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost/api' : '/api'),
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Danh sách các API prefix chỉ dành cho admin (dựa theo backend middleware role:admin)
const ADMIN_ONLY_PREFIXES = [
  '/dashboard',
  '/buildings',
  '/rooms',
  '/services',
  '/contracts',
  '/utilities',
  '/checkout/confirm',
  '/invoices/generate',
  '/payments/create-order',
]

// Các URL phải khớp chính xác (không dùng prefix match)
const ADMIN_ONLY_EXACT_METHODS = {
  DELETE: ['/maintenance/'],
  PATCH: ['/maintenance/'],
}

/**
 * Kiểm tra xem một URL có thuộc danh sách admin-only không
 */
const isAdminOnlyRequest = (config) => {
  const url = config.url || ''
  const method = (config.method || 'get').toUpperCase()

  // Kiểm tra prefix match
  if (ADMIN_ONLY_PREFIXES.some(prefix => url.startsWith(prefix))) {
    return true
  }

  // Kiểm tra exact method + URL pattern
  const exactPatterns = ADMIN_ONLY_EXACT_METHODS[method]
  if (exactPatterns && exactPatterns.some(pattern => url.includes(pattern))) {
    return true
  }

  return false
}

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Chặn API admin-only nếu user là tenant
    const role = localStorage.getItem('user_role')
    if (role === 'tenant' && isAdminOnlyRequest(config)) {
      // Ghi đè adapter để trả về response rỗng mà không gửi request thật
      config.adapter = () => {
        return Promise.resolve({
          data: { data: [] },
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        })
      }
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // Xử lý tự động refresh token khi gặp lỗi 401 và request không phải là login/refresh
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/refresh') && !originalRequest.url.includes('/auth/login')) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const token = localStorage.getItem('token');
        // Sử dụng instance axios mặc định thay vì api để tránh lặp interceptor
        const response = await axios.post(api.defaults.baseURL + '/auth/refresh', {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        // Lấy token từ response (tuỳ thuộc vào cấu trúc trả về từ server, thường là data.data hoặc data)
        const resData = response.data.data || response.data;
        const newToken = resData.access_token;
        
        if (!newToken) throw new Error('Refresh token failed');

        localStorage.setItem('token', newToken);
        api.defaults.headers.common['Authorization'] = 'Bearer ' + newToken;
        originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
        
        processQueue(null, newToken);
        
        // Gửi lại request ban đầu với token mới
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        
        localStorage.removeItem('token');
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // Nếu lỗi 401 mà không phải do token hết hạn hợp lệ (hoặc refresh cũng bị lỗi)
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    
    const message = error.response?.data?.message || error.message || 'An error occurred'
    ElMessage.error(message)
    
    return Promise.reject(error)
  }
)

export default api

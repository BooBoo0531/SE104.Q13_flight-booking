import axios from 'axios';

// Tạo axios instance với base URL và interceptor
const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor tự động thêm JWT token vào mọi request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ==================== FLIGHTS API ====================

/**
 * Lấy danh sách tất cả chuyến bay
 * @returns {Promise<Array>} Danh sách chuyến bay với thông tin fromAirport, toAirport, plane
 */
export const getFlights = async () => {
  const response = await api.get('/flights');
  return response.data;
};

/**
 * Lấy chi tiết 1 chuyến bay
 * @param {number} id - ID của chuyến bay
 * @returns {Promise<Object>} Thông tin chi tiết chuyến bay
 */
export const getFlight = async (id) => {
  const response = await api.get(`/flights/${id}`);
  return response.data;
};

/**
 * Tạo chuyến bay mới
 * @param {Object} flightData - Dữ liệu chuyến bay
 * @param {number} flightData.fromAirportId - ID sân bay đi
 * @param {number} flightData.toAirportId - ID sân bay đến
 * @param {number} flightData.planeId - ID máy bay
 * @param {string} flightData.startTime - Thời gian khởi hành (ISO 8601)
 * @param {string} flightData.endTime - Thời gian hạ cánh (ISO 8601)
 * @param {number} flightData.price - Giá vé
 * @returns {Promise<Object>} Chuyến bay vừa tạo
 */
export const createFlight = async (flightData) => {
  const response = await api.post('/flights', flightData);
  return response.data;
};

/**
 * Cập nhật thông tin chuyến bay
 * @param {number} id - ID của chuyến bay cần cập nhật
 * @param {Object} flightData - Dữ liệu cần cập nhật
 * @returns {Promise<Object>} Chuyến bay sau khi cập nhật
 */
export const updateFlight = async (id, flightData) => {
  const response = await api.patch(`/flights/${id}`, flightData);
  return response.data;
};

/**
 * Xóa chuyến bay
 * @param {number} id - ID của chuyến bay cần xóa
 * @returns {Promise<void>}
 */
export const deleteFlight = async (id) => {
  await api.delete(`/flights/${id}`);
};

// ==================== AIRPORTS API ====================

/**
 * Lấy danh sách sân bay
 * @returns {Promise<Array>} Danh sách sân bay
 */
export const getAirports = async () => {
  const response = await api.get('/airports');
  return response.data;
};

// ==================== AIRPLANES API ====================

/**
 * Lấy danh sách máy bay
 * @returns {Promise<Array>} Danh sách máy bay
 */
export const getAirplanes = async () => {
  const response = await api.get('/airplanes');
  return response.data;
};

export default api;

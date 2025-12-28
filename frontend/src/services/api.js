import axios from "axios";

// Tạo axios instance với base URL và interceptor
const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor tự động thêm JWT token vào mọi request
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("uiticket_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ==================== FLIGHTS API ====================

export const getFlights = async () => {
  const response = await api.get("/flights");
  return response.data;
};

export const getFlight = async (id) => {
  const response = await api.get(`/flights/${id}`);
  return response.data;
};

export const createFlight = async (flightData) => {
  const response = await api.post("/flights", flightData);
  return response.data;
};

export const updateFlight = async (id, flightData) => {
  const response = await api.patch(`/flights/${id}`, flightData);
  return response.data;
};

export const deleteFlight = async (id) => {
  await api.delete(`/flights/${id}`);
};

// ==================== AIRPORTS API ====================

export const getAirports = async () => {
  const response = await api.get("/airports");
  return response.data;
};

export const createAirport = async (airportData) => {
  const response = await api.post("/airports", airportData);
  return response.data;
};

export const updateAirport = async (id, airportData) => {
  // PATCH trước, fallback PUT
  try {
    const res = await api.patch(`/airports/${id}`, airportData);
    return res.data;
  } catch (e) {
    const res = await api.put(`/airports/${id}`, airportData);
    return res.data;
  }
};

export const deleteAirport = async (id) => {
  const response = await api.delete(`/airports/${id}`);
  return response.data;
};

// ==================== SETTINGS API ====================

export const getSettings = async () => {
  const response = await api.get("/settings");
  return response.data;
};

export const updateSettings = async (settingsData) => {
  // ✅ PATCH trước (đúng REST), fallback PUT để tương thích
  try {
    const res = await api.patch("/settings", settingsData);
    return res.data;
  } catch (err) {
    const res = await api.put("/settings", settingsData);
    return res.data;
  }
};

// ==================== TICKET CLASSES API ====================

export const getTicketClasses = async () => {
  const response = await api.get("/ticket-classes");
  return response.data;
};

export const createTicketClass = async (data) => {
  const response = await api.post("/ticket-classes", data);
  return response.data;
};

export const updateTicketClass = async (id, data) => {
  // ✅ PATCH trước, nếu server chỉ có PUT thì fallback
  try {
    const response = await api.patch(`/ticket-classes/${id}`, data);
    return response.data;
  } catch (err) {
    const response = await api.put(`/ticket-classes/${id}`, data);
    return response.data;
  }
};

export const deleteTicketClass = async (id) => {
  const response = await api.delete(`/ticket-classes/${id}`);
  return response.data;
};

// ==================== TICKETS API ====================

export const getTickets = async () => {
  const response = await api.get("/tickets");
  return response.data;
};

export const createTicket = async (data) => {
  const response = await api.post("/tickets", data);
  return response.data;
};

export const updateTicket = async (ticketId, data) => {
  // PATCH trước, fallback PUT
  try {
    const response = await api.patch(`/tickets/${ticketId}`, data);
    return response.data;
  } catch (err) {
    const response = await api.put(`/tickets/${ticketId}`, data);
    return response.data;
  }
};

export const deleteTicket = async (ticketId) => {
  const response = await api.delete(`/tickets/${ticketId}`);
  return response.data;
};

// ==================== AIRPLANES API ====================

export const getAirplanes = async () => {
  const response = await api.get("/airplanes");
  return response.data;
};

export default api;

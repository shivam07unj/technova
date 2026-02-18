import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

export const analyzeTransaction = async (data) => {
  const response = await axios.post(`${API_BASE}/analyze`, data);
  return response.data;
};

export const getCustomer = async () => {
  const response = await axios.get(`${API_BASE}/analyze/customer`);
  return response.data;
};

export const getTransactions = async () => {
  const response = await axios.get(`${API_BASE}/analyze/transactions`);
  return response.data;
};

export const getUsers = async () => {
  const response = await axios.get(`${API_BASE}/analyze/users`);
  return response.data;
};

export const getUserDetail = async (userId) => {
  const response = await axios.get(`${API_BASE}/analyze/users/${userId}`);
  return response.data;
};

export const getUserTransactions = async (userId) => {
  const response = await axios.get(`${API_BASE}/analyze/users/${userId}/transactions`);
  return response.data;
};

export const getUserOffers = async (userId) => {
  const response = await axios.get(`${API_BASE}/analyze/users/${userId}/offers`);
  return response.data;
};

export const getStats = async () => {
  const response = await axios.get(`${API_BASE}/analyze/stats`);
  return response.data;
};

export const triggerAnalysis = async (userId) => {
  const response = await axios.post(`${API_BASE}/analyze/users/${userId}`);
  return response.data;
};


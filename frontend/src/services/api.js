import axios from 'axios';

let envBaseUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8001';

// Strict protection against stale LAN IPs (172.20.10.2, 10.240.68.31) or legacy ports (:8000)
if (envBaseUrl.includes('172.20.10.2') || envBaseUrl.includes('10.240.68.31') || envBaseUrl.includes(':8000')) {
  console.warn(`[Q-SHIELD API] Overriding stale URL '${envBaseUrl}' -> http://127.0.0.1:8001`);
  envBaseUrl = 'http://127.0.0.1:8001';
}

const rawBaseUrl = envBaseUrl;
const API_BASE_URL = rawBaseUrl.endsWith('/api') ? rawBaseUrl : `${rawBaseUrl}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

export const fetchHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export const uploadDocument = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/document/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const hashDocument = async (documentText) => {
  const response = await api.post('/document/hash', { document: documentText });
  return response.data;
};

export const signDocument = async (payload) => {
  const response = await api.post('/qds/sign', payload);
  return response.data;
};

export const teleportState = async (payload) => {
  const response = await api.post('/qds/teleport', payload);
  return response.data;
};

export const verifySignature = async (payload) => {
  const response = await api.post('/qds/verify', payload);
  return response.data;
};

export const triggerAttack = async (attackType, payload) => {
  const endpoint = attackType.toLowerCase().replace(/_/g, '-');
  const response = await api.post(`/attack/${endpoint}`, payload);
  return response.data;
};

export const fetchThreatConfig = async () => {
  const response = await api.get('/threats/config');
  return response.data;
};

export const fetchLogs = async () => {
  const response = await api.get('/logs');
  return response.data;
};

export default api;

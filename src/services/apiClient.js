const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const TOKEN_KEY = 'auth_token';

export const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
  if (typeof window === 'undefined') return;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
};

const request = async (path, { method = 'GET', body, headers = {}, auth = false } = {}) => {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
  };
  if (auth) {
    const token = getToken();
    if (token) opts.headers.Authorization = `Bearer ${token}`;
  }
  if (body !== undefined) {
    opts.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  const res = await fetch(`${API_URL}${path}`, opts);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const detailMsg = Array.isArray(data.details) ? data.details.join(', ') : data.details;
    const err = new Error(data.message || detailMsg || `HTTP ${res.status}`);
    err.status = res.status;
    err.details = data.details;
    throw err;
  }
  return data;
};

export const api = {
  // ---------- Auth ----------
  register: (payload) => request('/api/auth/register', { method: 'POST', body: payload }),
  login: async (phone, password) => {
    const res = await request('/api/auth/login', {
      method: 'POST',
      body: { phone, password },
    });
    if (res?.data?.accessToken) setToken(res.data.accessToken);
    return res;
  },
  logout: () => setToken(null),
  me: () => request('/api/auth/me', { auth: true }),

  // ---------- Parking ----------
  getParkings: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/api/parkings${qs ? '?' + qs : ''}`);
  },
  getParking: (id) => request(`/api/parkings/${id}`),
  getParkingsNearby: ({ lat, lng, radius = 1500 }) =>
    request(`/api/parkings/nearby?lat=${lat}&lng=${lng}&radius=${radius}`),
  getParkingAvailability: (id) => request(`/api/parkings/${id}/availability`),

  // ---------- Routes (Google Maps) ----------
  searchRoute: ({ origin, destination, parkingRadius = 1500, includeParkings = true }) =>
    request('/api/routes/search', {
      method: 'POST',
      body: { origin, destination, parkingRadius, includeParkings },
      auth: true,
    }),
  geocode: (address) =>
    request(`/api/routes/geocode?address=${encodeURIComponent(address)}`),

  // ---------- Reservation ----------
  createReservation: ({ parkingId, vehiclePlate, startTime, endTime }) =>
    request('/api/reservations', {
      method: 'POST',
      body: { parkingId, vehiclePlate, startTime, endTime },
      auth: true,
    }),
  getMyReservations: (status) =>
    request(`/api/reservations/me${status ? '?status=' + status : ''}`, { auth: true }),
  getReservation: (id) => request(`/api/reservations/${id}`, { auth: true }),
  cancelReservation: (id) =>
    request(`/api/reservations/${id}/cancel`, { method: 'POST', auth: true }),

  // ---------- Payment ----------
  createInvoice: (reservationId) =>
    request('/api/payments/invoice', {
      method: 'POST',
      body: { reservationId },
      auth: true,
    }),
  getPaymentStatus: (id) => request(`/api/payments/${id}/status`, { auth: true }),

  // ---------- Voice ----------
  voiceChat: (text) =>
    request('/api/voice/chat', {
      method: 'POST',
      body: { text },
    }),
  voiceCommand: async ({ text, audioBlob, includeAudio = false }) => {
    const url = `${API_URL}/api/voice/command`;
    const token = getToken();
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    if (audioBlob) {
      const fd = new FormData();
      fd.append('audio', audioBlob, 'voice.wav');
      fd.append('includeAudio', String(includeAudio));
      const res = await fetch(url, { method: 'POST', headers, body: fd });
      return res.json();
    }
    headers['Content-Type'] = 'application/json';
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ text, includeAudio }),
    });
    return res.json();
  },
  tts: async (text, voice = 'FEMALE3') => {
    const res = await fetch(`${API_URL}/api/voice/tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice }),
    });
    return res.blob();
  },
};

export default api;

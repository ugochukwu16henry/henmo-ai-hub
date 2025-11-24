// src/lib/api.ts

import axios from 'axios';
import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
} from 'axios';

// Minimal custom interface – only adds the retry flag
interface ApiConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Add Bearer token on every request (client only) ────────────────────────
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ── Handle 401 → refresh token automatically ───────────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as ApiConfig | undefined;

    if (
      error.response?.status === 401 &&
      config &&
      !config._retry &&
      typeof window !== 'undefined'
    ) {
      config._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) throw new Error('Missing refresh token');

        const response: AxiosResponse<{ data: { accessToken: string } }> =
          await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });

        const { accessToken: newToken } = response.data.data;

        localStorage.setItem('accessToken', newToken);

        // Update the failed request and retry it
        config.headers ??= {} as any;
        config.headers.Authorization = `Bearer ${newToken}`;

        return api(config);
      } catch (_) {
        // Refresh failed → log out
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
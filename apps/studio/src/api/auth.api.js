// src/api/auth.api.js
import axios from 'axios';

const BASE = import.meta.env.VITE_API_BASE_URL ?? '/api/v1';

/**
 * @returns {{ access_token: string, user: { id, slug, role } }}
 */
export async function login(email, password) {
  const { data } = await axios.post(
    `${BASE}/auth/login`,
    { email, password },
    { withCredentials: true }
  );
  return data;
}

export async function logout() {
  await axios.post(`${BASE}/auth/logout`, {}, { withCredentials: true });
}

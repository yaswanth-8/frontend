import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE; // e.g. https://simply-yaswanth.onrender.com

export const api = axios.create({ baseURL: `${API_BASE}/api` });

export function setToken(token?: string) {
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
}

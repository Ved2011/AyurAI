const rawBackendUrl = process.env.REACT_APP_BACKEND_URL?.trim();

const normalizeBaseUrl = (value) => {
  if (!value) return "";
  return value.replace(/\/+$/, "");
};

export const API_BASE = `${normalizeBaseUrl(rawBackendUrl)}/api`;

export const apiUrl = (path) => `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;

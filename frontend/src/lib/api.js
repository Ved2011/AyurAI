const DEFAULT_BACKEND_URL = "https://ayur-recommendations.preview.emergentagent.com";
const rawBackendUrl = process.env.REACT_APP_BACKEND_URL?.trim() || DEFAULT_BACKEND_URL;

const normalizeBaseUrl = (value) => {
  if (!value) return "";
  return value.replace(/\/+$/, "");
};

export const API_BASE = `${normalizeBaseUrl(rawBackendUrl)}/api`;

export const apiUrl = (path) => `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;

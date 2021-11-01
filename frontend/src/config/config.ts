const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === "development";

export const BACKEND_URL = isDev
  ? "http://localhost:3001"
  : window.location.origin;

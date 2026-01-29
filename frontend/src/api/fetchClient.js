const API_URL = import.meta.env.VITE_API_URL;

export const fetchClient = async (url, options = {}) => {
  if (!API_URL) throw new Error("API_URL is not defined in environment variables");

  // Ensure no double slashes
  const base = API_URL.replace(/\/$/, ""); // remove trailing slash from API_URL
  const path = url.startsWith("/") ? url : `/${url}`; // ensure url starts with /

  const token = localStorage.getItem("token");

  const res = await fetch(base + path, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Something went wrong");
  }

  return res.json();
};

export const fetchClient = async (url, options = {}) => {
  const token = localStorage.getItem("token");
  const res = await fetch(process.env.VITE_API_URL + url, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Something went wrong");
  }

  return res.json();
};

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const request = async (path, options = {}) => {
  const response = await fetch(`${API_URL}/api/auth${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Authentication request failed");
  }

  return data;
};

export const signUp = (user) =>
  request("/signup", { method: "POST", body: JSON.stringify(user) });

export const signIn = (credentials) =>
  request("/signin", { method: "POST", body: JSON.stringify(credentials) });

export const getCurrentUser = (token) =>
  request("/me", { headers: { Authorization: `Bearer ${token}` } });

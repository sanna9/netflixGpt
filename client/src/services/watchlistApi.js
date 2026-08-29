const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const request = async (path, options = {}) => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${API_URL}/api/watchlist${path}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
    ...options,
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Watchlist request failed");
  }

  return data;
};

export const getWatchlist = () => request("/");
export const saveToWatchlist = (movie) =>
  request("/", { method: "POST", body: JSON.stringify(movie) });
export const removeFromWatchlist = (movieId) => request(`/${movieId}`, { method: "DELETE" });

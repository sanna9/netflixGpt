const API_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "development" ? "http://localhost:5000" : "");

export const buildPersonalizedRecommendationPrompt = (userName, watchlist = []) => {
  const list = watchlist.length
    ? watchlist.map((movie) => movie?.title).filter(Boolean).join(", ")
    : "No saved movies yet";

  return `Act as a movie recommendation system for ${userName}. Based on these saved movies: ${list}. Suggest up to 5 movies that match their taste and interests. Only return movie names, one per line.`;
};

export const getPersonalizedRecommendations = async (userName, watchlist = []) => {
  try {
    const response = await fetch(`${API_URL}/api/recommendations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
      },
      body: JSON.stringify({ userName, watchlist }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data.movies || [];
  } catch (error) {
    console.error("Personalized recommendation error:", error);
    return [];
  }
};

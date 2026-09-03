import openAi from "../utils/openAi";

export const buildPersonalizedRecommendationPrompt = (userName, watchlist = []) => {
  const list = watchlist.length
    ? watchlist.map((movie) => movie?.title).filter(Boolean).join(", ")
    : "No saved movies yet";

  return `Act as a movie recommendation system for ${userName}. Based on these saved movies: ${list}. Suggest up to 5 movies that match their taste and interests. Only return movie names, one per line.`;
};

export const getPersonalizedRecommendations = async (userName, watchlist = []) => {
  try {
    const prompt = buildPersonalizedRecommendationPrompt(userName, watchlist);
    const aiResults = await openAi.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const rawResponse = aiResults.choices[0]?.message?.content || "";

    return rawResponse
      .split("\n")
      .map((line) => line.replace(/^\d+[\.")]?\s*/, "").trim())
      .filter(Boolean);
  } catch (error) {
    console.error("Personalized recommendation error:", error);
    return [];
  }
};

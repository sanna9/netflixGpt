import { API_OPTIONS } from "../constants/constants";

export const movieRecommendationsApi = async (movieId) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/recommendations?language=en-US&page=1`,
    API_OPTIONS
  );

  if (!response.ok) throw new Error("Unable to load movie recommendations");

  const data = await response.json();
  return data.results || [];
};

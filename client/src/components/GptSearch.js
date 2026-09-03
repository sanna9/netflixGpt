import React, { useCallback, useEffect, useState } from "react";
import MovieSuggestions from "./MovieSuggestions";
import SearchBar from "./SearchBar";
import { LOGIN_BG } from "../constants/constants";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "../hooks/useTranslation";
import {
  addGptMovieList,
  clearGptMovieList,
} from "../store/gptSlice";
import { movieSearchApi } from "../services/movieSearchApi";
import { openAiSearch } from "../services/openAiSearch";
import Layout from "./Layout";

const GptSearch = () => {
  const langKey = useSelector((store) => store.config.lang);
  const t = useTranslation(langKey, true);
  const dispatch = useDispatch();

  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  const handleGptSearch = useCallback(async () => {
    if (!searchText.trim()) {
      alert("Search text is empty. Please enter value.");
      return;
    }

    setIsLoading(true);
    setSearchError("");
    try {
      // Get movie suggestions from GPT
      const moviesList = await openAiSearch(searchText);
      // Search for each movie in TMDB
      const tmdbResults = await Promise.all(
        moviesList.map((movie) => movieSearchApi(movie))
      );
      dispatch(addGptMovieList(tmdbResults));
    } catch (error) {
      setSearchError(error.message || "Unable to search right now");
    } finally {
      setIsLoading(false);
    }
  }, [searchText, dispatch]);

  useEffect(() => {
    dispatch(clearGptMovieList());

  }, [dispatch]);

  return (
    <Layout>
      <div>
        <div className="fixed -z-10">
          <img src={LOGIN_BG} alt="logo" className="h-screen w-screen" />
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative">
          <SearchBar
            placeholder={t("gptSearchPlaceholder")}
            btnLabel={t("search")}
            searchText={searchText}
            onSearchTextChange={setSearchText}
            onClick={handleGptSearch}
            isLoading={isLoading}
          />
          {searchError && (
            <p className="relative mx-auto mt-3 w-11/12 max-w-2xl rounded bg-red-950/90 p-3 text-center text-white">
              {searchError}
            </p>
          )}
          <MovieSuggestions />
        </div>
      </div>
    </Layout>
  );
};

export default GptSearch;

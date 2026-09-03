import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import MovieList from "./MovieList";
import { getWatchlist } from "../services/watchlistApi";
import { movieRecommendationsApi } from "../services/movieRecommendationsApi";

const PersonalizedRecommendations = () => {
  const user = useSelector((store) => store?.user);
  const popularMovies = useSelector((store) => store?.movies?.popularMovies || []);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    let isMounted = true;

    if (!user) {
      setMovies([]);
      return () => {
        isMounted = false;
      };
    }

    const loadRecommendations = async () => {
      try {
        const { watchlist = [] } = await getWatchlist();

        if (!watchlist.length) {
          if (isMounted) {
            setMovies(popularMovies.slice(0, 10));
          }
          return;
        }

        const recommendationGroups = await Promise.all(
          watchlist.slice(-5).map((movie) => movieRecommendationsApi(movie.id))
        );
        const savedIds = new Set(watchlist.map((movie) => movie.id));
        const uniqueRecommendations = Array.from(
          new Map(
            recommendationGroups
              .flat()
              .filter((movie) => movie?.id && !savedIds.has(movie.id))
              .map((movie) => [movie.id, movie])
          ).values()
        );

        if (isMounted) {
          setMovies(
            uniqueRecommendations.length
              ? uniqueRecommendations.slice(0, 10)
              : popularMovies.slice(0, 10)
          );
        }
      } catch (error) {
        if (isMounted) {
          setMovies(popularMovies.slice(0, 10));
        }
      }
    };

    loadRecommendations();

    return () => {
      isMounted = false;
    };
  }, [user, popularMovies]);

  if (!movies.length) return null;

  return (
    <MovieList title={`${user?.displayName || "Your"} Picks`} movies={movies} />
  );
};

const BodyContainer = () => {
  const movies = useSelector((store) => store?.movies);

  return (
    movies && (
      <div className="bg-black">
        <div className="-mt-60 z-10 relative">
          <MovieList title={"Now Playing"} movies={movies?.nowPlayingMovies} />
          <MovieList title={"Popular"} movies={movies?.popularMovies} />
          <MovieList title={"Trending"} movies={movies?.nowPlayingMovies} />
          <PersonalizedRecommendations />
        </div>
      </div>
    )
  );
};

export default BodyContainer;

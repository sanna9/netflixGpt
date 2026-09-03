import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import MovieList from "./MovieList";
import { getWatchlist } from "../services/watchlistApi";
import { getPersonalizedRecommendations } from "../services/personalizedRecommendations";
import { movieSearchApi } from "../services/movieSearchApi";

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

        const suggestedTitles = await getPersonalizedRecommendations(
          user.displayName || "there",
          watchlist
        );

        if (!suggestedTitles.length) {
          if (isMounted) {
            setMovies(popularMovies.slice(0, 10));
          }
          return;
        }

        const tmdbResults = await Promise.all(
          suggestedTitles.map((movieName) => movieSearchApi(movieName))
        );

        if (isMounted) {
          setMovies(tmdbResults.flat().filter(Boolean).slice(0, 10));
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
  }, [user?.uid, user?.displayName, popularMovies]);

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

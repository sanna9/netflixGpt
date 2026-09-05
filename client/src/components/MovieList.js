import React, { useCallback, useEffect, useMemo, useRef } from "react";
import MovieCard from "./MovieCard";
import { useDispatch } from "react-redux";
import { addDetailMovie } from "../store/moviesSlice";
import { detailMovieApi } from "../services/detailMovieApi";
import { useNavigate } from "react-router-dom";

const MovieList = ({ title, movies }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const flattenedMovies = useMemo(
    () => movies?.flat?.(Infinity) || movies || [],
    [movies]
  );
  const loopedMovies = useMemo(
    () =>
      flattenedMovies.length > 1
        ? [...flattenedMovies, ...flattenedMovies, ...flattenedMovies]
        : flattenedMovies,
    [flattenedMovies]
  );

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || flattenedMovies.length <= 1) return;

    const moveToMiddleCopy = () => {
      container.scrollLeft = container.scrollWidth / 3;
    };

    const frameId = requestAnimationFrame(moveToMiddleCopy);
    return () => cancelAnimationFrame(frameId);
  }, [flattenedMovies.length]);

  const handleInfiniteScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || flattenedMovies.length <= 1) return;

    const copyWidth = container.scrollWidth / 3;

    if (container.scrollLeft <= 1) {
      container.scrollLeft += copyWidth;
    } else if (container.scrollLeft >= copyWidth * 2) {
      container.scrollLeft -= copyWidth;
    }
  }, [flattenedMovies.length]);

  const getDetailMovie = async (movieId) => {
    try {
      const movieDetails = await detailMovieApi(movieId);

      dispatch(addDetailMovie(movieDetails));
      navigate(`/movie/${movieId}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="">
      <h1 className="text-white text-3xl py-6 capitalize">{title}</h1>

      <div
        ref={scrollContainerRef}
        onScroll={handleInfiniteScroll}
        className="flex overflow-x-auto custom-scroll-none"
      >
        <div className="flex cursor-pointer">
          {flattenedMovies.length > 0 ? (
            <>
              {loopedMovies.map((movie, index) => (
                <MovieCard
                  key={`${movie?.id}-${index}`}
                  posterPath={movie?.poster_path}
                  onClick={() => getDetailMovie(movie?.id)}
                />
              ))}
            </>
          ) : (
            <p className="py-4 text-gray-400">No movies found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieList;

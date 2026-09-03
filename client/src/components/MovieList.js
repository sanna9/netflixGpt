import React from "react";
import MovieCard from "./MovieCard";
import { useDispatch } from "react-redux";
import { addDetailMovie } from "../store/moviesSlice";
import { detailMovieApi } from "../services/detailMovieApi";
import { useNavigate } from "react-router-dom";

const MovieList = ({ title, movies }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const flattenedMovies = movies?.flat?.(Infinity) || movies || [];

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
      <h1 className="text-white text-3xl py-6">{title}</h1>

      <div className="flex overflow-x-auto custom-scroll-none">
        <div className="flex cursor-pointer">
          {flattenedMovies.length > 0 ? (
            <>
              {flattenedMovies?.map((movie) => (
                <MovieCard
                  key={movie?.id}
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

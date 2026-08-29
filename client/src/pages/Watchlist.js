import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import MovieCard from "../components/MovieCard";
import { getWatchlist } from "../services/watchlistApi";

const Watchlist = () => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getWatchlist()
      .then(({ watchlist }) => setMovies(watchlist))
      .catch(() => setMovies([]));
  }, []);

  return (
    <Layout bodyClassName="min-h-screen bg-black">
      <main className="px-8 pt-24">
        <h1 className="text-3xl font-bold text-white">My List</h1>
        {movies.length ? (
          <div className="flex flex-wrap pt-6">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                posterPath={movie.poster_path}
                onClick={() => navigate(`/movie/${movie.id}`)}
              />
            ))}
          </div>
        ) : (
          <p className="pt-6 text-gray-400">Your saved movies will appear here.</p>
        )}
      </main>
    </Layout>
  );
};

export default Watchlist;

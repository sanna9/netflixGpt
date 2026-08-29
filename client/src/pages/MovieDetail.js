import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import MovieBanner from "../components/MovieBanner";
import MovieInfo from "../components/MovieInfo";
import { detailMovieApi } from "../services/detailMovieApi";
import { addDetailMovie } from "../store/moviesSlice";
import Layout from "../components/Layout";
import Button from "../components/Button";
import {
  getWatchlist,
  removeFromWatchlist,
  saveToWatchlist,
} from "../services/watchlistApi";

const MovieDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const movieDetailInfo = useSelector((store) => store?.movies?.detailMovie);
  const [isSaved, setIsSaved] = useState(false);
  const [watchlistError, setWatchlistError] = useState(null);

  const getDetailMovie = async (id) => {
    try {
      const movieDetails = await detailMovieApi(id);

      dispatch(addDetailMovie(movieDetails));
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getDetailMovie(id);
  }, [id]);

  useEffect(() => {
    getWatchlist()
      .then(({ watchlist }) => {
        setIsSaved(watchlist.some((movie) => String(movie.id) === String(id)));
      })
      .catch(() => setWatchlistError("Unable to load your list"));
  }, [id]);

  const handleWatchlistToggle = async () => {
    try {
      setWatchlistError(null);
      if (isSaved) {
        await removeFromWatchlist(id);
        setIsSaved(false);
      } else {
        await saveToWatchlist(movieDetailInfo);
        setIsSaved(true);
      }
    } catch (error) {
      setWatchlistError(error.message);
    }
  };

  return (
    <Layout bodyClassName="bg-black h-screen">
      <div className="grid grid-cols-3 gap-4 pt-24 w-3/4 mx-auto">
        <div className="col-span-1 bg-lightblue text-center p-4">
          <MovieBanner posterImg={movieDetailInfo?.poster_path} />
        </div>
        <div className="col-span-2 bg-lightcoral bg-lightcoral text-center p-4 flex items-center justify-center">
          <div>
            <MovieInfo movieDetailInfo={movieDetailInfo} />
            <Button
              label={isSaved ? "Remove from My List" : "Add to My List"}
              buttonClassName="bg-red-700 text-white mt-6"
              onClick={handleWatchlistToggle}
            />
            {watchlistError && (
              <p className="text-red-400 mt-3">{watchlistError}</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MovieDetail;

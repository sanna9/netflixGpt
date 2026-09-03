import React, { useEffect } from "react";
import nowPlayingMoviesApi from "../services/nowPlayingMoviesApi";
import HeroContainer from "../components/HeroContainer";
import BodyContainer from "../components/BodyContainer";
import { useDispatch, useSelector } from "react-redux";
import { addNowPlayingMovies, addPopularMovies } from "../store/moviesSlice";
import popularMoviesApi from "../services/popularMoviesApi";
import Layout from "../components/Layout";

const Browse = () => {
  const dispatch = useDispatch();
  const nowPlayingMovies = useSelector(
    (store) => store.movies.nowPlayingMovies
  );
  const popularMovies = useSelector((store) => store.movies.popularMovies);

  useEffect(() => {
    if (!nowPlayingMovies.length) {
      nowPlayingMoviesApi()
        .then((movies) => dispatch(addNowPlayingMovies(movies)))
        .catch((error) =>
          console.error("Error fetching now playing movies in Browse:", error)
        );
    }

    if (!popularMovies.length) {
      popularMoviesApi()
        .then((movies) => dispatch(addPopularMovies(movies)))
        .catch((error) =>
          console.error("Error fetching now playing movies in Browse:", error)
        );
    }
  }, [dispatch, nowPlayingMovies.length, popularMovies.length]);

  return (
    <Layout>
      <HeroContainer />
      <BodyContainer />
    </Layout>
  );
};

export default Browse;

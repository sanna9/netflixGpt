import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import VideoTitle from "./VideoTitle";
import VideoBackground from "./VideoBackground";
import TopTrailerListing from "./TopTrailerListing";
import ShimmerHero from "./ShimmerHero";

const HeroContainer = () => {
  const movies = useSelector((store) => store?.movies?.nowPlayingMovies);

  const [selectedMovie, setSelectedMovie] = useState({});

  const {
    original_title,
    overview,
    release_date,
    vote_average,
    original_language,
    vote_count,
    id,
  } = selectedMovie || {};

  const trailerMoviesList = useMemo(() => movies?.slice(0, 5) || [], [movies]);

  if (!movies?.length) return <ShimmerHero />;

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  return (
    <section
      id="hero-container"
      aria-live="polite"
      className="relative min-h-[32rem] overflow-hidden bg-black sm:min-h-[38rem] lg:min-h-0 lg:aspect-video"
    >
      <VideoTitle
        title={original_title || movies[0]?.original_title}
        overview={overview || movies[0]?.overview}
        releaseDate={release_date || movies[0]?.release_date}
        reviewStar={vote_average || movies[0]?.vote_average}
        originalLang={original_language || movies[0]?.original_language}
        voteCount={vote_count || movies[0]?.vote_count}
      />
      <VideoBackground movieId={id || movies[0]?.id} />
      <TopTrailerListing
        movieData={trailerMoviesList}
        onMovieClick={handleMovieClick}
      />
    </section>
  );
};

export default HeroContainer;

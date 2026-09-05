import React from "react";
import { IMG_CDN_URL } from "../constants/constants";

const TopTrailerListing = ({ movieData, onMovieClick }) => {
  return (
    <ul className="absolute bottom-24 right-4 z-20 hidden cursor-pointer sm:flex lg:bottom-44 lg:right-10">
      {movieData?.map((movie, index) => (
        <li
          key={movie?.id}
          className="group mx-1"
          onClick={() => onMovieClick(movie)}
        >
            <img
              alt={`${movie?.title || movie?.original_title || "Movie"} trailer`}
              className="h-12 w-12 rounded object-cover transition-transform group-hover:scale-110 lg:h-16 lg:w-16"
              src={IMG_CDN_URL + movie?.poster_path}
            />
        </li>
      ))}
    </ul>
  );
};

export default TopTrailerListing;

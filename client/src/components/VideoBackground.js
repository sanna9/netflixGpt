import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovieTrailer } from "../services/fetchMovieTrailer";
import { addTrailerVideo } from "../store/moviesSlice";

const VideoBackground = ({ movieId }) => {
  const dispatch = useDispatch();
  const trailerVideo = useSelector((store) => store?.movies?.trailerVideo);

  useEffect(() => {
    const getTrailer = async () => {
      const trailer = await fetchMovieTrailer(movieId);
      dispatch(addTrailerVideo(trailer));
    };

    getTrailer();
  }, [movieId, dispatch]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {trailerVideo?.key ? (
        <iframe
          className="absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 border-0 lg:h-full lg:w-full lg:min-h-0 lg:min-w-0"
          src={`https://www.youtube.com/embed/${trailerVideo.key}?modestbranding=1&rel=0&controls=0&autoplay=1&mute=1&loop=1&playlist=${trailerVideo.key}`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media;"
          modestbranding="1"
        ></iframe>
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-gray-950 via-black to-gray-900" />
      )}
    </div>
  );
};

export default VideoBackground;

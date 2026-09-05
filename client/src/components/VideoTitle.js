import React from "react";
import Button from "./Button";
import { FaPlay } from "react-icons/fa";
import { BsInfoCircle } from "react-icons/bs";
import { FaStar } from "react-icons/fa";

const VideoTitle = ({
  title,
  overview,
  releaseDate,
  reviewStar,
  originalLang,
  voteCount,
}) => {
  return (
    <div className="absolute inset-0 z-10 flex flex-col justify-center bg-gradient-to-r from-black via-black/70 to-transparent px-4 pb-20 pt-24 sm:px-8 sm:pb-28 lg:px-24 lg:pb-40 lg:pt-32">
      <h1 className="max-w-2xl pb-3 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
        {title}
      </h1>
      <div>
        <span className="mb-3 flex flex-wrap items-center gap-1 text-xs capitalize text-white sm:mb-4 sm:text-sm">
          <FaStar className="text-yellow-500" /> {reviewStar} | {voteCount}{" "}
          <span className="pl-2 sm:pl-8">
            {" "}
            {releaseDate?.split("-")[0]} | {originalLang}
          </span>
        </span>
      </div>
      <p className="mb-5 max-w-xl text-sm text-white line-clamp-3 sm:text-base sm:line-clamp-4 lg:w-2/5">
        {overview}
      </p>
      <div className="gap-2.5 flex">
        <Button
          btnIcon={<FaPlay aria-label="Play Video" />}
          labelClassName="gap-2.5"
          label="Play"
          buttonClassName="hover:bg-opacity-80 bg-white"
        />
        <Button
          label="More Info"
          btnIcon={<BsInfoCircle aria-label="More Info" />}
          labelClassName="gap-2.5"
          buttonClassName="bg-transparent border border-white text-white"
        />
      </div>
    </div>
  );
};

export default VideoTitle;

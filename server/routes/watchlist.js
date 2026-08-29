const express = require("express");
const User = require("../models/User");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

const movieFields = [
  "id",
  "title",
  "poster_path",
  "backdrop_path",
  "overview",
  "release_date",
];

const getMovieSnapshot = (movie) =>
  movieFields.reduce((snapshot, field) => {
    if (movie[field] !== undefined) snapshot[field] = movie[field];
    return snapshot;
  }, {});

router.use(requireAuth);

router.get("/", async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("watchlist");
    return res.json({ watchlist: user?.watchlist || [] });
  } catch (error) {
    return res.status(500).json({ message: "Unable to load watchlist" });
  }
});

router.post("/", async (req, res) => {
  try {
    const movie = getMovieSnapshot(req.body);
    if (!movie.id || !movie.title) {
      return res.status(400).json({ message: "Movie id and title are required" });
    }

    const user = await User.findById(req.userId).select("watchlist");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadySaved = user.watchlist.some(
      (savedMovie) => savedMovie.id === movie.id
    );
    if (!alreadySaved) {
      user.watchlist.push(movie);
      await user.save();
    }

    return res.status(alreadySaved ? 200 : 201).json({ watchlist: user.watchlist });
  } catch (error) {
    return res.status(500).json({ message: "Unable to save movie" });
  }
});

router.delete("/:movieId", async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("watchlist");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.watchlist = user.watchlist.filter(
      (movie) => String(movie.id) !== req.params.movieId
    );
    await user.save();
    return res.json({ watchlist: user.watchlist });
  } catch (error) {
    return res.status(500).json({ message: "Unable to remove movie" });
  }
});

module.exports = router;

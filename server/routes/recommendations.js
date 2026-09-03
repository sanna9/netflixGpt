const express = require("express");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

const parseMovieNames = (content = "") =>
  content
    .split("\n")
    .map((line) => line.replace(/^\s*\d+[.)-]?\s*/, "").trim())
    .filter(Boolean)
    .slice(0, 5);

router.post("/", requireAuth, async (req, res) => {
  const { searchText, userName, watchlist = [] } = req.body || {};
  const savedTitles = Array.isArray(watchlist)
    ? watchlist.map((movie) => movie?.title).filter(Boolean).slice(0, 20)
    : [];

  if (!searchText?.trim() && !savedTitles.length) {
    return res.status(400).json({ message: "Enter a search or save movies first" });
  }
  if (!process.env.OPENAI_API_KEY) {
    return res.status(503).json({ message: "AI search is not configured" });
  }

  const prompt = searchText?.trim()
    ? `Suggest up to 5 movies for this request: ${searchText.trim()}. Return only movie names, one per line.`
    : `Suggest up to 5 movies for ${userName || "this user"} based on these saved movies: ${savedTitles.join(", ")}. Return only movie names, one per line.`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      console.error("OpenAI request failed", response.status);
      return res.status(502).json({ message: "AI recommendations are temporarily unavailable" });
    }
    return res.json({ movies: parseMovieNames(data.choices?.[0]?.message?.content) });
  } catch (error) {
    console.error("OpenAI request error", error.message);
    return res.status(502).json({ message: "AI recommendations are temporarily unavailable" });
  }
});

module.exports = router;

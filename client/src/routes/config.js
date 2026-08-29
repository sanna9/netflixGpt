import Browse from "../pages/Browse";
import Login from "../pages/Login";
import Error from "../pages/Error";
import MovieDetail from "../pages/MovieDetail";
import GptSearch from "../components/GptSearch";
import Watchlist from "../pages/Watchlist";

const config = [
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/browse",
    element: <Browse />,
  },
  {
    path: "/error",
    element: <Error />,
  },
  {
    path: "/movie/:id",
    element: <MovieDetail />,
  },
  {
    path: "gpt-search",
    element: <GptSearch />,
  },
  {
    path: "/watchlist",
    element: <Watchlist />,
  },
];

export default config;

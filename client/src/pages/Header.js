import React, { useCallback, useEffect } from "react";
import Dropdown from "../components/Dropdown";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addUser, removeUser } from "../store/userSlice";
import { LOGO, SUPPORTED_LANG } from "../constants/constants";
import Button from "../components/Button";
import Select from "../components/Select";
import { changeLanguage } from "../store/configSlice";

import { useTranslation } from "../hooks/useTranslation";
import { useLocation } from "react-router-dom";
import { getCurrentUser } from "../services/authApi";
import { FaUserLarge } from "react-icons/fa6";

const Header = () => {
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const langKey = useSelector((store) => store.config.lang) || "en";
  const isGptSearchPage = location.pathname === "/gpt-search";
  const t = useTranslation(langKey, isGptSearchPage);

  const handleSignOut = useCallback(async () => {
    try {
      localStorage.removeItem("authToken");
      dispatch(removeUser());
      navigate("/");
    } catch (error) {
      navigate("/error");
    }
  }, [dispatch, navigate]);

  const dropdownItems = [
    { label: user?.displayName },
    { label: t("logout"), onClick: handleSignOut },
  ];

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      dispatch(removeUser());
      if (window.location.pathname !== "/") navigate("/");
      return undefined;
    }

    getCurrentUser(token)
      .then(({ user: currentUser }) => {
        dispatch(addUser(currentUser));
        if (window.location.pathname === "/") navigate("/browse");
      })
      .catch(() => {
        localStorage.removeItem("authToken");
        dispatch(removeUser());
        navigate("/");
      });
  }, [dispatch, navigate]);

  const handleButtonClick = useCallback(() => {
    if (location.pathname === "/gpt-search") {
      navigate("/browse");
    } else {
      navigate("/gpt-search");
    }
  }, [navigate, location.pathname]);

  const handleLanguageChange = useCallback(
    (lang) => {
      dispatch(changeLanguage(lang || "en"));
    },
    [dispatch]
  );
  if (!user) return null;

  return (
    <header className="absolute z-20 flex w-full flex-wrap items-center justify-between gap-2 bg-gradient-to-b from-black/90 to-transparent px-3 py-2 sm:flex-nowrap sm:px-6 lg:px-8">
      <a href="/browse">
        <img
          className="w-24 sm:w-32 lg:w-44"
          src={LOGO}
          alt="NetflixGPT home"
        />
      </a>

      {user && (
        <nav className="flex flex-wrap items-center justify-end gap-2 sm:flex-nowrap sm:gap-3 lg:gap-4">
          <button
            type="button"
            className={`whitespace-nowrap text-xs text-white hover:underline sm:text-sm ${
              location.pathname === "/watchlist" ? "font-bold" : ""
            }`}
            onClick={() => navigate("/watchlist")}
          >
            My List
          </button>

          {isGptSearchPage && (
            <Select
              options={SUPPORTED_LANG}
              onChange={handleLanguageChange}
              placeholder="Language"
              className="max-w-24 rounded bg-white p-1 text-xs sm:max-w-none sm:p-2 sm:text-sm"
            />
          )}
          <Button
            label={
              isGptSearchPage ? t("home") : t("gptSearch")
            }
            buttonClassName="whitespace-nowrap bg-red-700 px-2 py-1 text-xs text-white sm:px-4 sm:py-2 sm:text-sm"
            onClick={handleButtonClick}
          />
          <Dropdown
            items={dropdownItems}
            trigger={
              user?.photoURL ? (
                <img
                  className="h-8 w-8 cursor-pointer rounded-full border border-white/30 object-cover sm:h-10 sm:w-10"
                  src={user?.photoURL}
                  alt="user-icon"
                />
              ) : (
                <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-gray-800 shadow-md shadow-black/30 sm:h-10 sm:w-10">
                  <FaUserLarge className="text-white text-sm" />
                </div>
              )
            }
          />
        </nav>
      )}
    </header>
  );
};

export default Header;

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
    <div className="absolute px-8 py-2 z-10 flex items-center justify-between w-full">
      <a href="/browse">
        <img className="w-44" src={LOGO} alt="logo" />
      </a>

      <button
        type="button"
        className={`absolute left-1/2 -translate-x-1/2 text-white ${
          location.pathname === "/watchlist" ? "font-bold" : ""
        }`}
        onClick={() => navigate("/watchlist")}
      >
        Watch List
      </button>

      {user && (
        <div className="flex items-center space-x-4">
          {isGptSearchPage && (
            <Select
              options={SUPPORTED_LANG}
              onChange={handleLanguageChange}
              placeholder="Select Language"
              className="m-2 bg-white  p-2 rounded"
            />
          )}
          <Button
            label={
              isGptSearchPage ? t("home") : t("gptSearch")
            }
            buttonClassName="bg-red-700 text-white"
            onClick={handleButtonClick}
          />
          <Dropdown
            items={dropdownItems}
            trigger={
              user?.photoURL ? (
                <img
                  className="w-10 h-10 rounded-full object-cover cursor-pointer border border-white/30"
                  src={user?.photoURL}
                  alt="user-icon"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-800 border border-white/20 flex items-center justify-center cursor-pointer shadow-md shadow-black/30">
                  <FaUserLarge className="text-white text-sm" />
                </div>
              )
            }
          />
        </div>
      )}
    </div>
  );
};

export default Header;

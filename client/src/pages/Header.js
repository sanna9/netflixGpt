import React, { useCallback, useEffect, useMemo } from "react";
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

const Header = () => {
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const showGptSearch = useSelector((store) => store.gpt.showGptSearch);
  const langKey = useSelector((store) => store.config.lang) || "en";
  const t = useTranslation(langKey, showGptSearch);

  const handleSignOut = useCallback(async () => {
    try {
      localStorage.removeItem("authToken");
      dispatch(removeUser());
      navigate("/");
    } catch (error) {
      navigate("/error");
    }
  }, [dispatch, navigate]);

  const dropdownItems = useMemo(() => {
    return [
      { label: user?.displayName },
      {
        label: t("logout"),
        onClick: handleSignOut,
      },
    ];
  }, [user, langKey, showGptSearch, navigate]);

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
    <div className="absolute px-8 py-2 z-10 flex justify-between w-full">
      <a href="/browse">
        <img className="w-44" src={LOGO} alt="logo" />
      </a>

      {user && (
        <div className="flex items-center space-x-4">
          {showGptSearch && (
            <Select
              options={SUPPORTED_LANG}
              onChange={handleLanguageChange}
              placeholder="Select Language"
              className="m-2 bg-white  p-2 rounded"
            />
          )}
          <Button
            label={
              location.pathname === "/gpt-search" ? t("home") : t("gptSearch")
            }
            buttonClassName="bg-red-700 text-white"
            onClick={handleButtonClick}
          />
          <Dropdown
            items={dropdownItems}
            trigger={
              <img
                className="w-10 rounded-3xl cursor-pointer"
                src={user?.photoURL}
                alt="user-icon"
              />
            }
          />
        </div>
      )}
    </div>
  );
};

export default Header;

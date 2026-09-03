import React from "react";
import Button from "./Button";

const SearchBar = ({
  placeholder,
  btnLabel,
  onClick,
  searchText,
  onSearchTextChange,
  isLoading = false,
}) => {
  return (
    <div className="pt-40 relative w-full">
      <form
        className="flex p-4 w-6/12 bg-black m-auto"
        onSubmit={(event) => {
          event.preventDefault();
          if (!isLoading) onClick();
        }}
      >
        <input
          type="text"
          placeholder={placeholder}
          className="rounded p-2 border w-full"
          value={searchText} // Controlled input
          onChange={(e) => onSearchTextChange(e.target.value)} // Update parent state
        />
        <Button
          label={isLoading ? "Searching..." : btnLabel}
          buttonClassName="bg-red-700"
          labelClassName="text-white"
          onClick={onClick}
          disabled={isLoading}
        />
      </form>
    </div>
  );
};

export default SearchBar;

import React from "react";

const Button = ({
  label,
  labelClassName,
  onClick,
  buttonClassName,
  btnIcon,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`custom-button cursor px-4 py-2 rounded shadow-lg disabled:cursor-not-allowed disabled:opacity-60 ${buttonClassName || ""}`}
    >
      <span className={`flex items-center ${labelClassName}`}>
        {btnIcon}
        {label}
      </span>
    </button>
  );
};

export default Button;

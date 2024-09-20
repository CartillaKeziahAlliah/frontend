import React from "react";
import PropTypes from "prop-types";

const Button = ({ label, onClick, type, disabled }) => {
  return (
    <button
      onClick={onClick}
      type={type || "button"}
      disabled={disabled}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
    >
      {label}
    </button>
  );
};

Button.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.string,
  disabled: PropTypes.bool,
};

Button.defaultProps = {
  onClick: () => {},
  type: "button",
  disabled: false,
};

export default Button;

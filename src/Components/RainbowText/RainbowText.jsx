import React from "react";
import "./RainbowText.css";

const RainbowText = ({ children }) => {
  return <span className="rainbow-effect">{children}</span>;
};

export default RainbowText;

import React, { useState } from "react";
import "./style.css";

const Button = ({ string, icon }) => {
  return (
    <div className="button">
      {icon && <img src={icon} alt="Button Icon" />}
      <div className="text-wrapper-3">{string}</div>
    </div>
  );
};

export default Button;
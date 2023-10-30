import React from "react";
import "./style.css";

export const SVGButton = ({ SvgComponent, onClick, active=false, className = '' }) => {
  return (
    <div className={"svg-button-container "+(active?'gold':'')} onClick={onClick}>
      <SvgComponent className={`svg-button ${className}`} />
    </div>
  );
};
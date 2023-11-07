import React from "react";
import { ReactComponent as LogoEK } from '../images/logo.svg';

export const Logo = () => {
  return (
    <div className="logo">
      <div className="logo-container">
        <LogoEK className="easy-knowledge-logo" />
        <div className="logo-text">Easy Knowledge</div>
      </div>
    </div>
  );
};
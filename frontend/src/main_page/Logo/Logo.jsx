import React from "react";
import { ReactComponent as LogoEK } from '../../images/logo.svg';
import './style.css';

export const Logo = () => {
  return (
    <div className="logo-main">
      <div className="logo-container-main">
        <LogoEK className="easy-knowledge-logo-main" />
        <div className="logo-text-main">Easy Knowledge</div>
      </div>
    </div>
  );
};
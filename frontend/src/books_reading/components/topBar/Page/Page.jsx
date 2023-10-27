import React, { useEffect } from "react";
import "./style.css";
import { Button } from "./Button.jsx"
import { Icon } from "./Icons.jsx"

export const Page = ({ bookName, isProps, onProps, isActive, onActivate }) => {

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (!event.target.closest('.dots') && isProps) onProps();
    };

    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [isProps, onProps]);

  return (
    <div className={`page ${isProps ? 'expanded' : ''} ${isActive ? 'active-page' : ''}`} onClick={onActivate}>
      <div className="page-buttons">
        <div className="book-name">{bookName}</div>
        <Icon name="dots" onClick={(e) => { e.stopPropagation(); onProps(); }} src={require("../img/icon-horizontal-ellipsis.png")} />
        <Icon name="cross" onClick={(e) => { e.stopPropagation(); }} src={require("../img/icon-cross.png")} />
      </div>
      <div className="props">
        <Button string="Chapter" />
        <Button string="Share" />
        <Button string="Delete" />
      </div>
    </div>
  );
};
import React, { useState, } from "react";
import { Page } from "./Page/Page.jsx";
import "./style.css";

export const TopBar = ({booksDictionary}) => {
  const [openedProps, setProps] = useState(null);
  const [activePage, setActivePage] = useState(null);

  const openProps = (bookName) => {
    if (openedProps === bookName) setProps(null); else {if (activePage === bookName) setProps(bookName);}
  };

  const activatePage = (bookName) => {
    if(activePage !== bookName) setActivePage(bookName);
  };

  return (
    <div className="top-bar" id='top-bar'>
      {Object.keys(booksDictionary).map(bookName => (
        <Page 
          key={bookName}
          bookName={bookName}
          isProps={openedProps === bookName}
          isActive={activePage === bookName}
          onProps={() => openProps(bookName)}
          onActivate={() => activatePage(bookName)}
        />
      ))}
    </div>
  );
};

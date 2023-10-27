import React, { useState, } from "react";
import { Page } from "./Page/Page.jsx";
import "./style.css";

export const TopBar = ({pagesDictionary}) => {
  const [openedProps, setProps] = useState(null);
  const [activePage, setActivePage] = useState(null);

  const openProps = (bookName) => {
    openedProps === bookName ? setProps(null) : setProps(bookName);
  };

  const activatePage = (bookName) => {
    if(activePage !== bookName) setActivePage(bookName);
  };

  return (
    <div className="top-bar">
      {Object.keys(pagesDictionary).map(bookName => (
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

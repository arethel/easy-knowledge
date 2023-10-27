import React, { useState, } from "react";
import { ReactComponent as AddBookIcon } from './img/add-book.svg';
import "./style.css";

import { Button } from "./Button/Button.jsx";

export const SideBar = ({ booksDictionary }) => {
  const [openedProps, setProps] = useState(null);
  
  const openProps = (bookName) => {
    if (openedProps === bookName) setProps(null); else {setProps(bookName);}
  };
  
  return (
    <div className="side-bar">
      <div className="BG" />
      <Button className={'prev-folder'} buttonText={<div>&lt; Prev folder'</div>} propsBtn={false}/>
      <div className="books">
        {Object.keys(booksDictionary).map(bookName => (
          <Button
            key={bookName}
            className={bookName}
            buttonText={bookName}
            onProps={() => openProps(bookName)}
            isProps={openedProps === bookName} />
        ))}
        
        <AddBookIcon className="add-book" alt="Add book" />
      </div>
      <div className="home-button">
        <div className="text-wrapper-4">Username</div>
        <img className="icon-user" alt="Icon user" src={require("./img/icon-user.png")} />
      </div>
      
    </div>
  );
};

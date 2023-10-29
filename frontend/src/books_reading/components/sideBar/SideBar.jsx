import React, { useState, } from "react";
import { ReactComponent as AddBookIcon } from '../images/add-book.svg';
import { ReactComponent as UserIcon } from '../images/user.svg';
import "./style.css";

import { BookButton } from "./Button/BookButton.jsx";
import { Button } from "../reusableComponents/button/Button.jsx"

export const SideBar = ({ booksDictionary }) => {
  const [openedProps, setProps] = useState(null);
  
  const openProps = (bookName) => {
    if (openedProps === bookName) setProps(null); else {setProps(bookName);}
  };
  
  return (
    <div className="side-bar">
      <div className="BG" />
      <div>
        <BookButton className={'prev-folder'} buttonText={<div>&lt; Prev folder</div>} propsBtn={false}/>
        <div className="books">
          {Object.keys(booksDictionary).map(bookName => (
            <BookButton
              key={bookName}
              className={bookName}
              buttonText={bookName}
              onProps={() => openProps(bookName)}
              isProps={openedProps === bookName} />
          ))}
          <BookButton imgSrc={<AddBookIcon className="add-book" alt="Add book" />} />
        </div>
      </div>
      <div className="user-button">
        <Button string={
          <div className="button-content">
            <UserIcon className='icon-user'/>
            <div className="text-wrapper-4">Username</div>
          </div>
        } />
      </div>
      
    </div>
  );
};

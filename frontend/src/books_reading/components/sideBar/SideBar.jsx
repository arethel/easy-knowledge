import React, { useState, useEffect } from "react";
import { ReactComponent as AddBookIcon } from '../../../images/add-book.svg';
import { ReactComponent as UserIcon } from '../../../images/user.svg';
import "./style.css";

import { BookButton } from "./Button/BookButton.jsx";
import { Dropdown } from '../reusableComponents/dropdown/Dropdown.jsx';

export const SideBar = ({ booksDictionary, setBooksDictionary, settingsSetActive, pagesDictionary, setPagesDictionary }) => {
  const [openedProps, setProps] = useState(null);
  
  const openProps = (bookName) => {
    if (openedProps === bookName) setProps(null); else {setProps(bookName);}
  };
  
  const options = ['Account', 'Settings', 'Log out'];
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelect = (option) => {
    setSelectedOption(option);
    console.log(selectedOption);
    switch (option) {
      case options[0]:
        console.log(options[0]);
        break;
      case options[1]:
        settingsSetActive(true);
        break;
      case options[2]:
        console.log(options[2]);
        break;
      default:
        console.log('Default');
    }
  };
  
  const [booksToHide, setBooksToHide] = useState([]);

  const deleteBook = (bookName) => {
    setBooksToHide((prevBooksToHide) => [...prevBooksToHide, bookName]);
  };

  useEffect(() => {
    const transitionDelay = 300;

    const timeoutIds = booksToHide.map((bookName) => {
      return setTimeout(() => {
        setBooksDictionary((prevBooksDictionary) => {
          const newBooksDictionary = { ...prevBooksDictionary };
          delete newBooksDictionary[bookName];
          return newBooksDictionary;
        });
      }, transitionDelay);
    });

    return () => {
      timeoutIds.forEach((timeoutId) => clearTimeout(timeoutId));
    };
  }, [booksToHide, setBooksDictionary]);
  
  const openBook = (bookName) => {
    const newPagesDictionary = { ...pagesDictionary };
    newPagesDictionary[bookName] = booksDictionary[bookName];
    newPagesDictionary.selected = bookName;
    setPagesDictionary(newPagesDictionary);
  };
  
  return (
    <div className="side-bar">
      <div className="BG" id='side-bar'/>
      <div>
        <BookButton
          className={'prev-folder'}
          buttonText={<div>&lt; Prev folder</div>}
          propsBtn={false}
          onClick={() => { console.log('prev-folder') }}
        />
        <div className="books">
          {Object.keys(booksDictionary).map(bookName => {
            const shouldHide = booksToHide.includes(bookName);
            return <BookButton
              key={bookName}
              className={bookName}
              buttonText={bookName}
              onProps={() => openProps(bookName)}
              onClick={() => { openBook(bookName) }}
              isProps={openedProps === bookName}
              onShare={() => { console.log('Share') }}
              onDelete={() => { deleteBook(bookName) }}
              shouldHide={shouldHide}
            />
          })}
          <BookButton
            imgSrc={<AddBookIcon className="add-book-icon" alt="Add book" />}
            onClick={() => { console.log("add-book") }}
          />
        </div>
      </div>
      <div className="user-button">
        <Dropdown
          options={options}
          onSelect={handleSelect}
          mainText={
            <div className="button-content">
              <UserIcon className='icon-user' />
              <div className="username">Username</div>
            </div>
          }
        />
      </div>
      
    </div>
  );
};

import React, { useState, } from "react";
import { ReactComponent as AddBookIcon } from '../../../images/add-book.svg';
import { ReactComponent as UserIcon } from '../../../images/user.svg';
import "./style.css";

import { BookButton } from "./Button/BookButton.jsx";
import { Dropdown } from '../reusableComponents/dropdown/Dropdown.jsx';

export const SideBar = ({ booksDictionary }) => {
  const [openedProps, setProps] = useState(null);
  
  const openProps = (bookName) => {
    if (openedProps === bookName) setProps(null); else {setProps(bookName);}
  };
  
  const options = ['Option 1', 'Option 2', 'Option 3'];
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelect = (option) => {
    setSelectedOption(option);
    switch (selectedOption) {
      case 'Option 1':
        console.log('Option 1');
        break;
      default:
        console.log('Default');
    }
  };
  
  return (
    <div className="side-bar">
      <div className="BG" id='side-bar'/>
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

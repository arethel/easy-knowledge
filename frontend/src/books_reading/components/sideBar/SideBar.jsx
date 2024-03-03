import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ReactComponent as AddBookIcon } from '../../../images/add-book.svg';
import { ReactComponent as UserIcon } from '../../../images/user.svg';
import getBook from '../../../utils/utils.js'
import "./style.css";

import { BookButton } from "./Button/BookButton.jsx";
import { Dropdown } from '../reusableComponents/dropdown/Dropdown.jsx';
import { fetchLogout } from "../../../utils/authUtils.js";

export const SideBar = ({
  booksDictionary,
  setBooksDictionary,
  settingsSetActive,
  pagesDictionary,
  setPagesDictionary,
  setTestsPanel,
  setHighlightsPanel,
  setBook_id,
  sectionName,
  setUpdateInfo,
  updateInfo,
  client,
  loadedEpubs,
  setLoadedEpubs,
  setSectionName,
  userData
}) => {
  const [openedProps, setProps] = useState(null);
  
  const openProps = (bookName) => {
    if (openedProps === bookName) setProps(null); else {setProps(bookName);}
  };
  
  const options = ['Settings', 'Log out'];
  const [selectedOption, setSelectedOption] = useState(null);

  const [hidden, setHidden] = useState(false);
  
  const navigate = useNavigate();

  const handleSelect = (option) => {
    setSelectedOption(option);
    console.log(selectedOption);
    switch (option) {
      case options[0]:
        settingsSetActive(true);
        break;
      case options[1]:
        console.log(options[2]);
        fetchLogout(client, navigate);
        break;
      default:
        console.log('Default');
    }
  };
  
  const [booksToHide, setBooksToHide] = useState([]);

  const deleteBook = (bookName) => {
    setBooksToHide((prevBooksToHide) => [...prevBooksToHide, {sectionId:sectionName.id, bookId:bookName}]);
  };

  useEffect(() => {
    const transitionDelay = 300;

    const timeoutIds = booksToHide.map((bookToDelData) => {
      const { sectionId, bookId } = bookToDelData;
      return setTimeout(() => {
        setBooksDictionary((prevBooksDictionary) => {
          const newBooksDictionary = { ...prevBooksDictionary };
          delete newBooksDictionary[sectionId][bookId];
          return newBooksDictionary;
        });
      }, transitionDelay);
    });

    return () => {
      timeoutIds.forEach((timeoutId) => clearTimeout(timeoutId));
    };
  }, [booksToHide, setBooksDictionary]);
  
  const openSection = async (section_id) => {
    setSectionName({ id: section_id, name: booksDictionary[section_id].section_name });
    // const response = await client.post("api/opened-books/open-section/", { 'section_id': section_id });
    // if (response.data.error === 0)
    //   setUpdateInfo(!updateInfo);
  }
  
  const changeBookApi = async (book_id) => {
    if (book_id == -1) return;
    const response = await client.post("api/opened-books/change/", { 'book_id': book_id });
    // if (response.data.error === 0) {
    //   setUpdateInfo(!updateInfo);
    // }
    return response;
  }
  
  const openBookApi = async (book_id) => {
    const response = await client.post("api/opened-books/", { 'book_id': book_id });
    if (response.data.error === 0) {
      setUpdateInfo(!updateInfo);
    }
    return response;
  }
    
  const openBook = (bookId) => {
    if (sectionName.id == -1) {
      openSection(bookId)
    }
    else {
      const newPagesDictionary = { ...pagesDictionary };
      newPagesDictionary[bookId] = booksDictionary[sectionName.id].books[bookId];
      newPagesDictionary[bookId].open_time = new Date().getTime()/1000;
      newPagesDictionary.selected = { id: bookId };
      setPagesDictionary(newPagesDictionary);
      
      if (pagesDictionary[bookId] !== undefined){
        if (pagesDictionary.selected!== undefined && pagesDictionary.selected.id != bookId) {
          changeBookApi(bookId).then((response) => {
            setBook_id(bookId);
            if (response.data.error === 0 && loadedEpubs[bookId] === undefined) {
              getBook(bookId, client, loadedEpubs, setLoadedEpubs)
            }
          });
        }
      }
      else {
        openBookApi(bookId).then((response) => {
          if (response.data.error === 0) {
            setBook_id(bookId);
            getBook(bookId, client, loadedEpubs, setLoadedEpubs)
          }
        });
        
      }
    }
  };
  
  const openTests = (book_id) => {
    setBook_id(book_id);
    setTestsPanel(true);
  }
  
  const leaveSection = async () => {
    setSectionName({ id: -1, name: 'Main' });
    // const response = await client.post("api/opened-books/leave-section/", { section_id: sectionName.id });
    // console.log(response);
    // if (response.data.error === 0)
    //   setUpdateInfo(!updateInfo);
  }
  
  const onPrevFolderClick = () => {
    if (sectionName.id !== -1){
      leaveSection();
    }
    else {
      navigate('/main');
    }
  }
  
  const createSection = async () => {
    const response = await client.post("api/opened-books/leave-section/", { section_id: sectionName.id });
    // console.log(response);
    if (response.data.error === 0)
      setUpdateInfo(!updateInfo);
  }
  
  const addBookSection = () => {
    if (sectionName.id === -1) {
      createSection()
    }
    else {
      console.log('add book');
    }
  }
  
  const toggleHidden = () => {
    setHidden(!hidden);
  }
  
  return (
    <div className={`side-bar ${hidden?'hidden_':''}`}>
      <div className="BG" id='side-bar' />
      <div className="hide-button" onClick={toggleHidden}>{hidden ? <>&#62;</> : <>&#60;</>}</div>
      <div className="content-container">
        <div>
          
          <BookButton
            className={'prev-folder'}
            buttonText={
              sectionName.id === -1 ?
              <div>{sectionName.name}</div>
              :
                <div>&lt; {sectionName.name}</div>
            }
            propsBtn={false}
            onClick={onPrevFolderClick}
          />
          <div className="books">
            {Object.keys(sectionName.id!==-1?booksDictionary[sectionName.id].books:booksDictionary).map(bookName => {
              const shouldHide = booksToHide.includes(bookName);
              return <BookButton
                key={bookName}
                className={bookName}
                buttonText={
                  sectionName.id === -1 ?
                    booksDictionary[bookName].section_name
                  :
                    booksDictionary[sectionName.id].books[bookName].title
                }
                propsBtn={
                  sectionName.id !== -1 && booksDictionary[sectionName.id].books[bookName].processed === true
                }
                onProps={() => openProps(bookName)}
                onClick={() => { openBook(bookName) }}
                isProps={openedProps === bookName}
                onShare={() => { console.log('Share') }}
                onDelete={() => { deleteBook(bookName) }}
                shouldHide={shouldHide}
                onTests={(e) => openTests(bookName)}
                onHighlights={(e) => setHighlightsPanel(true)}
                work={sectionName.id === -1 || booksDictionary[sectionName.id].books[bookName].processed === true}
              />
            })}
            {/* <BookButton
              imgSrc={<AddBookIcon className="add-book-icon" alt="Add book" />}
              onClick={() => { console.log("add-book") }}
            /> */}
          </div>
        </div>
        <div className="user-button">
          <Dropdown
            options={options}
            onSelect={handleSelect}
            mainText={
              <div className="button-content">
                <UserIcon className='icon-user' />
                <div className="username">{ userData.username }</div>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

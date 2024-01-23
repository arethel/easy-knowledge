import React, { useState, useEffect, useCallback} from "react";
import { Page } from "./Page/Page.jsx";
import Button from '@mui/material/Button';
import getBook from '../../../utils/utils.js'
import "./style.css";
import {CloseSideBarIcon, OpenSideBarIcon} from "../../../svg";
import Tooltip from "../../../chat/components/Tooltip";

export const TopBar = ({
  booksDictionary,
  setBooksDictionary,
  setTestsPanel,
  setBook_id,
  client,
  setUpdateInfo,
  updateInfo,
  loadedEpubs,
  setLoadedEpubs,
  isSidebarOpen,
  toggleSidebar
}) => {
  
  const [openedProps, setProps] = useState(null);
  const [activePage, setActivePage] = useState(null);

  const openProps = (bookName) => {
    if (openedProps == bookName) setProps(null); else {if (activePage == bookName) setProps(bookName);}
  };

  const changeBookApi = useCallback(async (book_id) => {
    if (book_id == -1) return null;
    const response = await client.post("api/opened-books/change/", { 'book_id': book_id });
    // if (response.data.error === 0) {
    //   setUpdateInfo(!updateInfo);
    // }
    return response;
  }, [client]);
  
  const activatePage = useCallback((bookName, nBooksDict=null) => {
    if (activePage != bookName) {
      setActivePage(bookName);
      changeBookApi(bookName).then((response) => {
        if (response !== null && response.data.error === 0 && loadedEpubs[bookName] === undefined) {
          setBook_id(bookName);
          getBook(bookName, client, loadedEpubs, setLoadedEpubs)
        }
      });
      let booksDictionaryCopy = {};
      if (nBooksDict)
        booksDictionaryCopy = { ...nBooksDict };
      else{
        booksDictionaryCopy = { ...booksDictionary };
      }
      booksDictionaryCopy.selected = {id:bookName};
      setBooksDictionary(booksDictionaryCopy);
    }
  },[changeBookApi, setActivePage, activePage, booksDictionary, setBooksDictionary]);
  
  useEffect(() => {
    if (booksDictionary.selected.id !== undefined){
      activatePage(booksDictionary.selected.id);
    }
  }, [activatePage, booksDictionary]);
  
  const [pagesToHide, setPagesToHide] = useState([]);
  
  const closePageApi = async (bookName) => {
    const response = await client.post("api/opened-books/close/", { book_id: bookName });
    // if (response.data.error === 0) {
    //   setUpdateInfo(!updateInfo);
    // }
  }
  
  const closePage = (bookName) => {
    setPagesToHide((prevPagesToHide) => [...prevPagesToHide, bookName]);
    closePageApi(bookName);
  };
  
  useEffect(() => {
    const transitionDelay = 300;
  
    const timeoutIds = pagesToHide.map((bookName) => {
      return setTimeout(() => {
        const newBooksDictionary = { ...booksDictionary };
        delete newBooksDictionary[bookName];
        setBooksDictionary(newBooksDictionary);
        
        if (activePage == bookName) {
          const remainingPages = Object.keys(booksDictionary).filter(
            (name) => name !== 'selected'
          );
          const currentIndex = remainingPages.indexOf(bookName);
          if (currentIndex > 0) {
            activatePage(remainingPages[currentIndex - 1], newBooksDictionary);
          } else if (remainingPages.length > 0) {
            activatePage(remainingPages[0], newBooksDictionary);
          }
        }
        setPagesToHide((prevPagesToHide) => prevPagesToHide.filter((name) => name !== bookName));
      }, transitionDelay);
    });
    
    
    return () => {
      timeoutIds.forEach((timeoutId) => clearTimeout(timeoutId));
    };
  }, [pagesToHide, setBooksDictionary, activatePage, activePage, booksDictionary]);
  
  const openTests = (book_id) => {
    setBook_id(book_id);
    setTestsPanel(true);
  }
  
  return (
    <div className="top-bar" id='top-bar'>
      <Tooltip title={'close-sidebar'} side="down" sideOffset={10}>
          <a
            className="flex px-3 min-h-[44px] py-1 gap-3 transition-colors duration-200 dark:text-white cursor-pointer text-sm rounded-md border dark:border-white/20 hover:bg-gray-500/10 h-11 w-11 flex-shrink-0 items-center justify-center bg-white dark:bg-transparent"
            onClick={toggleSidebar}>
            {isSidebarOpen ? <CloseSideBarIcon></CloseSideBarIcon> : <OpenSideBarIcon></OpenSideBarIcon>}
          </a>
      </Tooltip>
      {Object.keys(booksDictionary).map(bookName => {
        if (bookName === 'selected') return null;
        const shouldHide = pagesToHide.includes(bookName);
        return <Page 
          key={bookName}
          bookName={booksDictionary[bookName].title}
          isProps={openedProps == bookName}
          isActive={activePage == bookName}
          onProps={() => openProps(bookName)}
          onActivate={() => activatePage(bookName)}
          onClose={() => { closePage(bookName) }}
          shouldHide={shouldHide}
          onTests={(e) => openTests(bookName)}
        />
        
      })}
    </div>
  );
};

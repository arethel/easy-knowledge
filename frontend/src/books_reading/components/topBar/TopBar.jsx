import React, { useState, useEffect, useCallback} from "react";
import { Page } from "./Page/Page.jsx";
import "./style.css";

export const TopBar = ({ booksDictionary, setBooksDictionary, setTestsPanel, setBook_id}) => {
  
  const [openedProps, setProps] = useState(null);
  const [activePage, setActivePage] = useState(null);

  const openProps = (bookName) => {
    if (openedProps === bookName) setProps(null); else {if (activePage === bookName) setProps(bookName);}
  };

  const activatePage = useCallback((bookName, nBooksDict=null) => {
    if (activePage !== bookName) {
      setActivePage(bookName);
      let booksDictionaryCopy = {};
      if (nBooksDict)
        booksDictionaryCopy = { ...nBooksDict };
      else{
        booksDictionaryCopy = { ...booksDictionary };
      }
      booksDictionaryCopy.selected = bookName;
      setBooksDictionary(booksDictionaryCopy);
    }
  },[setActivePage, activePage, booksDictionary, setBooksDictionary]);
  
  useEffect(() => {
    activatePage(booksDictionary.selected);
  }, [activatePage, booksDictionary]);
  
  const [pagesToHide, setPagesToHide] = useState([]);

  const closePage = (bookName) => {
    setPagesToHide((prevPagesToHide) => [...prevPagesToHide, bookName]);
  };
  
  useEffect(() => {
    const transitionDelay = 300;
  
    const timeoutIds = pagesToHide.map((bookName) => {
      return setTimeout(() => {
        const newBooksDictionary = { ...booksDictionary };
        delete newBooksDictionary[bookName];
        setBooksDictionary(newBooksDictionary);
        
        if (activePage === bookName) {
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
      {Object.keys(booksDictionary).map(bookName => {
        if (bookName === 'selected') return null;
        const shouldHide = pagesToHide.includes(bookName);
        return <Page 
          key={bookName}
          bookName={booksDictionary[bookName].title}
          isProps={openedProps === bookName}
          isActive={activePage === bookName}
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

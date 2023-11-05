import React, { useState } from "react";

import { TopBar } from "./components/topBar/TopBar.jsx";
import { SideBar } from "./components/sideBar/SideBar.jsx";
import { Logo } from "./components/logo/Logo.jsx";
import { Book } from "./components/currentBook/Book.jsx";
import { Settings } from "./components/settings/Settings.jsx";

import "./style.css";

const booksDictionary = {
    Book1: 'Book1 Title',
    Book2: 'Book2 Title',
    Book3: 'Book3 Title',
    Book4: 'Book4 Title',
  };

export const BooksReading = () => {
  
    const [active, setActive] = useState(false);
  
    return (
      <div className="book-page-container">
        <SideBar booksDictionary={booksDictionary} settingsSetActive={ setActive }/>
        <div className="main-container">
          <TopBar booksDictionary={booksDictionary} />
          <div className="book-area">
            <Logo />
            <Book />
          </div>
        </div>
        <Settings active={active} setActive={ setActive } />
        <div className="bg"></div>
      </div>
      );
}

import React from "react";

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
    return (
      <div className="book-page-container">
        <SideBar booksDictionary={booksDictionary} />
        <div className="main-container">
          <TopBar booksDictionary={booksDictionary} />
          <div className="book-area">
            <Logo />
            <Book />
          </div>
        </div>
        <Settings />
        <div className="bg"></div>
      </div>
      );
}

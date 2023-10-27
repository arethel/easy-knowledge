import React from "react";

import { TopBar } from "./components/topBar/TopBar.jsx";
import { SideBar } from "./components/sideBar/SideBar.jsx";

import "./style.css";

const booksDictionary = {
    Book1: 'Book1 Title',
    Book2: 'Book2 Title',
    Book3: 'Book3 Title',
    Book4: 'Book4 Title',
  };

export const BooksReading = () => {
    return (
      <div className="bg">
          <SideBar booksDictionary={booksDictionary} />
          <TopBar booksDictionary={booksDictionary} />
            
        </div>
      );
}

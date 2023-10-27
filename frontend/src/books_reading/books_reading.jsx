import React from "react";
import ReactDOMClient from "react-dom/client";

import { TopBar } from "./components/topBar/TopBar.jsx";
import { SideBar } from "./components/sideBar/SideBar.jsx";

const pagesDictionary = {
    Page1: 'Page1 Title',
    Page2: 'Page2 Title',
    Page3: 'Page3 Title',
    Page4: 'Page4 Title',
    // ... add more pages as needed
  };

export const BooksReading = () => {
    return (
        <div>
            <TopBar pagesDictionary={pagesDictionary} />
            {/* <SideBar /> */}
        </div>
      );
}

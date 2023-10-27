import React from "react";
import ReactDOMClient from "react-dom/client";
import { TopBar } from "./components/topBar/TopBar.jsx";
import { SideBar } from "./components/sideBar/SideBar.jsx";

const app = document.getElementById("app");
const root = ReactDOMClient.createRoot(app);

const pagesDictionary = {
    Page1: 'Page1 Title',
    Page2: 'Page2 Title',
    Page3: 'Page3 Title',
    Page4: 'Page4 Title',
    // ... add more pages as needed
  };

root.render(<TopBar pagesDictionary={pagesDictionary} />);
// root.render(<SideBar />);

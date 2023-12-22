import React from "react";
import ReactDOMClient from "react-dom/client";
import axios from "axios";
import { BooksReading } from "./books_reading/books_reading.jsx";
// import { SignIn } from "./sign_in/SignIn.jsx";
// import { MainPage } from "./main_page/MainPage.jsx";

const app = document.getElementById("app");
const root = ReactDOMClient.createRoot(app);

root.render(<BooksReading />);
// root.render(<MainPage />);
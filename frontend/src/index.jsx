import React from "react";
import ReactDOMClient from "react-dom/client";
import { BooksReading } from "./books_reading/books_reading.jsx";

const app = document.getElementById("app");
const root = ReactDOMClient.createRoot(app);

root.render(<BooksReading />);
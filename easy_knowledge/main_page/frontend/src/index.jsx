import React from "react";
import ReactDOMClient from "react-dom/client";
import { Page } from "./components/Page/Page.jsx";

const app = document.getElementById("app");
const root = ReactDOMClient.createRoot(app);
root.render(<Page />);

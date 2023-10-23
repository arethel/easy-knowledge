import React from "react";
import ReactDOMClient from "react-dom/client";
import { Page } from "./components/topBar/Page";

const app = document.getElementById("app");
const root = ReactDOMClient.createRoot(app);
root.render(<Page />);

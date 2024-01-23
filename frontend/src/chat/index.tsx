import React from 'react';
import ReactDOM from 'react-dom/client';
import './tailwind.css';
import './globalStyles.css';
import {ThemeProvider} from "./context/ThemeContext";
import 'react-toastify/dist/ReactToastify.css';
import App from "./App";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <ThemeProvider>
            <App/>
        </ThemeProvider>
    </React.StrictMode>
);

import React, { useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import './App.css';
import MainPage from "./components/MainPage";

const App = () => {
    return (
      <I18nextProvider i18n={i18n}>
        <div className="overflow-hidden w-full h-full relative flex z-0">
            <div style={{ width: '50%', margin: "0 auto", border: "1px solid black" }}>
                <MainPage />
            </div>
        </div>
      </I18nextProvider>
    );
}

export default App;

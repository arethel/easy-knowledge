import React, { useState, useEffect } from "react";
import { ReactComponent as AddBookIcon } from '../../images/add-book.svg';
import { useTranslation } from "react-i18next";

import { AlertDialog } from '../AlertDialog.jsx';

import "./style.css";

export const CreateSection = ({createSection}) => {
    
    return (
        <div className="custom-container">
            <div className="custom-rectangle-create-section" onClick={createSection}>
                <AddBookIcon className="section-icon" alt="Create section"/>
            </div>
        </div>
    );
}
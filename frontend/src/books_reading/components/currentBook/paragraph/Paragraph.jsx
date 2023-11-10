import React from "react";
import { ParagraphProps } from "../paragraphProps/ParagraphProps.jsx";

import "./style.css";

export const Paragraph = ({mainText, text}) => {
    return (
        <div className="book-element paragraph">
            <div className="main-text">{mainText}</div>
            <p className="paragraph-text">{text}</p>
            <div className="paragraph-props-container">
                <ParagraphProps />
            </div>
            <div className="element-bg paragraph-bg" />
        </div>
    );
    
}
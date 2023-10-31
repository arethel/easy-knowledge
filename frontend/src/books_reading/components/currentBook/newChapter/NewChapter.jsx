import React from "react";
import "./style.css";

export const NewChapter = ({text}) => {
    
    return (
        <div className="book-element new-chapter">
            <div className="new-chapter-text">{text}</div>
            <div className="element-bg new-chapter-bg"/>
        </div>
    )
}
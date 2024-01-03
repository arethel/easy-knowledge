import React from "react";
import "./style.css";


export const Button = ({onClick, string, boxClasses = '', stringClasses = ''}) => {
    
    const handleClick = (e) => {
        e.stopPropagation();
        if (onClick) {
          onClick(e);
        }
      };
    
    return (
        <div className={'overlap-group ' + boxClasses} onClick={handleClick}>
            <div className={"button-text "+stringClasses}>{string}</div>
        </div>
    )
}
import React from "react";
import "./style.css";


export const Button = (props) => {
    
    const handleClick = (e) => {
        e.stopPropagation();
        if (props.onClick) {
          props.onClick(e);
        }
      };
    
    return (
        <div className='overlap-group' onClick={handleClick}>
            <div className="button-text">{props.string}</div>
        </div>
    )
}
import React from "react";
import "./style.css";


export const Icon = (props) => {
    
    const handleClick = (event) => {
      if (props.onClick) {
        props.onClick(event);
      }
    };
    
    return (
      <div className={'under-icon-circle ' + props.name + ' ' + props.className} onClick={handleClick}>
        {props.src}
      </div>
    )
}
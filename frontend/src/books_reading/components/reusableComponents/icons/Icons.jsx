import React from "react";
import "./style.css";


export const Icon = (props) => {
    
    const handleClick = (event) => {
      if (props.onClick) {
        props.onClick(event);
      }
    };
    
    return (
        <div className={'under-icon-circle '+props.name+' '+props.className} onClick={handleClick}>
            <img className={"icon "+props.name} alt={"Icon "+props.name} src={props.src} draggable="false"/>
        </div>
    )
}
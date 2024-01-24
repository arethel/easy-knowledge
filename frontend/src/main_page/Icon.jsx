import React from "react";

export const Icon = (props) => {
    
  const handleClick = (event) => {
    if (props.onClick) {
      props.onClick(event);
    }
  };
  
  return (
    <div className={props.name} onClick={handleClick}>
      <img className={"icon "+props.name} alt={"Icon "+props.name} src={props.src} />
    </div>
  )
}
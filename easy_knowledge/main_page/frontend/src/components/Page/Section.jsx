import React from "react";
import { Book } from "./Book";

export const Section = ({booksDictionary}) => {
  return (
    <div className="custom-container">
      <div className="custom-text">{props.text}</div>
      <div className="custom-rectangle">
        {Object.keys(booksDictionary).map(bookName => (
            <Book 
            key={bookName}
            bookName={bookName}
            isProps={openedProps === bookName}
            onProps={() => openProps(bookName)}
            onActivate={() => activatePage(bookName)}
            />
        ))}
      </div>
    </div>
  );
};
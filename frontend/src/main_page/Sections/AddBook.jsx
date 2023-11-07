import React from "react";
import "./style.css";

export const AddBook = ({ onClick }) => {
    return (
      <div className="vertical-container add-book" onClick={onClick}>
        <div className="vertical-rectangle">
          <img className="book-cover plus-image" src={require("../../images/plus_image.png")} alt={"text"} />
        </div>
      </div>
    );
};
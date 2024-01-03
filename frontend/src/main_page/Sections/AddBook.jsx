import React from "react";
import { ReactComponent as AddBookIcon } from '../../images/add-book.svg';
import "./style.css";

export const AddBook = ({ onClick }) => {
    return (
      <div className="vertical-container add-book" onClick={onClick}>
        <div className="vertical-rectangle">
          {/* <img className="book-cover plus-image" src={require("../../images/plus_image.png")} alt={"text"} /> */}
          <AddBookIcon className="plus-icon" alt="Add book"/>
        </div>
      </div>
    );
};
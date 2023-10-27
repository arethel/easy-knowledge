import React from "react";
import { ReactComponent as AddBookIcon } from './img/add-book.svg';
import "./style.css";

export const SideBar = () => {
  return (
    <div className="side-bar">
      <div className="overlap-group">
        <div className="BG" />
        <div className="books">
          <div className="book">
            <div className="text-wrapper">Book1</div>
          </div>
          <div className="div-wrapper">
            <div className="div">Book2</div>
          </div>
          <div className="book-2">
            <div className="text-wrapper-2">Book3</div>
          </div>
          <div className="book-3">
            <div className="div">Book4</div>
          </div>
          <div className="book-4">
            <div className="text-wrapper-3">Book5</div>
            <img className="icon-horizontal" alt="Icon horizontal" src={require("./img/icon-horizontal-ellipsis.png")} />
          </div>
          <AddBookIcon className="add-book" alt="Add book" />
        </div>
        <div className="home-button">
          <div className="text-wrapper-4">Username</div>
          <img className="icon-user" alt="Icon user" src={require("./img/icon-user.png")} />
        </div>
        <div className="prev-folder">
          <div className="prev-folder-2">&lt; Prev folder</div>
        </div>
      </div>
    </div>
  );
};

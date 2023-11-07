import React, { useState } from "react";
import { Book } from "./Book";
import { AddBook } from "./AddBook";
import { EditableText } from "./EditableText";
import { Icon } from "../Icon";
import "./style.css";

const VerticalLine = () => {
    return <div className="vertical-line"></div>;
};

export const Section = ({ booksList, text, sectionId, handleDeleteSection}) => {
  const [books, setBooks] = useState(booksList);
  const [idCounter, setIdCounter] = useState(booksList.length);

  const removeBook = (bookId) => {
      const updatedBooks = books.filter(book => book.id !== bookId);
      setBooks(updatedBooks);
  };

  const addNewBook = () => {
    const newBook = {
        id: idCounter + 1,
        name: "New Book",
    };
    setIdCounter(prevCounter => prevCounter + 1);
    setBooks(prevBooks => [...prevBooks, newBook]);
  };

  const handleDelete = () => {
    const isConfirmed = window.confirm(`Are you sure you want to delete ${text}?`);
    if (isConfirmed) {
      handleDeleteSection(sectionId);
    }
  };

  return (
    <div className="custom-container">
      <div className="section-header">
        <EditableText initialText={text} />
        <span className="trashbin-icon" onClick={handleDelete}>
          <Icon name="trashbin" src={require("../../images/icon-trashbin.png")}/>
        </span>
      </div>
      <div className="custom-rectangle">
        {books.map((book, index) => (
          <React.Fragment key={book.id}>
            <Book
              key={book.id}
              book={book}
              removeBook={removeBook}
            />
            <VerticalLine />
            {/* {index !== books.length - 1 && <VerticalLine />} */}
          </React.Fragment>
        ))}
        <AddBook onClick={addNewBook}/>
      </div>
    </div>
  );
};
import React, { useState } from "react";
import { Book } from "./Book";
import { AddBook } from "./AddBook";
import { EditableText } from "./EditableText";
import { Icon } from "../Icon";
import DeleteIcon from '@mui/icons-material/Delete';

import "./style.css";

const VerticalLine = () => {
    return <div className="vertical-line"></div>;
};

export const Section = ({ booksList, name, sectionId, handleDeleteSection, setType, client }) => {
  const [books, setBooks] = useState(booksList);
  console.log(books);
  const [idCounter, setIdCounter] = useState(books.length);

  const removeBook = (bookId) => {
      const updatedBooks = books.filter(book => book.id !== bookId);
      setBooks(updatedBooks);
  };

  const addNewBook = (file) => {
    console.log(file);
    const newBook = {
        id: idCounter + 1,
        title: file.name.replace(/\.[^/.]+$/, ""),
    };
    setIdCounter(prevCounter => prevCounter + 1);
    setBooks(prevBooks => [...prevBooks, newBook]);
  };

  const moveBookInsideSection = (sourceIndex, destinationIndex) => {
    const updatedBooks = [...books];
    const [movedBook] = updatedBooks.splice(sourceIndex, 1);
    updatedBooks.splice(destinationIndex, 0, movedBook);

    setBooks(updatedBooks);
  };

  const handleDelete = () => {
    setType('deleteSection');
    handleDeleteSection(sectionId, name);
  };

  return (
    <div className="custom-container">
      <div className="section-header">
        <EditableText initialText={name} />
        <span className="trashbin-icon section-icon">
          {/* <Icon name="trashbin" src={require("../../images/icon-trashbin.png")}/> */}
          <DeleteIcon style={{ cursor: 'pointer' }} onClick={handleDelete}/>
        </span>
      </div>
      <div className="custom-rectangle">
        {books.map((book, index) => (
          <React.Fragment key={book.id}>
            <Book
              key={book.id}
              book={book}
              removeBook={removeBook}
              sectionId={sectionId}
              index={index}
              moveBookInsideSection={moveBookInsideSection}
              client={client}
            />
            <VerticalLine />
            {/* {index !== books.length - 1 && <VerticalLine />} */}
          </React.Fragment>
        ))}
        <AddBook onFileSelect={addNewBook} client={client} sectionId={sectionId}/>
      </div>
    </div>
  );
};
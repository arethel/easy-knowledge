import React, { useState, useEffect } from "react";
import { Book } from "./Book";
import { AddBook } from "./AddBook";
import { EditableText } from "./EditableText";
import { Icon } from "../Icon";
import DeleteIcon from '@mui/icons-material/Delete';
import Skeleton from '@mui/material/Skeleton';
import { MyCircularProgress } from './MyCircularProgress';

import "./style.css";

const VerticalLine = () => {
    return <div className="vertical-line"></div>;
};

export const Section = ({ booksList, name, sectionId, handleDeleteSection, setType, client }) => {
  const [books, setBooks] = useState(booksList);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const removeBook = (bookId) => {
    const updatedBooks = books.filter(book => book.id !== bookId);
    setBooks(updatedBooks);
  };

  const addNewBook = (file, newId) => {
    //setLoading(false);
    console.log(file);
    // const newBook = {
    //     id: newId,
    //     title: file.name.replace(/\.[^/.]+$/, ""),
    // };
    // setBooks(prevBooks => [...prevBooks, newBook]);

    const interval = setInterval(async () => {
      try {
        const response = await client.post('api/processed-books/', {"book_id": newId});
        setProgress(response.data.progress);
        //console.log(response)
        if (response.data.progress === 100) {
          const newBook = {
            id: newId,
            title: file.name.replace(/\.[^/.]+$/, ""),
            is_processed:true
          };
          setBooks(prevBooks => [...prevBooks, newBook]);
          clearInterval(interval);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error getting progress from API', error);
        clearInterval(interval);
        setLoading(false);
      }
    }, 5000);
  };

  const handleSectionNameChange = async (newName) => {
    try {
      const response = await client.post('api/section/change-section/', {
        section_id: sectionId,
        section_name: newName,
      });

      if (response.status === 200) {
        // Handle the successful update
      } else {
        console.error('Failed to update section name');
        alert('Failed to update section name');
      }
    } catch (error) {
      console.error('Error during the API call', error);
      alert('Error during the API call');
    }
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
        <EditableText initialText={name} sectionId={sectionId} onTextChange={handleSectionNameChange} />
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
            </React.Fragment>
          ))}
        {loading && (
          <React.Fragment>
            <div className="vertical-container add-book loading">
              <div className="vertical-rectangle">
                <MyCircularProgress progress={progress} determinate={true}/>
              </div>
            </div>
            <VerticalLine />
          </React.Fragment>
          //<Skeleton variant="rectangular" height={200} width={200} />
        )}
        <AddBook onFileSelect={addNewBook} client={client} sectionId={sectionId} setLoading={setLoading} />
      </div>
    </div>
  );
};
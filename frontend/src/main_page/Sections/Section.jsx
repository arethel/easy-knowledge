import React, { useState, useEffect } from "react";
import { Book } from "./Book";
import { AddBook } from "./AddBook";
import { EditableText } from "./EditableText";
import DeleteIcon from '@mui/icons-material/Delete';
import { MyCircularProgress } from './MyCircularProgress';
import { useTranslation } from "react-i18next";
import useWebSocket, { ReadyState } from "react-use-websocket"

import { AlertDialog } from '../AlertDialog.jsx';

import "./style.css";

const VerticalLine = () => {
    return <div className="vertical-line"></div>;
};

export const Section = ({ booksList, name, sectionId, handleDeleteSection, setType, client, globalLoading, setGlobalLoading }) => {
  const [books, setBooks] = useState(booksList);
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [bookActionConfirmation, setBookActionConfirmation] = useState({
    id: null,
    name: null,
  });
  const { t } = useTranslation();

  const removeBook = (bookId) => {
    const updatedBooks = books.filter(book => book.id !== bookId);
    setBooks(updatedBooks);
  };

  const addNewBook = (file, newId, cover_image) => {
    console.log(file);
    const newBook = {
      id: newId,
      title: file.name.replace(/\.[^/.]+$/, ""),
      is_processed: true,
      cover_image: cover_image,
      index: books.length,
    };
    setBooks(prevBooks => [...prevBooks, newBook]);  
    setGlobalLoading(prev => Math.max(prev - 1, 0));
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

  const moveBookInsideSection = async (sourceIndex, destinationIndex) => {
    try {
      const response = await client.post('api/book/change-index/', { section_id: sectionId, source_index: sourceIndex, destination_index: destinationIndex });

      if (response.status === 200) {
        console.log(sourceIndex, destinationIndex)
        const updatedBooks = [...books];

        [updatedBooks[sourceIndex], updatedBooks[destinationIndex]] = [updatedBooks[destinationIndex], updatedBooks[sourceIndex],];
        [updatedBooks[sourceIndex].index, updatedBooks[destinationIndex].index] = [updatedBooks[destinationIndex].index, updatedBooks[sourceIndex].index,];

        console.log('swap', updatedBooks);

        setBooks(updatedBooks);
      } else {
        console.error('Failed to move the book');
        alert('Failed to move the book');
      }
    } catch (error) {
      console.error('Error during the API call', error);
      alert('Error during the API call');
    }
  };

  const handleDelete = () => {
    handleDeleteSection(sectionId, name);
  };

  const handleBookActionConfirmation = (id, name) => {
    setBookActionConfirmation({ id, name });
    setAlertOpen(true);
  };

  const handleClose = async (confirmed) => {
    setAlertOpen(false);
    const { id, name } = bookActionConfirmation;

    if (confirmed) {
      try {
        const response = await client.post('api/book/delete/', { book_id: id });
        
        if (response.status === 200) {
          removeBook(id);
        } else {
          console.error('Failed to delete the book');
          alert('Failed to delete the book');
        }
      } catch (error) {
        console.error('Error during the API call', error);
        alert('Error during the API call');
      }
    }
    setBookActionConfirmation({ id: null, name: name });
  };

  return (
    <div className="custom-container">
      <AlertDialog open={alertOpen} handleClose={handleClose} actionConfirmation={bookActionConfirmation} type={'Book'} t={t}/>
      <div className="section-header">
        <EditableText initialText={name} sectionId={sectionId} onTextChange={handleSectionNameChange} />
        <span className="trashbin-icon">
          <div className="section-icon">
            <DeleteIcon style={{ color: 'var(--collection-1-grey)', cursor: 'pointer' }} onClick={handleDelete}/>
          </div>
        </span>
      </div>
      <div className="custom-rectangle">
        {books.map((book) => (
            <React.Fragment key={book.id}>
              <Book
                key={book.id}
                book={book}
                sectionId={sectionId}
                index={book.index}
                moveBookInsideSection={moveBookInsideSection}
                handleDeleteBook={handleBookActionConfirmation}
                client={client}
              />
              <VerticalLine />
            </React.Fragment>
          ))}
        {
          (loading && (
            <React.Fragment>
              <div className="vertical-container add-book loading">
                <div className="vertical-rectangle">
                  <MyCircularProgress determinate={false} />
                  <div className="estimated-time">
                    {t('loading')}
                  </div>
                </div>
              </div>
              <VerticalLine />
            </React.Fragment>
          ))
        }
        <AddBook
          onFileSelect={addNewBook}
          client={client}
          sectionId={sectionId}
          globalLoading={globalLoading}
          setGlobalLoading={setGlobalLoading}
          setLoading={setLoading}
        />
      </div>
    </div>
  );
};
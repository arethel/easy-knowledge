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

export const Section = ({ booksList, name, sectionId, handleDeleteSection, setType, client, globalLoading, setGlobalLoading }) => {
  const [books, setBooks] = useState(booksList);
  const [progress, setProgress] = useState([]);
  const [booksToAdd, setBooksToAdd] = useState([]);

  const removeBook = (bookId) => {
    const updatedBooks = books.filter(book => book.id !== bookId);
    setBooks(updatedBooks);
  };

  const addNewBook = (file, newId, cover_image) => {
    // console.log(file);
    // const bookToAdd = {
    //   title: file.name.replace(/\.[^/.]+$/, ""),
    //   newId: newId,
    //   cover_image: cover_image
    // };
    // setBooksToAdd(prev => [...prev, bookToAdd]);
    const progressSocket = new WebSocket('ws://localhost:3030/ws/book-processing-info/');

    progressSocket.onmessage = function(e) {
      const d = JSON.parse(e.data);
      console.log(d)
      const newProgress = d.filter(item => item.processed === false && item.book_section.section_id === sectionId);
      setProgress(newProgress);
      // d.forEach(item => {
      //   if (item.processed && item.book_section.section_id === sectionId) {
      //     const existingBook = books.some(book => book.id === item.book_id);
      //     if (!existingBook && booksToAdd.length > 0) {
      //       console.log("dsf", booksToAdd)
      //       const [firstBookToAdd, ...restBooksToAdd] = booksToAdd;
      //       setBooksToAdd(restBooksToAdd);
      //       const newBook = {
      //         id: firstBookToAdd.newId,
      //         title: firstBookToAdd.title,
      //         is_processed: true,
      //         cover_image: firstBookToAdd.cover_image,
      //         index: books.length,
      //       };
      //       setBooks(prevBooks => [...prevBooks, newBook]);  
      //     }
      //   }
      // });
      // if (isBookProcessed) {
      //   const newBook = {
      //     id: newId,
      //     title: file.name.replace(/\.[^/.]+$/, ""),
      //     is_processed: true,
      //     cover_image: cover_image,
      //     index: books.length,
      //   };
      //   setGlobalLoading(prev => Math.max(prev - 1, 0));
      //   setProgress([]);
      // }
    };

    progressSocket.onclose = function() {
      console.log('Socket closed');
      const newBook = {
        id: newId,
        title: file.name.replace(/\.[^/.]+$/, ""),
        is_processed: true,
        cover_image: cover_image,
        index: books.length,
      };
      setBooks(prevBooks => [...prevBooks, newBook]);  
      setGlobalLoading(prev => Math.max(prev - 1, 0));
      setProgress([]);
    };

    progressSocket.onerror = function(e) {
      console.error('Socket error');
      setGlobalLoading(prev => Math.max(prev - 1, 0));
      setProgress([]);
    };
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
        {books.map((book) => (
            <React.Fragment key={book.id}>
              <Book
                key={book.id}
                book={book}
                removeBook={removeBook}
                sectionId={sectionId}
                index={book.index}
                moveBookInsideSection={moveBookInsideSection}
                client={client}
              />
              <VerticalLine />
            </React.Fragment>
          ))}
        {globalLoading > 0 && (
          progress.map((progress_obj) => (
            <React.Fragment key={progress_obj.book_id}>
              <div className="vertical-container add-book loading">
                <div className="vertical-rectangle">
                  <MyCircularProgress progress={progress_obj.percentage} determinate={true}/>
                </div>
              </div>
              <VerticalLine />
            </React.Fragment>
            //<Skeleton variant="rectangular" height={200} width={200} />
          ))
        )}
        <AddBook
          onFileSelect={addNewBook}
          client={client}
          sectionId={sectionId}
          globalLoading={globalLoading}
          setGlobalLoading={setGlobalLoading}
        />
      </div>
    </div>
  );
};
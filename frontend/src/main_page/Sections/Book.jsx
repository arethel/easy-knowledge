import React, { useState, useEffect, useRef } from "react";
import { Icon } from "../Icon.jsx";
import { useDrag, useDrop } from 'react-dnd';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateIcon from '@mui/icons-material/Create';
import { useNavigate } from "react-router-dom";

import './style.css';

export const Book = ({ book, sectionId, index, moveBookInsideSection, client, handleDeleteBook }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(book.title.replace(/\.[^/.]+$/, ""));
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const handleKeyPress = (event) => {
    if (isEditing && event.key === 'Enter') {
      handleSaveEdit();
    }
  };

  const [{ isDragging }, dragRef] = useDrag({
    type: 'BOOK',
    item: { id: book.id, sectionId, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop({
    accept: 'BOOK',
    drop: (item) => {
      if (item.sectionId === sectionId) {
        moveBookInsideSection(item.index, index);
      }
    },
  });

  const handleDelete = async () => {
    handleDeleteBook(book.id, editedName);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await client.post('api/book/change-title/', { book_id: book.id, title: editedName });

      if (response.status === 200) {
        setIsEditing(false);
      } else {
        console.error('Failed to rename the book');
        alert('Failed to rename the book');
      }
    } catch (error) {
      console.error('Error during the API call', error);
      alert('Error during the API call');
    }
  };

  const handleNameChange = (e) => {
    setEditedName(e.target.value);
  };
  
  const openBookApi = async (book_id) => {
    const response = await client.post("api/opened-books/", { 'book_id': book_id });
    if (response.data.error === 0) {
      console.log('Book was opened');
    }
    return response;
  }
  
  const handleBookClick = (event) => {
    openBookApi(book.id);
    navigate('/books-reading');
  }

  const displayContent = (
    <>
      <div className="icons-container">
        {/* <Icon name="pencil" onClick={handleEditClick} src={require("../../images/icon-pencil.png")} /> */}
        <CreateIcon name="pencil" style={{ cursor: 'pointer' }} onClick={handleEditClick}/>
        {/* <Icon name="trashbin" onClick={handleDelete} src={require("../../images/icon-trashbin.png")} /> */}
        <DeleteIcon name="trashbin" style={{ cursor: 'pointer' }} onClick={handleDelete}/>
      </div>
      <div className={`vertical-rectangle ${!book.is_processed ? 'disabled-book' : ''}`} onClick={handleBookClick}>
        <img className="book-cover" src={`${book.cover_image ? book.cover_image : require('../../images/book1_cover.png')}`} alt={book.title} />
      </div>
      <div className={`name-text ${!book.is_processed ? 'disabled-book' : ''}`}>
        {isEditing ? (
          <>
            <input
              type="text"
              value={editedName}
              onChange={handleNameChange}
              onKeyDown={handleKeyPress}
              autoFocus
              ref={inputRef}
              onBlur={handleSaveEdit}
            />
          </>
        ) : (
          <span>{editedName.length > 15 ? `${editedName.slice(0, 15)}...` : editedName}</span>
        )}
      </div>
    </>
  );

  return (
    <div
    className={`vertical-container ${!book.is_processed ? 'disabled-book' : ''}`}
      ref={(node) => {
        dragRef(dropRef(node));
      }}
      style={{ opacity: isDragging || isEditing ? 0.5 : 1 }}
    >
      {displayContent}
    </div>
  );
};
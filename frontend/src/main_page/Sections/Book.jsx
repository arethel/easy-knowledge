import React, { useState, useEffect, useRef } from "react";
import { Icon } from "../Icon.jsx";
import { useDrag, useDrop } from 'react-dnd';
import './style.css';

export const Book = ({ book, sectionId, index, moveBookInsideSection, isProps, onProps, removeBook }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(book.name);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (!event.target.closest('.dots') && isProps && !isEditing) {
        onProps();
      }
    };

    const handleDocumentKeyPress = (event) => {
      if (isEditing && event.key === 'Enter') {
        handleSaveEdit();
      }
    };

    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('keypress', handleDocumentKeyPress);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
      document.removeEventListener('keypress', handleDocumentKeyPress);
    };
  }, [isProps, onProps, isEditing]);

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
        moveBookInsideSection( item.index, index);
      }
    },
  });

  const handleDelete = () => {
    const isConfirmed = window.confirm(`Are you sure you want to delete '${book.name}'?`);
    if (isConfirmed) {
      removeBook(book.id);
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
  };

  const handleNameChange = (e) => {
    setEditedName(e.target.value);
  };

  const displayContent = (
    <>
      <div className="icons-container">
        <Icon name="pencil" onClick={handleEditClick} src={require("../../images/icon-pencil.png")} />
        <Icon name="trashbin" onClick={handleDelete} src={require("../../images/icon-trashbin.png")} />
      </div>
      <div className="vertical-rectangle">
        <img className="book-cover" src={require("../../images/book1_cover.png")} alt={book.name} />
      </div>
      <div className="name-text">
        {isEditing ? (
          <>
            <input
              type="text"
              value={editedName}
              onChange={handleNameChange}
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
      className="vertical-container"
      ref={(node) => {
        dragRef(dropRef(node));
      }}
      style={{ opacity: isDragging || isEditing ? 0.5 : 1 }}
    >
      {displayContent}
    </div>
  );
};
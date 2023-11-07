import React, { useEffect } from "react";
import { Icon } from "../Icon.jsx";
import { useDrag } from 'react-dnd';
import './style.css';

export const Book = ({ book, isProps, onProps, removeBook }) => {
  useEffect(() => {
      const handleDocumentClick = (event) => {
        if (!event.target.closest('.dots') && isProps) onProps();
      };
  
      document.addEventListener('click', handleDocumentClick);
  
      return () => {
        document.removeEventListener('click', handleDocumentClick);
      };
  }, [isProps, onProps]);

  const [{ isDragging }, dragRef] = useDrag({
    type: 'book',
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleDelete = () => {
    const isConfirmed = window.confirm(`Are you sure you want to delete ${book.name}?`);
    if (isConfirmed) {
      removeBook(book.id);
    }
  };

  const displayBookName = book.name.length > 15 ? `${book.name.slice(0, 15)}...` : book.name;

  return (
    <div
      className="vertical-container"
      ref={dragRef}
      style={{ opacity: isDragging ? 0 : 1, }}
    >
      <div className="icons-container">
        <Icon name="dots" onClick={(e) => { e.stopPropagation(); }} src={require("../../images/icon-horizontal-ellipsis.png")} />
        <Icon name="pencil" onClick={(e) => { e.stopPropagation(); }} src={require("../../images/icon-pencil.png")} />
        <Icon name="trashbin" onClick={handleDelete} src={require("../../images/icon-trashbin.png")} />
      </div>
      <div className="vertical-rectangle">
        <img className="book-cover" src={require("../../images/book1_cover.png")} alt={book.name} />
      </div>
      <div className="name-text">{displayBookName}</div>
    </div>
  );
};
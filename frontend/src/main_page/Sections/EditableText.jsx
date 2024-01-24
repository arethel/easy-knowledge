import React, { useState, useRef, useEffect } from 'react';
import './style.css';

export const EditableText = ({ initialText, onTextChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText);
  const inputRef = useRef(null);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleChange = (event) => {
    setText(event.target.value);
  };

  const handleBlur = (event) => {
    if (event.type === 'blur' || (event.type === 'keydown' && event.key === 'Enter')) {
      setIsEditing(false);
      if (onTextChange) {
        onTextChange(text);
      }
    }
  };

  useEffect(() => {
    if (isEditing) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div className="section-name-container" onDoubleClick={handleDoubleClick}>
      {isEditing ? (
        <input
          className="custom-text"
          type="text"
          maxLength="50"
          value={text}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleBlur}
          ref={inputRef}
        />
      ) : (
        <span className="custom-text">{text}</span>
      )}
    </div>
  );
};
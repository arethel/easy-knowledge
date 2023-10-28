import React from "react";

export const Book = ({ bookName, isProps, onProps, isActive, onActivate }) => {
    useEffect(() => {
        const handleDocumentClick = (event) => {
          if (!event.target.closest('.dots') && isProps) onProps();
        };
    
        document.addEventListener('click', handleDocumentClick);
    
        return () => {
          document.removeEventListener('click', handleDocumentClick);
        };
    }, [isProps, onProps]);

    return (
      <div className="vertical-container">
        <div className="icons-container">
          <span className="icon">...</span>
          <span className="icon">✏️</span>
          <span className="icon">🗑️</span>
        </div>
        <div className="vertical-rectangle">{props.name}</div>
        <div className="name-text">{bookName}</div>
      </div>
    );
};
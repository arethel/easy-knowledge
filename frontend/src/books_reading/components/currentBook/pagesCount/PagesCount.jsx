import React from 'react';
import './style.css';

export const PagesCount = ({page, totalPages}) => {
    
    return (
        <div className="pages-count">
            <div className="pages-bg" />
            <div className="pages-count-container">
                <div className="pages-text">{`${page}/${totalPages}`}</div>
            </div>
        </div>
    );
}

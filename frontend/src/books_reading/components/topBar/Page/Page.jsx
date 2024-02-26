import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import { Button } from "../../reusableComponents/button/Button.jsx"
import { Icon } from "../../reusableComponents/icons/Icons.jsx"

import { ReactComponent as Dots } from '../../../../images/dots.svg';
import { ReactComponent as Cross } from '../../../../images/cross.svg';

export const Page = ({ bookName, isProps, onProps, isActive, onActivate, onClose, shouldHide, onTests, onHighlights}) => {

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (!event.target.closest('.dots') && isProps) onProps();
    };

    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [isProps, onProps]);
  
  const bookNameRef = useRef(null);
  const [showFullName, setShowFullName] = useState(true);
  
  useEffect(() => {
    if (bookNameRef.current) {
      if (bookNameRef.current.scrollWidth > bookNameRef.current.clientWidth) {
        setShowFullName(false);
      } else {
        setShowFullName(true);
      }
    }
    return () => {};
  }, [bookNameRef]);
  
  return (
    <div className={`page ${isProps ? 'expanded' : ''} ${isActive ? 'active-page' : ''} ${shouldHide ? 'hide' : ''}`} onClick={onActivate}>
      <div className="page-buttons">
        <div className={`book-name ${showFullName?'':'masked'}`} ref={bookNameRef}>{bookName}</div>
        <Icon name="dots" onClick={(e) => { e.stopPropagation(); onProps(); }} src={<Dots className='icon dots'/>} />
        <Icon name="cross" className='cross-div' onClick={(e) => { e.stopPropagation(); onClose(); }} src={<Cross className='icon cross'/>} />
      </div>
      <div className="props">
        {/* <Button string="Chapter" /> */}
        <Button string="Tests" onClick={onTests} />
        <Button string="Highlights" onClick={onHighlights} />
        {/* <Button string="Delete" /> */}
      </div>
    </div>
  );
};
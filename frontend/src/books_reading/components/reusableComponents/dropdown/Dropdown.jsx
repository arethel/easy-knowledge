import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../button/Button.jsx';
import './style.css';

export const Dropdown = ({ options, onSelect, mainText, mainTextChange = false}) => {
  
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const mainTextRef = useRef(mainText);
  
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };
  
    const handleOptionClick = (option) => {
        setIsOpen(false);
        onSelect(option);
        if (mainTextChange) {
          mainTextRef.current = option;
        }
    };
  
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };
  
    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);
  
    return (
      <div className="dropdown" ref={dropdownRef}>
        <div className={`dropdown-toggle ${isOpen ? 'show' : ''}`} onClick={toggleDropdown}>
          <div className='dropdown-main-text'>
            {mainTextChange? mainTextRef.current: mainText}
          </div>
        </div>
        <div className={`dropdown-menu ${isOpen? 'show': ''}`}>
            {options.map((option) => (
                <Button key={option} string = {option} onClick={() => handleOptionClick(option)}/>
            ))}
        </div>
      </div>
    );
};

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../button/Button.jsx';
import './style.css';

export const Dropdown = ({ options, onSelect, mainText }) => {
    // const [selectedOption, setSelectedOption] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
  
    const toggleDropdown = () => {
      setIsOpen(!isOpen);
    };
  
    const handleOptionClick = (option) => {
        // setSelectedOption(option);
        setIsOpen(false);
        onSelect(option);
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
        <div className={`dropdown-toggle ${isOpen? 'show': ''}`} onClick={toggleDropdown}>
          {mainText}
        </div>
        <div className={`dropdown-menu ${isOpen? 'show': ''}`}>
            {options.map((option) => (
                <Button key={option} string = {option} onClick={() => handleOptionClick(option)}/>
            ))}
        </div>
      </div>
    );
};

import React, { useState, useEffect } from 'react';
import './style.css';

export const Rectangle = ({ x1, y1, x2, y2, show }) => {
  
    const style = {
      left: `${Math.min(x1, x2)}px`,
      top: `${Math.min(y1, y2)}px`,
      height: `${Math.abs(y1-y2)}px`,
      width: `${Math.abs(x1 - x2)}px`,
      display: show ? 'block' : 'none',
    };
  
    return <div style={style} className='selection-rectangle'></div>;
  };
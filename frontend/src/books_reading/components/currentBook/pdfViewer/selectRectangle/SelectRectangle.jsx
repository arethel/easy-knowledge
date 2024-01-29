import React, { useState, useEffect } from 'react';
import './style.css';

export const Rectangle = ({ x1, y1, x2, y2 }) => {
  
    const style = {
      position: 'absolute',
      left: `${Math.min(x1, x2)}px`,
      top: `${Math.min(y1, y2)}px`,
      height: `${Math.abs(y1-y2)}px`,
      width: `${Math.abs(x1-x2)}px`,
      border: '2px solid red',
      zIndex: 1000,
    };
  
    return <div style={style}></div>;
  };
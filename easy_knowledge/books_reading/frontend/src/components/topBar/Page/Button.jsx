import React, { useState } from "react";
import "./style.css";


export const Button = (props) => {
    
    const [isHovered, setIsHovered] = useState(false);
    const handleMouseEnter = () => {
        setIsHovered(true);
    };
    const handleMouseLeave = () => {
        setIsHovered(false);
    };

const overlapGroupClass = isHovered ? 'overlap-group-hovered' : 'overlap-group';

    
    return (
        <div className={overlapGroupClass}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
            <div className="text-wrapper-3">{props.string}</div>
        </div>
    )
}
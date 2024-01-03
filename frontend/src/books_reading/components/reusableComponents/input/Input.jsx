import React, { useState } from "react";
import "./style.css";

export const Input = ({ value, onSave, classes = '', type='text', min=0, max=20}) => {
    const [editedValue, setEditedValue] = useState(value);

    const handleInputChange = (e) => {
        setEditedValue(e.target.value);
    };

    const handleSave = () => {
        onSave(editedValue);
    };

    return (
        <input className={"ek-input " + classes}
            type={type}
            value={editedValue}
            onChange={handleInputChange}
            onBlur={handleSave}
            min={min}
            max={max}
        />
    );
};

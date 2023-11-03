import React, { useState } from "react";
import "./style.css";

import { Dropdown } from '../../reusableComponents/dropdown/Dropdown.jsx';

export const SettingsPage = ({ settingsDict, onUpdateSettingsDict }) => {
    
    const updateSettings = (newSettings) => {
        onUpdateSettingsDict(newSettings);
    };
    
    const handleOptionClick = (settingName, option) => {
        const updatedSettingsDict = { ...settingsDict };
        updatedSettingsDict[updatedSettingsDict.selected][settingName].selected = option;
        updateSettings(updatedSettingsDict);
    };
    
    return (
        <div className="settings-page">
            {Object.keys(settingsDict[settingsDict.selected]).map((settingName, index) => (
                
                <div className={`row`} key={settingName}>
                    <div className="setting-name">{settingName}</div>
                    <div className="dropdown-container">
                        <Dropdown
                            options={settingsDict[settingsDict.selected][settingName].values}
                            onSelect={(option) => handleOptionClick(settingName, option)}
                            mainText={settingsDict[settingsDict.selected][settingName].selected}
                            mainTextChange={true}
                            
                        />
                    </div>
                    {index < Object.keys(settingsDict[settingsDict.selected]).length - 1 && <hr className="separating-line"/>}
                </div>
            ))}
        </div>
    )
}
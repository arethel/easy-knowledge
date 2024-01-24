import React from "react";
import "./style.css";

import { Dropdown } from '../../reusableComponents/dropdown/Dropdown.jsx';
import { useTranslation } from "react-i18next";

export const SettingsPage = ({ settingsDict, onUpdateSettingsDict }) => {
    const { t } = useTranslation();
    
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
                <div key={settingName}>
                <div className={`row`} >
                    <div className="setting-name">{t(`${settingName.toLowerCase().replace(' ', '-')}`)}</div>
                    <div className="dropdown-container">
                        <Dropdown
                            options={settingsDict[settingsDict.selected][settingName].values}
                            onSelect={(option) => handleOptionClick(settingName, option)}
                            mainText={settingsDict[settingsDict.selected][settingName].selected}
                            mainTextChange={true}
                            
                        />
                    </div>
                    
                    </div>
                    {index < Object.keys(settingsDict[settingsDict.selected]).length - 1 && <hr className="separating-line"/>}
                </div>
            ))}
          </div>
    )
}
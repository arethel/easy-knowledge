import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import "./style.css";

export const SettingsTab = ({ settingsDict, onUpdateSettingsDict }) => {
    const { t } = useTranslation();
    
    const updateSettings = (newSettings) => {
        onUpdateSettingsDict(newSettings);
      };
    
    const [activeTab, setActiveTab] = useState(Object.keys(settingsDict)[0]);

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
        
        const updatedSettingsDict = { ...settingsDict };
        updatedSettingsDict.selected = tabName;
        updateSettings(updatedSettingsDict);
    };
      
    return (
        <div className="settings-tab">
            {Object.keys(settingsDict).map((tabName) => {
                if (tabName === 'selected') return null;
                return(
                    <div className={`tab ${activeTab === tabName ? 'active' : ''}`} key={tabName}>
                        <div
                            className={`option`}
                            onClick={() => handleTabClick(tabName)}
                        >
                            {t(`${tabName.toLowerCase()}`)}
                        </div>
                    </div>
                )
            }
            )}
        </div>
    )
}
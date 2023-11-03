import React, { useState } from "react";
import { ReactComponent as Cross } from '../../../images/cross.svg';
import "./style.css";

import { Icon } from "../reusableComponents/icons/Icons";
import { SettingsTab } from "./settingsTab/SettingsTab";
import { SettingsPage } from "./settingsPage/SettingsPage";

export const Settings = () => {
    
    const [settingsDictionary, setSettingsDictionary] = useState({
        General: {
            Theme: {
                values: ['Dark', 'Light'],
                selected: 'Dark',
            },
            Font: {
                values: ['Inter', 'Roboto'],
                selected: 'Inter',
            },
            'Font Size': {
                values: ['Small', 'Medium', 'Large'],
                selected: 'Medium',
            },
        },
        External: {
            Language: {
                values: ['English', 'Russian'],
                selected: 'English',
            },
        },
        selected: 'General',
      });
    
      const updateSettingsDict = (newSettingsDict) => {
        setSettingsDictionary(newSettingsDict);
      };
    
    return (
        <div className="settings">
            <div className="settings-container">
                <div className="bg">
                    <Icon
                        name = 'cross'
                        className="settings-cross"
                        src={<Cross />}
                    />
                    <SettingsTab settingsDict={settingsDictionary} onUpdateSettingsDict={updateSettingsDict} />
                    <SettingsPage settingsDict={settingsDictionary} onUpdateSettingsDict={updateSettingsDict} />
                    
                </div>
            </div>
            <div className="shadow" />
        </div>
    );
}
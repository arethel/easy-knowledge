import React, { useState, useEffect, useRef, useCallback } from "react";
import { ReactComponent as Cross } from '../../images/cross.svg';
import "./style.css";

import { Icon } from "../../books_reading/components/reusableComponents/icons/Icons";
import { SettingsTab } from "./settingsTab/SettingsTab";
import { SettingsPage } from "./settingsPage/SettingsPage";

export const MySettings = ({ active, setActive }) => {
    
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
    
    const closeSettings = useCallback(() => {
        setActive(false);
    }, [setActive]);

    const settingsContainerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
            settingsContainerRef.current &&
            !settingsContainerRef.current.contains(event.target)
            ) {
            closeSettings();
            }
        };

    if (active) {
        document.addEventListener("click", handleClickOutside);
    } else {
        document.removeEventListener("click", handleClickOutside);
    }

    return () => {
        document.removeEventListener("click", handleClickOutside);
    };
    }, [active, closeSettings]);
    
    return (
        <div id='settings' className={`settings ${active?'' :'hide'}`}>
            <div className="settings-container" ref={settingsContainerRef}>
                <div className="bg">
                    <Icon
                        name = 'cross'
                        className="settings-cross"
                        src={<Cross />}
                        onClick={(e) => { e.stopPropagation(); closeSettings(); }}
                    />
                    <SettingsTab settingsDict={settingsDictionary} onUpdateSettingsDict={updateSettingsDict} />
                    <div className="vertical-separating-line"/>
                    <SettingsPage settingsDict={settingsDictionary} onUpdateSettingsDict={updateSettingsDict} />
                    
                </div>
            </div>
            <div className="shadow" />
        </div>
    );
}
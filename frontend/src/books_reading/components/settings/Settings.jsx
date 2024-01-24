import React, { useState, useEffect, useRef, useCallback } from "react";
import { ReactComponent as Cross } from '../../../images/cross.svg';
import { useTranslation } from "react-i18next";
import "./style.css";

import { Icon } from "../reusableComponents/icons/Icons";
import { SettingsTab } from "./settingsTab/SettingsTab";
import { SettingsPage } from "./settingsPage/SettingsPage";

export const Settings = ({ active, setActive, client }) => {
    const { i18n } = useTranslation();
    
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
      
      useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await client.get('users/settings/get-settings');
                if (response.status === 200) {
                    console.log(response.data)
                    const result = response.data;
                    const settingsDict = {
                        General: {
                            Theme: {
                                values: ['Dark', 'Light'],
                                selected: result.theme,
                            },
                            Font: {
                                values: ['Inter', 'Roboto'],
                                selected: result.text_font,
                            },
                            'Font Size': {
                                values: ['Small', 'Medium', 'Large'],
                                selected: result.text_size,
                            },
                        },
                        External: {
                            Language: {
                                values: ['English', 'Russian'],
                                selected: result.language,
                            },
                        },
                        selected: 'General',
                      }
                    setSettingsDictionary(settingsDict);
                    updateSettingsDict(settingsDict);
                }
            } catch (error) {
                console.error("Error fetching settings:", error);
            }
        };

        fetchSettings();
    }, [client]);

    const updateSettingsDict = async (newSettingsDict) => {
        setSettingsDictionary(newSettingsDict);
        console.log(newSettingsDict);
        const postData = {
            theme: newSettingsDict.General.Theme.selected,
            text_font: newSettingsDict.General.Font.selected,
            text_size: newSettingsDict.General['Font Size'].selected,
            language: newSettingsDict.External.Language.selected,
        };
        document.documentElement.style.setProperty('--main-font-font-family', newSettingsDict.General.Font.selected === 'Inter' ? '"Inter-Regular", Helvetica' : '"Roboto-Regular", sans-serif');
        document.documentElement.style.setProperty('--smaller-font-font-family', newSettingsDict.General.Font.selected === 'Inter' ? '"Inter-Regular", Helvetica' : '"Roboto-Regular", sans-serif');
        document.documentElement.style.setProperty('--very-big-font-font-family', newSettingsDict.General.Font.selected === 'Inter' ? '"Inter-Regular", Helvetica' : '"Roboto-Regular", sans-serif');
        document.documentElement.style.setProperty('--big-font-font-family', newSettingsDict.General.Font.selected === 'Inter' ? '"Inter-Regular", Helvetica' : '"Roboto-Regular", sans-serif');

        document.documentElement.style.setProperty('--main-font-font-size', newSettingsDict.General['Font Size'].selected === 'Small' ? '19px' : newSettingsDict.General['Font Size'].selected === 'Medium' ? '22px' : '25px');
        document.documentElement.style.setProperty('--smaller-font-font-size', newSettingsDict.General['Font Size'].selected === 'Small' ? '17px' : newSettingsDict.General['Font Size'].selected === 'Medium' ? '20px' : '23px');
        document.documentElement.style.setProperty('--very-big-font-font-size', newSettingsDict.General['Font Size'].selected === 'Small' ? '58px' : newSettingsDict.General['Font Size'].selected === 'Medium' ? '64px' : '70px');
        
        const language = newSettingsDict.External.Language.selected === 'English' ? 'en' : 'ru';
        console.log(language)
        i18n.changeLanguage(language);
        try {
            const response = await client.post("users/settings/change-settings", postData);
            if (response.data.error === 0) {
                console.log('Settings changed');
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }

        const styleSheet = document.getElementById('styleguide-css');
        if (styleSheet) {
            styleSheet.disabled = true;
        }
    };
    
    const closeSettings = useCallback(() => {
        setActive(false);
    }, [setActive]);

    const settingsContainerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
            settingsContainerRef.current &&
            !settingsContainerRef.current.contains(event.target) &&
            !event.target.classList.contains('MuiMenuItem-root') &&
            !event.target.classList.contains('MuiSvgIcon-root') &&
            !event.target.classList.contains('MuiListItemIcon-root')
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
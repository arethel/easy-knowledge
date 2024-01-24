import React from "react";
import { AccountMenu } from "./AccountMenu";
import { Logo } from "./Logo/Logo.jsx";


export const TopBar = ({ userData, handleCreateSection, setShowSettings, client, t }) => {
    return (
        <div className="topbar">
            <Logo />
            <div className="topbar-buttons">
                <button className="create-section-button" onClick={handleCreateSection}>
                    {t('create-new-section')}
                </button>
                <AccountMenu username={userData.username} setShowSettings={setShowSettings} client={client} t={t} />
            </div>
        </div>
);}
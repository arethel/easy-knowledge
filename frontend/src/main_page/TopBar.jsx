import React from "react";
import { AccountMenu } from "./AccountMenu";

export const TopBar = ({ userData, handleCreateSection, setShowSettings, client, t }) => {
    return (
        <div className="topbar">
            <button className="create-section-button" onClick={handleCreateSection}>
                {t('create new section')}
            </button>
            <AccountMenu username={userData.username} setShowSettings={setShowSettings} client={client} t={t} />
        </div>
);}
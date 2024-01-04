import React from "react";
import { AccountMenu } from "./AccountMenu";

export const TopBar = ({ userData, handleCreateSection, setShowSettings, client }) => {
    return (
        <div className="topbar">
            <button className="create-section-button" onClick={handleCreateSection}>
                Create New Section
            </button>
            <AccountMenu username={userData.username} setShowSettings={setShowSettings} client={client} />
        </div>
);}
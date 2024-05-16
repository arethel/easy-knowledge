import React from "react";
import { AccountMenu } from "./AccountMenu";
import { Logo } from "./Logo/Logo.jsx";


export const TopBar = ({ userData, handleCreateSection, setShowSettings, client, t, setSubscribtionWindow }) => {
    return (
        <div className="topbar">
            <div className="left-part">
                <Logo />
                <div className="subscribtion-button" onClick={(e) => { e.stopPropagation(); setSubscribtionWindow(true)}}>Upgrade your plan</div>
            </div>
            <div className="topbar-buttons">
                {/* <button className="create-section-button" onClick={handleCreateSection}>
                    {t('Create new section')}
                </button> */}
                <AccountMenu username={userData===null?'':userData.username} setShowSettings={setShowSettings} client={client} t={t} />
            </div>
        </div>
);}
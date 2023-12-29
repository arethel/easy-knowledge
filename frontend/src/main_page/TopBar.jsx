import React from "react";
import { AccountMenu } from "./AccountMenu";

export const TopBar = ({ handleCreateSection }) => {
    return (
        <div className="topbar">
            <button className="create-section-button" onClick={handleCreateSection}>
                Create New Section
            </button>
            <AccountMenu username={"John Doe"}/>
        </div>
);}
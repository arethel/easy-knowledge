import React from "react";

export const TopBar = ({ handleCreateSection }) => {
    return (
        <div className="topbar">
            <button className="create-section-button" onClick={handleCreateSection}>
                Create New Section
            </button>
            <div className="user-info">
                <img
                    className="avatar"
                    src="https://www.w3schools.com/howto/img_avatar.png"
                    alt="User Avatar"
                />
                <span className="username">John Doe</span>
            </div>
        </div>
);}
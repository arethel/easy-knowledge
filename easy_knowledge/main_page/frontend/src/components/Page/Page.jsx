import React from "react";
import { Section, Book } from "./Section";

export const Page = () => {
  return (
    <div className="container">
      <div className="topbar">
        <div className="user-info">
          <img
            className="avatar"
            src="https://www.w3schools.com/howto/img_avatar.png"
            alt="User Avatar"
          />
          <span className="username">John Doe</span>
        </div>
      </div>
      <div className="line"></div>
      <Section text="Artificial Intelligence"/>
      <Section text="Design"/>
    </div>
  );
}
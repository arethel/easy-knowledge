import React from "react";
import "./style.css";
import { Button } from "./Button.jsx"

export const Page = () => {
  
  return (
    <div className="page">
      <div className="text-wrapper">Page3</div>
      <img className="icon-horizontal" alt="Icon horizontal" src="../img/icon-horizontal-ellipsis.png" />
      <img className="icon-cross" alt="Icon cross" src="../img/icon-cross.png" />
      <div className="props">
        <Button string="Chapter" />
        <Button string="Share" />
        <Button string="Delete" />
      </div>
    </div>
  );
};

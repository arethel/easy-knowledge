import React from "react";
import "./style.css";

export const Button = ({className, buttonText, propsBtn = true}) => {
    return (
        <div className={'button '+className}>
            <div className={"text " + className}>{buttonText}</div>
            {propsBtn ? <img className="icon-horizontal" alt="Icon horizontal" src={require("../img/icon-horizontal-ellipsis.png")} /> : null}
        </div>
    )
}
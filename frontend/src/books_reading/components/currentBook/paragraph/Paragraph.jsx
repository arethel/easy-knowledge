import React from "react";
import "./style.css";

export const Paragraph = ({mainText, text}) => {
    return (
        <div className="paragraph">
            
            <div className="main-text">Cell Structure and Function:</div>
            <p className="paragraph-text">
                Biology explores the fundamental unit of life, the
                cell. Cells are the building blocks of all living
                organisms and can vary in size and complexity. They
                are classified into two main categories: prokaryotic
                cells, lacking a true nucleus, and eukaryotic cells,
                which have a well-defined nucleus. Each cell carries
                out specific functions, such as metabolism,
                reproduction, and responding to external stimuli.
            </p>
            <div className="paragraph-props">
                <div className="paragraph-props-rect">
                    <img
                        className="icon-star"
                        alt="Icon star"
                        src="icon-star-3.png"
                    />
                    <img
                        className="icon-question-mark"
                        alt="Icon question mark"
                        src="icon-question-mark-2.png"
                    />
                    <img
                        className="icon-horizontal"
                        alt="Icon horizontal"
                        src="icon-horizontal-ellipsis-3.png"
                    />
                </div>
            </div>
            <div className="paragraph-bg" />
        </div>
    );
    
}
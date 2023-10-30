import React from "react";
import "./style.css";

export const EndOfParagraph = () => {
    return (
        <div className="end-of-paragraph">
            <div className="buttons">
                <div className="note-paragraph">
                    <img
                        className="img"
                        alt="Icon star"
                        src="icon-star-4.png"
                    />
                    <div className="text-wrapper-3">Note paragraph</div>
                </div>
                <div className="questions">
                    <img
                        className="icon-question-mark-2"
                        alt="Icon question mark"
                        src="icon-question-mark-3.png"
                    />
                    <div className="text-wrapper-4">
                        Create questions for paragraph
                    </div>
                </div>
            </div>
        </div>
)
}
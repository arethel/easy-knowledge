import React from "react";
import "./style.css";

import { PagesCount } from "./pagesCount/PagesCount.jsx";
import { Paragraph } from "./paragraph/Paragraph.jsx";

export const Book = () => {
    return (
        <div className="book">
            <div className="paragraphs">
                <Paragraph/>
                <div className="new-chapter">
                    <div className="overlap">
                        <div className="text-wrapper-2">New chapter</div>
                    </div>
                </div>
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
                <div className="overlap-wrapper">
                    <div className="overlap-2">
                        <div className="rect-2" />
                        <div className="hovered-props">
                            <div className="div-wrapper">
                                <div className="text-wrapper-5">
                                    Show original
                                </div>
                            </div>
                        </div>
                        <img
                            className="icon-star-2"
                            alt="Icon star"
                            src="icon-star-2.png"
                        />
                        <img
                            className="icon-question-mark-3"
                            alt="Icon question mark"
                            src="image.png"
                        />
                        <img
                            className="icon-horizontal-2"
                            alt="Icon horizontal"
                            src="icon-horizontal-ellipsis.png"
                        />
                        <p className="p">
                            Ecology studies the relationships between organisms
                            and their environments. Ecosystems consist of all
                            living organisms and their physical surroundings.
                            Topics in ecology include the flow of energy through
                            food chains and webs, the cycling of nutrients, and
                            the impact of human activities on ecosystems.
                        </p>
                    </div>
                </div>
                
            </div>
            <PagesCount page={100} totalPages={400} />
        </div>
    );
};

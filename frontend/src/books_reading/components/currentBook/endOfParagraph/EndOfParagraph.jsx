import React, { useState } from "react";
import "./style.css";

import { SVGButton } from "../svgButton/svgButton";
import { ReactComponent as Star } from '../../../../images/star.svg';
import { ReactComponent as StarFilled } from '../../../../images/star-filled.svg';
import { ReactComponent as Question } from '../../../../images/question.svg';

export const EndOfParagraph = () => {
    const [activatedProps, setActivatedProps] = useState({star: false, question: false});

    const toggleClick = (key) => {
        const activatedPropsCopy = { ...activatedProps };
        activatedPropsCopy[key] = !activatedPropsCopy[key];
        setActivatedProps(activatedPropsCopy);
    }
    
    return (
        <div className="book-element end-of-paragraph">
            <div className="buttons">
                <div className={`button-container ${activatedProps["question"]?'gold':''}`} onClick={() => toggleClick('question')}>
                    <SVGButton SvgComponent={Question} className="question" active={activatedProps["question"]} />
                    <div className="end-of-paragraph-text">
                        Create questions for paragraph
                    </div>
                </div>
                
                <div className={`button-container ${activatedProps["star"]?'gold':''}`} onClick={() => toggleClick('star')}>
                    {
                    activatedProps["star"] ?
                    <SVGButton SvgComponent={StarFilled} className="star" active={activatedProps["star"]} /> :
                    <SVGButton SvgComponent={Star} className="star" active={activatedProps["star"]} />
                    }
            
                    <div className="end-of-paragraph-text">Note paragraph</div>
                </div>
                
            </div>
            <div className="element-bg end-of-paragraph-bg"/>
        </div>
)
}
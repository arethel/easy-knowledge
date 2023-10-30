import React, { useState } from "react";
import "./style.css";

import { SVGButton } from "../svgButton/svgButton";

import { ReactComponent as AI } from '../../../../images/ai.svg';
import { ReactComponent as Star } from '../../../../images/star.svg';
import { ReactComponent as StarFilled } from '../../../../images/star-filled.svg';
import { ReactComponent as Question } from '../../../../images/question.svg';

export const ParagraphProps = (props) => {
    const [activatedProps, setActivatedProps] = useState({ai: true, star: false, question: false});

    const toggleClick = (key) => {
        const activatedPropsCopy = { ...activatedProps };
        activatedPropsCopy[key] = !activatedPropsCopy[key];
        setActivatedProps(activatedPropsCopy);
    }
    
    return (
        <div className="paragraph-props">
            {/* <div className="paragraph-props-container-pos">
                <div className={`paragraph-ext-props-container ${isDotsClicked ? 'expanded' : ''}`}>
                    <div className="properties">
                        <div className="property">
                            Show original
                        </div>
                    </div>
                    <SVGButton SvgComponent={Dots} className="dots" onClick={toggleDotsClick}/>
                </div>
            </div> */}
            
            <SVGButton SvgComponent={AI} className="ai" onClick={() => toggleClick('ai')} active={activatedProps["ai"]} />
            {
                activatedProps["star"] ?
                    <SVGButton SvgComponent={StarFilled} className="star" onClick={() => toggleClick('star')} active={activatedProps["star"]} /> :
                    <SVGButton SvgComponent={Star} className="star" onClick={() => toggleClick('star')} active={activatedProps["star"]} />
            }
            <SVGButton SvgComponent={Question} className="question" onClick={() => toggleClick('question')} active={activatedProps["question"]} />
        </div>
    )

}
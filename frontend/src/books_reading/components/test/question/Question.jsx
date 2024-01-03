import React, {useState, useRef} from "react";
import { Button } from "../../reusableComponents/button/Button.jsx";
import "./style.css";

export const Question = ({ number, quesiton, answer, page}) => {
    const contentRef = useRef(null);
    const [showAnswer, setShowAnswer] = useState(false);
    
    const expandHeight = (expand) => {
        const content = contentRef.current;
        
        if (!expand) {
            content.style.height = '0px';
        }
        else {
            const scrollHeight = content.scrollHeight;
            content.style.height = scrollHeight + 'px';
        }
      };
    
    const showAnswerHandler = () => {
        setShowAnswer(!showAnswer);
        expandHeight(!showAnswer);
    }
    
    return (
        <div className="question">
            <p className="question-about">
                {number + '. ' + quesiton}
            </p>
            <p ref={contentRef} className={`answer ${ showAnswer? 'shown': ''}`}>
                {answer}
            </p>
            <div className="info-block">
                <Button boxClasses="show-answer-box" stringClasses="show-answer-string" string={showAnswer? 'Hide answer': 'Show answer'} onClick={showAnswerHandler}/>
                <div className="info">
                    <div className="page-info">{'Page ' + page}</div>
                    <Button boxClasses="show-in-book-box" stringClasses="show-in-book-string" string='Show in book'/>
                </div>
            </div>
        </div>
    )
}
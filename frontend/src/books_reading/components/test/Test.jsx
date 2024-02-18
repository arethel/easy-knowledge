import React, { useState, useEffect, forwardRef, useCallback } from "react";
import { Icon } from "../reusableComponents/icons/Icons.jsx"
import { ReactComponent as Cross } from '../../../images/cross.svg';
import { Question } from "./question/Question.jsx";
import "./style.css";

const Test = forwardRef(({test_id, tests, activateTests, active, setActive, client, highlightPluginInstance}, ref) => {
    
    const closeTest = useCallback(() => {
        setActive(false);
        activateTests(true);
    }, [setActive]);
    
    const closeTest2 = useCallback(() => {
        setActive(false);
    }, [setActive]);
    
    const [questions, setQuestions] = useState({});
    
    useEffect(() => {
        
        const fetchTest = async () => {
            try {
                const response = await client.get(`api/qa/test/${test_id}/`);
                const newQuestions = {};
                if (response.data.error === 0) {
                    response.data.test.forEach((question_data, index) => {
                        newQuestions[index] = {
                            question: question_data.question,
                            answer: question_data.answer,
                            highlight: question_data.highlight,
                            page: question_data.highlight.areas[0].pageIndex+1,
                        };
                    });
                    setQuestions(newQuestions);
                }
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching tests:', error);
            }
        };

        if (active) {
            fetchTest();
        }
        
    }, [active, closeTest]);
    
    return (
        <div className={`test ${active?'':'hide'}`}>
            <div className="BG" />
            <div className="panel">
                <Icon
                    name = 'cross'
                    className="test-cross"
                    src={<Cross />}
                    onClick={(e) => { e.stopPropagation(); closeTest();}}
                />
                <div className="test-name">{'test name'}</div>
                
                <div className="panel-BG">
                    {Object.keys(questions).map((quesiont_id, index) => (
                        <div className='panel-element' key={quesiont_id}>
                            <Question
                                number={index + 1}
                                quesiton={questions[quesiont_id].question}
                                answer={questions[quesiont_id].answer}
                                page={questions[quesiont_id].page}
                                highlight={questions[quesiont_id].highlight}
                                jumpToHighlightArea={highlightPluginInstance.jumpToHighlightArea}
                                closeTest2={closeTest2}
                                active={active}
                                setActive={setActive}
                            />
                            {index < Object.keys(questions).length - 1 && <div className="separator" />}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
});

export { Test };
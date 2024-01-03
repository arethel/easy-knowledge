import React, { useState, useEffect, forwardRef, useCallback } from "react";
import { Icon } from "../reusableComponents/icons/Icons.jsx"
import { ReactComponent as Cross } from '../../../images/cross.svg';
import { Question } from "./question/Question.jsx";
import "./style.css";

const Test = forwardRef(({test_id, tests, activateTests, active, setActive}, ref) => {
    
    const closeTest= useCallback(() => {
        setActive(false);
        activateTests(true);
    }, [setActive]);
    
    const [questions, setQuestions] = useState({});
    
    useEffect(() => {
        
        const fetchTest = async () => {
            try {
                // const response = await axios.get('/api/tests');
                setQuestions({
                    0: { question: 'question 1', answer: 'answer 1', page: 1 },
                    1: { question: 'question 2', answer: 'answer 2', page: 2 },
                    2: { question: 'question 3', answer: 'answer 3', page: 3 },
                    3: { question: 'question 4', answer: 'answer 4', page: 4 },
                    4: { question: 'question 5', answer: 'answer 5', page: 5 },
                    5: { question: 'question 6', answer: 'answer 6', page: 6 },
                    6: { question: 'question 7', answer: 'answer 7', page: 7 },
                    7: { question: 'question 8', answer: 'answer 8', page: 8 },
                    8: { question: 'question 9', answer: 'answer 9', page: 9 },
                    9: { question: 'question 10', answer: 'answer 10', page: 10 },
                    10: { question: 'question 11', answer: 'answer 11', page: 11 },
                    11: { question: 'question 12', answer: 'answer 12', page: 12 },
                    12: { question: 'question 13', answer: 'answer 13', page: 13 },
                    
                });
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
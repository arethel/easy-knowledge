import React, { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "../../reusableComponents/input/Input.jsx";
import { Button } from "../../reusableComponents/button/Button.jsx";
import "./style.css";

export const TestElement = ({ elType, onClick, testName = 'test name', questions = 20, date = '31.12.2023', progress = 0 }) => {
    
    const [newTestName, setNewTestName] = useState(testName);
    const [newQuestions, setNewQuestions] = useState(questions);
    
    const handleTestName = (value) => {
        setNewTestName(value);
    }
    
    const handleQuestions = (value) => {
        setNewQuestions(value);
    }
    
    const onCreate = (e) => {
        e.stopPropagation();
        console.log('create');
    }
    
    return (
        <div className="test-element-div">
            { elType === "exist" ? (
            <div className="test-element" onClick={onClick}>
                <div className="test-name">{testName}</div>
                <div className="test-questions">{questions}</div>
                <div className="test-date">{date}</div>
            </div>
            ) : elType === "in progress" ? (
                <div className="test-element progress">
                    <div className="test-name">{testName}</div>
                    <div className="test-questions">{questions}</div>
                    <div className="test-date">{progress+'%'}</div>
                </div>
            ) : elType === "create" ? (
                <div className="test-element create">
                    <Input value='Test name' onSave={handleTestName} />
                    <Input value='10' onSave={handleQuestions} type="number" classes="questions-number"/>
                    <Button string="Create" onClick={onCreate} boxClasses="test-element-create-box" stringClasses="test-element-create-string"/>
                </div>
            ) : null}
        </div>
    );
}
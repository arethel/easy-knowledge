import React, { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "../../reusableComponents/input/Input.jsx";
import { Button } from "../../reusableComponents/button/Button.jsx";
import "./style.css";

export const TestElement = ({ elType, onClick, testName = 'test name', questions = 20, date = '31.12.2023', progress = 0, client=null, book_id = 0, updateWs = null, setUpdateWs = null }) => {
    
    const [newTestName, setNewTestName] = useState(testName);
    const [newQuestions, setNewQuestions] = useState(questions);
    
    const handleTestName = (value) => {
        setNewTestName(value);
    }
    
    const handleQuestions = (value) => {
        setNewQuestions(value);
    }
    
    const createTest = async (book_id, qa_count, name) => {
        try {
            const response = await client.post(`api/qa/test/`, {'book_id':book_id, 'qa_count':qa_count, 'name':name});
            if (response.data.error === 0) {
                console.log("Test created", response.data);
            }
            else {
                console.error("Error creating test:", response.data);
            }
        } catch (error) {
            console.error("Error creating test:", error);
        }
    }
    
    const onCreate = async (e) => {
        e.stopPropagation();
        await createTest(book_id, newQuestions, newTestName);
        setUpdateWs(!updateWs);
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
                    <div className="test-date">{parseInt(progress)+'%'}</div>
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
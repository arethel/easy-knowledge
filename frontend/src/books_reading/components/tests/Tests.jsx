import React, { useState, useEffect, useRef, useCallback, forwardRef } from "react";
import "./style.css";
import { Icon } from "../reusableComponents/icons/Icons.jsx"
import { ReactComponent as Cross } from '../../../images/cross.svg';
import { TestElement } from "./testElement/TestElement.jsx";


const Tests = forwardRef(({booksDictionary, activateTest, setTestId, test, client, URL, book_id=0, active = false, setActive = null}, ref) => {
    
    const [availableQuestions, setAvailableQuestions] = useState(0);
    const [testsList, setTestsList] = useState([]);
    const [ws, setWs] = useState(null);
    const [updateWs, setUpdateWs] = useState(true);
    
    const openTest = (test_id) => {
        setTestId(test_id);
        activateTest(true);
        setActive(false);
    };
    
    const closeTests = useCallback(() => {
        setActive(false);
    }, [setActive]);
    
    const testsContainerRef = useRef(null);
    
    useEffect(() => {
        
        const connectWebSocket = () => {
            const newWs = new WebSocket('ws://'+URL+'/ws/test-processing-info/'+book_id+'/');
            newWs.onmessage = (event) => {
                const data = JSON.parse(event.data);
                const tests = data.tests;
                tests.forEach((test) => {
                    if (test.is_ready && test.progress === 100) {
                        test.elType = 'exist';
                    }
                    else {
                        test.elType = 'in progress';
                    }
                });
                console.log(data);
                setAvailableQuestions(data.limitations);
                setTestsList(tests);
            };
            setWs(newWs);
        };
        
        if (active) {
            connectWebSocket();
        }
        
        const handleClickOutside = (event) => {
            if (
            testsContainerRef.current &&
            !testsContainerRef.current.contains(event.target)
            ) {
            closeTests();
            }
        };
    
        if (active) {
            document.addEventListener("click", handleClickOutside);
        } else {
            document.removeEventListener("click", handleClickOutside);
        }
    
        return () => {
            if (ws !== null) {
                ws.close();
            }
            document.removeEventListener("click", handleClickOutside);
        };
    }, [active, closeTests, updateWs, setUpdateWs]);
    
    return (
        <div className={`tests ${active?'' :'hide'}`}>
            <div className="BG"/>
            <div className="panel" ref={testsContainerRef} >
                <Icon
                    name = 'cross'
                    className="tests-cross"
                    src={<Cross />}
                    onClick={(e) => { e.stopPropagation(); closeTests();}}
                />
                <div className="book-name">{booksDictionary[book_id]===undefined ? null :booksDictionary[book_id].title}</div>
                <div className="panel-BG">
                    
                    <div className="info">
                        <div className="info-text">Name</div>
                        <div className="info-text">Questions</div>
                        <div className="info-text">Date</div>
                    </div>
                    
                    <div className="tests-list">
                        {testsList.map((test) => (
                            < TestElement
                                key={test.id}
                                elType={test.elType}
                                onClick={() => openTest(test.id)}
                                date={test.creation_date}
                                questions={test.qa_count}
                                testName={test.name}
                                progress={test.progress}
                                popover={test.qa_errors_count>0}
                            />
                        ))}
                        < TestElement
                            elType='create'
                            client={client}
                            book_id={book_id}
                            updateWs={updateWs}
                            setUpdateWs={setUpdateWs}
                        />
                        <div className="questions-div">
                            <div className="questions-left">
                                {availableQuestions + ' questions left'}
                            </div>
                        </div>
                    </div>
                    
                    
                </div>
            </div>
        </div>
    );
});

export { Tests };
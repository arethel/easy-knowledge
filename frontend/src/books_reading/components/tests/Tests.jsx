import React, { useState, useEffect, useRef, useCallback, forwardRef} from "react";
import "./style.css";
import { Icon } from "../reusableComponents/icons/Icons.jsx"
import { ReactComponent as Cross } from '../../../images/cross.svg';
import { TestElement } from "./testElement/TestElement.jsx";

const Tests = forwardRef(({booksDictionary, activateTest, setTestId, test, book_id=0, active = false, setActive = null}, ref) => {
    
    const [availableQuestions, setAvailableQuestions] = useState(0);
    const [testsList, setTestsList] = useState([]);
    
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
        
        const fetchTests = async () => {
            try {
                // const response = await axios.get('/api/tests');
                setTestsList([
                    { id: 1, elType: 'exist' },
                    { id: 2, elType: 'in progress' },
                    { id: 3, elType: 'exist' },
                ]);
            } catch (error) {
                console.error('Error fetching tests:', error);
            }
        };

        if (active) {
            fetchTests();
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
            document.removeEventListener("click", handleClickOutside);
        };
    }, [active, closeTests]);
    
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
                            />
                        ))}
                        < TestElement
                            elType='create'
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
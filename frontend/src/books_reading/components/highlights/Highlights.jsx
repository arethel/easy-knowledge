import React, { useState, useEffect, forwardRef, useCallback } from "react";
import { Icon } from "../reusableComponents/icons/Icons.jsx"
import { ReactComponent as Cross } from '../../../images/cross.svg';
import { Highlight } from "./highlight/Highlight.jsx";
import "./style.css";

const Highlights = forwardRef(({book_id, active, setActive, book_info, highlightAreas, highlightPluginInstance}, ref) => {
    
    const closeHighlights= useCallback(() => {
        setActive(false);
    }, [setActive]);
    
    return (
        <div className={`highlights ${active?'':'hide'}`}>
            <div className="BG" />
            {book_info ?
                <div className="panel">
                    <Icon
                        name = 'cross'
                        className="highlights-cross"
                        src={<Cross />}
                        onClick={(e) => { e.stopPropagation(); closeHighlights();}}
                    />
                    <div className="highlights-name">{book_info.title}</div>
                    <div className="panel-BG">
                        {[...(highlightAreas[book_id]!==undefined?highlightAreas[book_id]:[])].sort((highlight1, highlight2)=>highlight1.areas[0].pageIndex-highlight2.areas[0].pageIndex).map((highlight, index) => (
                            <div className='panel-element' key={highlight.id}>
                                <Highlight
                                    highlight={highlight}
                                    jumpToHighlightArea={highlightPluginInstance.jumpToHighlightArea}
                                    closeHighlights={closeHighlights}
                                />
                                {index < highlightAreas[book_id].length - 1 && <div className="separator" />}
                            </div>
                        ))}
                    </div>
                </div>
                :null
            }
        </div>
    );
});

export { Highlights };
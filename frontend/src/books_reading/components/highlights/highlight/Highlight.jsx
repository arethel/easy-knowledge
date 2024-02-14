import React, {useState, useRef, useEffect, useContext} from "react";
import { Button } from "../../reusableComponents/button/Button.jsx";
import "./style.css";

export const Highlight = ({ highlight, jumpToHighlightArea, closeHighlights }) => {
    const contentRef = useRef(null);
    const [showFull, setShowFull] = useState(false);
    
    const expandHeight = (expand) => {
        const content = contentRef.current;
        
        if (!expand) {
            content.style.height = '100px';
        }
        else {
            const scrollHeight = content.scrollHeight;
            content.style.height = scrollHeight + 'px';
        }
      };
    
    const showFullHandler = () => {
        setShowFull(!showFull);
        expandHeight(!showFull);
    }
    
    const onShowInBook = () => {
        jumpToHighlightArea(highlight.areas[0]);
        closeHighlights();
    }
    
    useEffect(() => {
        if (contentRef.current!==null) {
            if (contentRef.current.scrollHeight<=120) {
                contentRef.current.style.height = 'auto';
                setShowFull(true);
            }
            
        }
        
        return () => {  }
    }, [contentRef]);
    
    return (
        <div className="highlight">
            <p className={`highlight-about ${showFull?'show':''}`} ref={contentRef}>
                {highlight.text}
            </p>
            <div className="info-block">
                {contentRef.current!==null && contentRef.current.scrollHeight>120?
                    <Button boxClasses="show-full-box" stringClasses="show-full-string" string={showFull ? 'Hide full' : 'Show full'} onClick={showFullHandler} /> :
                    null
                }
                <div className="info">
                    <div className="page-info">{'Page ' + highlight.areas[0].pageIndex}</div>
                    <Button boxClasses="show-in-book-box" stringClasses="show-in-book-string" string='Show in book' onClick={onShowInBook}/>
                </div>
            </div>
        </div>
    )
}
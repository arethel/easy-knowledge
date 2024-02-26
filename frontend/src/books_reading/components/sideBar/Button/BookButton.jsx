import React, {useEffect, useState, useRef} from "react";
import { Icon } from "../../reusableComponents/icons/Icons.jsx"
import { Button } from "../../reusableComponents/button/Button.jsx"
import { ReactComponent as Dots } from '../../../../images/dots.svg';
import "./style.css";

export const BookButton = ({ className = '', buttonText, onClick, onProps, isProps, onTests, onHighlights, onShare, onDelete, shouldHide=false, propsBtn = true, imgSrc = null, work=true}) => {
    
    const bookNameRef = useRef(null);
    const [showFullName, setShowFullName] = useState(true);
    
    useEffect(() => {
        if (bookNameRef.current) {
            if ((bookNameRef.current.scrollWidth > 100 && className !== 'prev-folder') ||
                (bookNameRef.current.scrollWidth > 150 && className === 'prev-folder')
            ) {
            setShowFullName(false);
        } else {
            setShowFullName(true);
        }
        }
        return () => {};
    }, [bookNameRef, buttonText]);
    
    return (
        <div className={`button ${isProps ? 'expanded' : ''} ${className}  ${shouldHide ? 'hide' : ''} ${work ? '':'off'}`}>
            <div className='book-file' onClick={
                work?
                    () => { onClick(); }
                    :
                    () => {}
            }>
                {imgSrc===null ?
                    <div className={`container `}>
                        {propsBtn ?
                        <Icon name="dots"
                            // className="icon-horizontal"
                            onClick={(e) => { e.stopPropagation(); onProps(); }}
                            src={<Dots className='icon dots'/>} /> :
                            null}
                        <div className={`text-container ${className} ${showFullName?'':'masked'}`}>
                            <div className={`text ${className}`} ref={bookNameRef}>{buttonText}</div>
                        </div>
                    </div> :
                    (imgSrc)
                }
                
            </div>
            {propsBtn && work?
                <div className="props">
                    {/* <Button string="Chapter" /> */}
                    <Button string="Tests" onClick={(e) => { e.stopPropagation(); onTests(); }} />
                    <Button string="Highlights" onClick={(e) => { e.stopPropagation(); onHighlights(); }} />
                    <Button string="Delete" onClick={(e) => { e.stopPropagation(); onDelete(); }}/>
                </div> :
                null
            }
            
        </div>
    )
}
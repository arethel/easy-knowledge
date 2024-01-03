import React from "react";
import { Icon } from "../../reusableComponents/icons/Icons.jsx"
import { Button } from "../../reusableComponents/button/Button.jsx"
import { ReactComponent as Dots } from '../../../../images/dots.svg';
import "./style.css";

export const BookButton = ({ className = '', buttonText, onClick, onProps, isProps, onTests, onShare, onDelete, shouldHide=false, propsBtn = true, imgSrc = null }) => {
    
    return (
        <div className={`button ${isProps ? 'expanded' : ''} ${className}  ${shouldHide ? 'hide' : ''}`}>
            <div className='book-file' onClick={() => { onClick(); }}>
                {imgSrc===null ?
                    <div>
                        {propsBtn ?
                        <Icon name="dots"
                            // className="icon-horizontal"
                            onClick={(e) => { e.stopPropagation(); onProps(); }}
                            src={<Dots className='icon dots'/>} /> :
                        null}
                        <div className={"text " + className}>{buttonText}</div>
                    </div> :
                    (imgSrc)
                }
                
            </div>
            {propsBtn ?
                <div className="props">
                    {/* <Button string="Chapter" /> */}
                    <Button string="Tests" onClick={(e) => { e.stopPropagation(); onTests(); }}/>
                    <Button string="Delete" onClick={(e) => { e.stopPropagation(); onDelete(); }}/>
                </div> :
                null
            }
            
        </div>
    )
}
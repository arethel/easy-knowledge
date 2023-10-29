import React from "react";
import { Icon } from "../../reusableComponents/icons/Icons.jsx"
import { Button } from "../../reusableComponents/button/Button.jsx"
import { ReactComponent as Dots } from '../../../../images/dots.svg';
import "./style.css";

export const BookButton = ({className='', buttonText, onProps, isProps, propsBtn = true, imgSrc = null}) => {
    return (
        <div className={`button ${isProps ? 'expanded' : ''} ${className}`}>
            <div className='book-file'>
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
                    <Button string="Chapter" />
                    <Button string="Share" />
                    <Button string="Delete" />
                </div> :
                null
            }
            
        </div>
    )
}
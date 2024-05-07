import React from 'react';
import { IconContext } from 'react-icons';
import { IoIosCheckmarkCircle } from 'react-icons/io';

export const Icon = () => {
    return (
        <div style={{
            padding: '2px 10px',
        }}>
            <IconContext.Provider value={{ color: '#5d20a9', size: '24px', margin: '0px 10px 0px 0px', padding: '5px 0px 0px 0px' }}>
                <IoIosCheckmarkCircle />
            </IconContext.Provider>
        </div>
    );
};

import './style.css'
import React, { useState, useEffect } from 'react'
import { SubType } from './sub_type/SubType'
import { BsFillCheckCircleFill, BsFillXCircleFill } from 'react-icons/bs';
import { ReactComponent as Cross } from '../images/cross.svg';
import { Icon } from '../books_reading/components/reusableComponents/icons/Icons';

export const SubscribtionWindow = ({ active, setActive, userData, client }) => {
    
    useEffect(() => {
        const handleScroll = (event) => {
            if (active) {
                event.preventDefault();
            }
        };

        if (active) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }

        window.addEventListener('scroll', handleScroll, { passive: false });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [active]);
    
    const closeSubscribtions = () => {
        setActive(false);
    }
    
    return (
        <>
            {active ?
                <div className='subscribtion-window'>
                    <div className='panel'>
                        <Icon
                            name = 'cross'
                            className="subscribtion-cross"
                            src={<Cross />}
                            onClick={(e) => { e.stopPropagation(); closeSubscribtions(); }}
                        />
                        <div className='sub-types-container'>
                            <SubType title={'Options'} only_text={true} options={
                                [
                                    { item: 'Basic' },
                                    { item: 'Advanced' },
                                    { item: 'Pro' },
                                    { item: 'Base' },
                                    { item: 'Learner' },
                                    { item: 'Fast Learner' },
                                    { item: <BsFillCheckCircleFill className='icon'/> },
                                    { item: <BsFillXCircleFill className='icon' /> },
                                ]
                             } />
                            <SubType title={ 'Base' } options={
                                [
                                    { item: '1 per day' },
                                    { item: '2' },
                                    { item: '3' },
                                    { item: '4' },
                                    { item: '5' },
                                    { item: '6' },
                                    { item: <BsFillCheckCircleFill className='icon' style={{
                                        color: 'var(--collection-1-green)',
                                    }} /> },
                                    { item: <BsFillXCircleFill className='icon' style={{
                                        color: 'var(--collection-1-grey)',
                                    }}/> },
                                ]
                             } />
                            <SubType title={ 'Learner' } options={
                                [
                                    { item: '1 per day' },
                                    { item: '2' },
                                    { item: '3' },
                                    { item: '4' },
                                    { item: '5' },
                                    { item: '6' },
                                    { item: <BsFillCheckCircleFill className='icon' style={{
                                        color: 'var(--collection-1-green)',
                                    }} /> },
                                    { item: <BsFillXCircleFill className='icon' style={{
                                        color: 'var(--collection-1-grey)',
                                    }}/> },
                                ]
                             } />
                            <SubType title={ 'Fast Learner' } options={
                                [
                                    { item: '1 per day' },
                                    { item: '2' },
                                    { item: '3' },
                                    { item: '4' },
                                    { item: '5' },
                                    { item: '6' },
                                    { item: <BsFillCheckCircleFill className='icon' style={{
                                        color: 'var(--collection-1-gold)',
                                    }}/> },
                                    { item: <BsFillXCircleFill className='icon' style={{
                                        color: 'var(--collection-1-grey)',
                                    }}/> },
                                ]
                             } />
                        </div>
                    </div>
                </div >:
                <></>}
        </>
    );
}
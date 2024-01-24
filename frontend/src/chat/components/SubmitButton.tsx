import React from 'react';
import {EllipsisHorizontalIcon, PaperAirplaneIcon} from '@heroicons/react/24/outline';
import './SubmitButton.css';
import Tooltip from "./Tooltip";
import { useTranslation } from 'react-i18next';
import {SendIcon} from "../../svg";

interface SubmitButtonProps {
    loading: boolean;
    disabled: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({loading, disabled}) => {
    const { t } = useTranslation();
    const strokeColor = disabled ? 'currentColor' : 'white';

    return (
        <Tooltip title={t('send-message')} side="top" sideOffset={0}>
            {/* <button
                type="submit"
                disabled={loading || disabled}
                className="absolute p-1 rounded-md bottom-1.5 md:bottom-2.5 hover:bg-gray-100 enabled:dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent right-2 md:right-3 disabled:opacity-40"
                style={disabled ? {} : {backgroundColor: "rgb(0,0,0)"}}
            >
                {loading ? (
                    <EllipsisHorizontalIcon className="animate-ellipsis-pulse" width={24} height={24}
                                            stroke={strokeColor}/>
                ) : (
                    <PaperAirplaneIcon width={24} height={24} stroke={strokeColor}/>
                )}
            </button> */}
            <button
            type="submit"
            disabled={loading || disabled}
            style={disabled ? {} : {backgroundColor: "rgb(0,0,0)"}}
            className="absolute md:bottom-3 md:right-3 dark:hover:bg-gray-900 dark:disabled:hover:bg-transparent right-2 dark:disabled:bg-white disabled:bg-black disabled:opacity-10 disabled:text-gray-400 enabled:bg-black text-white p-0.5 border border-black rounded-lg dark:border-white dark:bg-white bottom-1.5 transition-colors">
                {loading ? (
                    <EllipsisHorizontalIcon className="animate-ellipsis-pulse" width={24} height={24}
                                            stroke={strokeColor}/>
                ) : (
                    <SendIcon/>
                )}
            </button>
        </Tooltip>
    );
};

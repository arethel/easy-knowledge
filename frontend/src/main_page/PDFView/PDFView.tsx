import * as React from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { toolbarPlugin, ToolbarSlot } from '@react-pdf-viewer/toolbar';
import { themePlugin } from '@react-pdf-viewer/theme';
import { ThemeContext } from '@react-pdf-viewer/core';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';
import './style.css';

interface CustomToolbarExampleProps {
    fileUrl: string;
}

export const PDFView = ({ fileUrl, currentPage, showPDF }) => {
    const [currentTheme, setCurrentTheme] = React.useState(typeof localStorage !== 'undefined' && localStorage.getItem('current-theme')
        ? localStorage.getItem('current-theme')
        : 'light');
    const themeContext = { currentTheme, setCurrentTheme };

    const toolbarPluginInstance = toolbarPlugin();
    const { Toolbar } = toolbarPluginInstance;
    const themePluginInstance = themePlugin();
    const { SwitchThemeButton } = themePluginInstance;

    const handleSwitchTheme = (theme: string) => {
        localStorage.setItem('current-theme', theme);
    };
    
    return (
        <div className={`pdf-container ${showPDF ? '' : 'invisible'}`}>
            <div
                className={`rpv-core__viewer rpv-core__viewer--${currentTheme === 'dark' ? 'dark' : 'light'}`}
                style={{
                    border: '1px solid rgba(0, 0, 0, 0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                }}
            >
                <div
                    style={{
                        alignItems: 'center',
                        backgroundColor: currentTheme === 'dark' ? '#333' : '#eeeeee',
                        color: currentTheme === 'dark' ? '#fff' : '#333',
                        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        padding: '4px',
                        position: 'sticky', // Make the toolbar sticky
                        top: '0', // Stick to the top
                        zIndex: '1000', // Adjust z-index as needed
                    }}
                >
                    <Toolbar>
                        {(props: ToolbarSlot) => {
                            const {
                                CurrentPageInput,
                                Download,
                                EnterFullScreen,
                                GoToNextPage,
                                GoToPreviousPage,
                                NumberOfPages,
                                Print,
                                ShowSearchPopover,
                                Zoom,
                                ZoomIn,
                                ZoomOut,
                            } = props;
                            return (
                                <>
                                    <div style={{ padding: '0px 2px' }}>
                                        <ShowSearchPopover />
                                    </div>
                                    <div style={{ padding: '0px 2px' }}>
                                        <ZoomOut />
                                    </div>
                                    <div style={{ padding: '0px 2px' }}>
                                        <Zoom />
                                    </div>
                                    <div style={{ padding: '0px 2px' }}>
                                        <ZoomIn />
                                    </div>
                                    <div style={{ padding: '0px 2px', marginLeft: 'auto' }}>
                                        <GoToPreviousPage />
                                    </div>
                                    <div style={{ margin: '0px 6px', width: '4rem' }}>
                                        <CurrentPageInput />
                                    </div>
                                    <div style={{ margin: '0px 6px' }}>
                                        / <NumberOfPages />
                                    </div>
                                    <div style={{ padding: '0px 2px' }}>
                                        <GoToNextPage />
                                    </div>
                                    <div style={{ padding: '0px 2px', marginLeft: "auto" }}>
                                        <ThemeContext.Provider value={themeContext}>
                                            <SwitchThemeButton />
                                        </ThemeContext.Provider>
                                    </div>
                                    <div style={{ padding: '0px 2px'}}>
                                        <EnterFullScreen />
                                    </div>
                                    <div style={{ padding: '0px 2px' }}>
                                        <Download />
                                    </div>
                                    <div style={{ padding: '0px 2px' }}>
                                        <Print />
                                    </div>
                                </>
                            );
                        }}
                    </Toolbar>
                </div>
                <div
                    style={{
                        flex: 1,
                        overflow: 'hidden',
                    }}
                >
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                        <Viewer
                            fileUrl={fileUrl}
                            plugins={[toolbarPluginInstance, themePluginInstance]}
                            defaultScale={1}
                            theme={currentTheme}
                            onSwitchTheme={handleSwitchTheme}
                        />
                    </Worker>
                </div>
            </div>
        </div>
    );
};

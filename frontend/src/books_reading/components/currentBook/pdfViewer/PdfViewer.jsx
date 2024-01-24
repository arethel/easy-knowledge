import React, {useEffect, useRef} from 'react';
import { Worker, Viewer, SpecialZoomLevel, PageLayout } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import './style.css';



export const PdfViewer = ({ pdfUrl, currentPage, setCurrentPage, maxWidth_, pageNavigationPluginInstance, pages, setPages }) => {
    
    const pageLayout = {
        buildPageStyles: ({ numPages, pageIndex }) => {
            if (pages !== numPages){
                setPages(numPages);
            }
            
        },
    };
    
    const handlePageChange = (e) => {
        setCurrentPage(e.currentPage);
    };
    
    return (
        <div className='pdf-viewer-container' style={{maxWidth:maxWidth_}}>
            {pdfUrl === '' ?
                null :
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                    <div className='viewer-container'>
                        <Viewer
                            fileUrl={pdfUrl}
                            onPageChange={handlePageChange}
                            initialPage={currentPage}
                            defaultScale={SpecialZoomLevel.PageWidth}
                            theme='dark'
                            plugins={[pageNavigationPluginInstance]}
                            pageLayout={pageLayout}
                        />
                    </div>
                
                </Worker>
            }
            
        </div>
    );
};


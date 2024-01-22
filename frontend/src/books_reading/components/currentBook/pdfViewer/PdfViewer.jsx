import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import './style.css';

export const PdfViewer = ({ pdfUrl }) => {
    
    return (
        <div className='pdf-viewer-container'>
            {pdfUrl === '' ?
                null :
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                    <div className='viewer-container'>
                        <Viewer fileUrl={pdfUrl} />
                    </div>
                
                </Worker>
            }
            
        </div>
    );
};


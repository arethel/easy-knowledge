import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

export const PDFView = () => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        toolbar: {
            layout: [
                'zoomOut', 'zoomIn', 'spacer', 'currentPage', 'pageNavigation', 'spacer', 'print'
            ],
            show: {
                always: true,
            },
        },
    });

    return (
        <div className="pdf-container">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                <Viewer 
                    fileUrl="./file/Gibel_Imperii_Gaidar.pdf"
                    plugins={[defaultLayoutPluginInstance]}
                />
            </Worker>
        </div>
    );
};

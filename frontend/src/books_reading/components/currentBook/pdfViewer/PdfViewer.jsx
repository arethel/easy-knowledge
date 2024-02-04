import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Worker, Viewer, SpecialZoomLevel, PageLayout } from '@react-pdf-viewer/core';
import { highlightPlugin, HighlightArea, SelectionData, RenderHighlightTargetProps } from '@react-pdf-viewer/highlight';
import '@react-pdf-viewer/highlight/lib/styles/index.css';
import '@react-pdf-viewer/core/lib/styles/index.css';
import './style.css';

import {
    useContextMenu,
} from "react-contexify";

import { Rectangle } from './selectRectangle/SelectRectangle.jsx';

export const PdfViewer = ({ pdfUrl, currentPage, setCurrentPage, maxWidth_, pageNavigationPluginInstance, pages, setPages }) => {
    
    const { show } = useContextMenu({
        id: 'book-menu',
    });
    
    const [pagesContainer, setPagesContainer] = useState(null);
    
    const onDocumentLoad = async (e) => {
        setPages(e.doc.numPages);
        const el = pdfViewerRef.current.querySelector('.rpv-core__inner-pages').children[0];
        setPagesContainer(el);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setDocumentUpdated(!documentUpdated)
    };
    const [documentUpdated, setDocumentUpdated] = useState(false);
    
    const handlePageChange = (e) => {
        setCurrentPage(e.currentPage);
        setDocumentUpdated(!documentUpdated)
    };
    
    const [showRectangle, setShowRectangle] = useState(false);
    const [startPosition, setStartPosition] = useState(null);
    const [endPosition, setEndPosition] = useState(null);
    const [mouseDown, setMouseDown] = useState(false);
    
    const handleMouseDown = (e) => {
        if (e.srcElement.className !== 'rpv-core__text-layer') {
            setShowRectangle(false);
            return;
        }
        setShowRectangle(true);
        const { offsetX, offsetY, layerX, layerY } = e;
        const page = parseInt(e.srcElement.offsetParent.attributes[2].value);
        const { clientHeight, clientWidth } = e.srcElement;
        setMouseDown(true);
        setStartPosition({ x: offsetX, y: offsetY, page: page, rectX: layerX, rectY: layerY, height: clientHeight, width: clientWidth });
        setEndPosition(null);
    };
    
    const handleMouseUp = (e) => {
        if (mouseDown === false) return;
        const { offsetX, offsetY, layerX, layerY } = e;
        const rectSize = Math.abs(startPosition.rectX - layerX) * Math.abs(startPosition.rectY - layerY);
        if (rectSize < 1000) {
            setMouseDown(false);
            setShowRectangle(false);
            return;
        }
        const page = parseInt(e.srcElement.offsetParent.attributes[2].value);
        const { clientHeight, clientWidth } = e.srcElement;
        const selection = window.getSelection();
        if (selection) {
            selection.removeAllRanges();
        }
        setMouseDown(false);
        setEndPosition({ x: offsetX, y: offsetY, page: page, rectX: layerX, rectY: layerY, height: clientHeight, width: clientWidth });
    };
    
    const handleMouseMove = (e) => {
        if (!mouseDown) return;
        const { offsetX, offsetY, layerX, layerY } = e;
        const page = parseInt(e.srcElement.offsetParent.attributes[2].value);
        const { clientHeight, clientWidth } = e.srcElement;
        setEndPosition({ x: offsetX, y: offsetY, page: page, rectX: layerX, rectY: layerY, height: clientHeight, width: clientWidth });
    };
    
    const handleClick = (e) => {
        if (
            showRectangle &&
            !mouseDown &&
            e.srcElement.className === "rpv-core__text-layer"
        )
            show({
                event: e,
                props: {
                    startPosition: startPosition,
                    endPosition: endPosition,
                    showRectangle: showRectangle,
                },
            });
    };
    
    useEffect(() => {
        const elements = Array.from(document.querySelectorAll('.rpv-core__text-layer'));
        elements.forEach((element) => {
            element.addEventListener('mousedown', handleMouseDown);
            element.addEventListener('mousemove', handleMouseMove);
            element.addEventListener('mouseup', handleMouseUp);
            element.addEventListener('click', handleClick);
        });
      
        return () => {
            elements.forEach((element) => {
                element.removeEventListener('mousedown', handleMouseDown);
                element.removeEventListener('mousemove', handleMouseMove);
                element.removeEventListener('mouseup', handleMouseUp);
                element.removeEventListener('click', handleClick);
            });
        };
    }, [documentUpdated, setDocumentUpdated, startPosition, setStartPosition, endPosition, setEndPosition]);
    
    useEffect(() => {
        const elements = Array.from(document.querySelectorAll('.rpv-core__text-layer-text'));
        elements.forEach((element) => {
            if (mouseDown) {
                element.classList.add('not-clickable')
            } else {
                element.classList.remove('not-clickable')
            }
        });
        return () => { };
    }, [mouseDown]);
    
    useEffect(() => {
        console.log(startPosition, endPosition)
        return () => { };
    }, [endPosition]);
    
    const pdfViewerRef = useRef(null);
    
    return (
        <div className='pdf-viewer-container' style={{ maxWidth: maxWidth_ }} ref={pdfViewerRef}>
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
                            onDocumentLoad={(e) => { onDocumentLoad(e); }}
                        />
                    </div>
                    {pagesContainer ? createPortal(<Rectangle
                        x1={startPosition?.rectX}
                        y1={startPosition?.rectY}
                        x2={endPosition?.rectX}
                        y2={endPosition?.rectY}
                        show={showRectangle}
                    />,
                        pagesContainer) : null}
                </Worker>
            }
            
        </div>
    );
};


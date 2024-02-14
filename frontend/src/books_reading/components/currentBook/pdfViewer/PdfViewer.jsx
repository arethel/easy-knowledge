import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Worker, Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { highlightPlugin, Trigger} from '@react-pdf-viewer/highlight';
import '@react-pdf-viewer/highlight/lib/styles/index.css';
import '@react-pdf-viewer/core/lib/styles/index.css';
import './style.css';

import {
    useContextMenu,
} from "react-contexify";

import { Rectangle } from './selectRectangle/SelectRectangle.jsx';

export const PdfViewer = ({
    pdfUrl,
    book_id,
    setBooksInfo,
    booksInfo,
    currentPage,
    setCurrentPage,
    maxWidth_,
    pageNavigationPluginInstance,
    pages,
    setPages,
    client,
    highlightAreas,
    setHighlightAreas,
    setHighlightPluginInstance
    }) => {
    
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
            let { offsetX, offsetY, layerX, layerY } = e;
            const toElement = e.toElement;
            offsetX += toElement.offsetLeft;
            offsetY += toElement.offsetTop;
            const { clientHeight, clientWidth } = e.srcElement.offsetParent;
            const page = parseInt(e.srcElement.dataset.highlightTextPage);
            setStartPosition({ x: offsetX, y: offsetY, page: page, rectX: layerX, rectY: layerY, height: clientHeight, width: clientWidth });
            console.log({ x: offsetX, y: offsetY, page: page, rectX: layerX, rectY: layerY, height: clientHeight, width: clientWidth });
            if (showRectangle)
                setShowRectangle(false);
            return;
        }
        const { offsetX, offsetY, layerX, layerY } = e;
        const { clientHeight, clientWidth } = e.srcElement;
        const page = parseInt(e.srcElement.offsetParent.attributes[2].value);
        setStartPosition({ x: offsetX, y: offsetY, page: page, rectX: layerX, rectY: layerY, height: clientHeight, width: clientWidth });
        console.log({ x: offsetX, y: offsetY, page: page, rectX: layerX, rectY: layerY, height: clientHeight, width: clientWidth });
        setMouseDown(true);
        setShowRectangle(true);
        setEndPosition(null);
    };
    
    const handleMouseUp = (e) => {
        if (mouseDown === false) return;
        const { offsetX, offsetY, layerX, layerY } = e;
        const rectSize = Math.abs(startPosition.rectX - layerX) * Math.abs(startPosition.rectY - layerY);
        
        const selection = window.getSelection();
        if (selection) {
            selection.removeAllRanges();
        }
        
        if (rectSize < 1000) {
            if (mouseDown)
                setMouseDown(false);
            if (showRectangle)
                setShowRectangle(false);
            return;
        }
        const page = parseInt(e.srcElement.offsetParent.attributes[2].value);
        const { clientHeight, clientWidth } = e.srcElement;
        
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
                    highlightAreas_: highlightAreas,
                    setHighlightAreas_: setHighlightAreas,
                    book_id_: book_id,
                    client_: client,
                },
            });
        
        if (highlightProps !== null) {
            show({
                event: e,
                props: {
                    textHighlightProps: textHighlightProps,
                    setHighlightAreas_: setHighlightAreas,
                    highlightAreas_: highlightAreas,
                    book_id_: book_id,
                    client_: client,
                },
            });
            highlightProps = null;
        }
        
    };
    
    useEffect(() => {
        if (booksInfo[book_id] === undefined) return;
        setHighlightAreas(booksInfo[book_id].highlights);
        return () => { }
    }, [booksInfo, book_id]);
    
    let highlightProps = null;
    const [textHighlightProps, setTextHighlightProps] = useState({selectedText:null});
    
    const renderHighlights = (props) => {
        // console.log(props);
        return(
        <div>
                {highlightAreas.map((highlight, idx) => {
                    return highlight.areas.map((area, index) => {
                        if (area.pageIndex === props.pageIndex)
                            return (
                                <div
                                    key={index}
                                    className="highlight-area"
                                    style={Object.assign(
                                        {},
                                        {
                                            background: 'yellow',
                                            opacity: 0.4,
                                        },
                                        props.getCssProperties(area, props.rotation)
                                    )}
                                />
                            );
                        
                    });
                })}
        </div>
    )};
    
    
    const renderHighlightTarget = (props) => {
        highlightProps = props;
        if (textHighlightProps.selectedText !== props.selectedText) {
            setTextHighlightProps(props);
        }
    };
    
    const highlightPluginInstance = highlightPlugin({
        renderHighlights,
        renderHighlightTarget,
        // trigger: Trigger.None,
    });
    
    useEffect(() => {
        setHighlightPluginInstance(highlightPluginInstance);
        return () => { }
    }, []);
    
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
    }, [documentUpdated, setDocumentUpdated, startPosition, setStartPosition, endPosition, setEndPosition, textHighlightProps]);
    
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
    
    const pdfViewerRef = useRef(null);
    
    return (
        <div
            className='pdf-viewer-container'
            style={{ maxWidth: maxWidth_ }}
            ref={pdfViewerRef}
            onContextMenu={(e) => {
                show({
                    event: e,
                    props: {
                        startPosition: startPosition,
                        endPosition: endPosition,
                        showRectangle: showRectangle,
                        highlightAreas_: highlightAreas,
                        setHighlightAreas_: setHighlightAreas,
                        book_id_: book_id,
                        client_: client,
                    },
                });
            }}>
            {pdfUrl === '' ?
                null :
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js" >
                    <div className='viewer-container'>
                        <Viewer
                            fileUrl={pdfUrl}
                            onPageChange={handlePageChange}
                            initialPage={currentPage}
                            defaultScale={SpecialZoomLevel.PageWidth}
                            theme='dark'
                            plugins={[pageNavigationPluginInstance, highlightPluginInstance]}
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


import React, { useEffect, useRef, useState } from "react";
import "./style.css";

import { PagesCount } from "./pagesCount/PagesCount.jsx";
import { Paragraph } from "./paragraph/Paragraph.jsx";
import { EndOfParagraph } from "./endOfParagraph/EndOfParagraph.jsx";
import { NewChapter } from "./newChapter/NewChapter";
import { PdfViewer } from "./pdfViewer/PdfViewer.jsx";

import { BookMenu } from "./menu/BookMenu.jsx"
import {
    useContextMenu,
} from "react-contexify";

import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';
import '@react-pdf-viewer/page-navigation/lib/styles/index.css';

export const Book = ({
    booksDictionary,
    book_id,
    client,
    loadedEpubs,
    booksInfo,
    setBooksInfo,
    highlightAreas,
    setHighlightAreas,
    highlightPluginInstance,
    setHighlightPluginInstance,
    }) => {
    const [showPDF, setShowPDF] = useState(false);
    
    const pageNavigationPluginInstance = pageNavigationPlugin();
    const { CurrentPageInput, NumberOfPages } = pageNavigationPluginInstance;
    
    const [paragraphs, setParagraphs] = useState([]);
    const [pages, setPages] = useState(0);
    
    const [currentPage, setCurrentPage] = useState({});
    const [openedPages, setOpenedPages] = useState({});
    const minPagesCount = 10;
    const pagesCountUpdateStep = 2;

    const togglePDFView = () => setShowPDF(!showPDF);
    
    const getBookInfo = async () => {
        try {
            const response = await client.get(`api/book/info?book_id=${book_id}`);
            if (response.data.error === 0) {
                const newBooksInfo = { ...booksInfo };
                newBooksInfo[book_id] = response.data.book_info;
                setBooksInfo(newBooksInfo);
            }
            console.log('getBookInfo',response.data);
            return response.data.book_info;
        } catch (error) {
            console.error("Error fetching book info:", error);
        }
        return undefined;
    }
    
    const lastPage = useRef(-1);
    const saveBookPage = async () => {
        try {
            if (currentPage[book_id] === lastPage.current) return;
            lastPage.current = currentPage[book_id];
            const response = await client.post(`api/book/info/`, { book_id: book_id, page: currentPage[book_id] });
            if (response.data.error === 0) {
                console.log("Book page saved", currentPage[book_id]);
            }
        } catch (error) {
            console.error("Error saving book page:", error);
        }
    }
    
    useEffect(() => {
        const interval = setInterval(() => {
            saveBookPage();
        }, 1000);
        return () => clearInterval(interval);
    }, [currentPage]);
    
    // const loadPages = async (page1, page2) => {
    //     // console.log(page1, page2);
    //     const newOpenedPages = {...openedPages};
    //     let k = page1;
    //     let endPage = page2;
    //     while (k < endPage) {
    //         if (newOpenedPages[k] === undefined) {
    //             await loadedEpubs[book_id].get_by_page(k).then((newParagraphs) => {
    //                 newOpenedPages[k] = newParagraphs;
    //             });
    //             setParagraphs([].concat(...Object.values(newOpenedPages)));
    //         }
    //         k += 1;
    //     }
    //     setOpenedPages(newOpenedPages);
    //     setParagraphs([].concat(...Object.values(newOpenedPages)));
    // }
    
    const [pdfViewers, setPdfViewers] = useState({});
    const updatePdfViewer = (bookId, pdfViewerComponent) => {
        if (pdfViewers[bookId] === undefined)
            setPdfViewers(prevState => ({
            ...prevState,
            [bookId]: pdfViewerComponent
            }));
    };
    
    const deletePdfViewer = (bookId) => {
        const newPdfViewers = { ...pdfViewers };
        delete newPdfViewers[bookId];
        setPdfViewers(newPdfViewers);
    };
    
    useEffect(() => {
        if (booksDictionary.selected === undefined) return () => { };
        Object.keys(pdfViewers).forEach((bookId) => { 
            if (booksDictionary[bookId] === undefined) deletePdfViewer(bookId);
        })
        
        return () => { };
    }, [booksDictionary]);
    
    const renderPdfViewer = (book_id) => {
        const PdfViewerComponent = pdfViewers[book_id];
        return PdfViewerComponent ? <PdfViewerComponent /> : null;
    };
    
    useEffect(() => {
        console.log(loadedEpubs, book_id);
        if (loadedEpubs[book_id] === undefined) return () => { };
        if (pdfViewers[book_id] === undefined) {
            getBookInfo().then((bookInfo) => {
                console.log(bookInfo);
                if (bookInfo === undefined) return;
                if (currentPage[book_id] !== bookInfo.page)
                    setCurrentPage({ ...currentPage, [book_id]: bookInfo.page })
                
                if (pdfViewers[book_id] === undefined) {
                    console.log('updatePdfViewer');
                    updatePdfViewer(book_id, () => (
                        <PdfViewer
                            pdfUrl={loadedEpubs[book_id] === undefined ? '' : loadedEpubs[book_id]}
                            book_id={book_id}
                            booksInfo={{[book_id]: bookInfo}}
                            setBooksInfo={setBooksInfo}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            pageNavigationPluginInstance={pageNavigationPluginInstance}
                            maxWidth_={TopBarWidth}
                            setPages={setPages}
                            pages={pages}
                            client={client}
                            highlightAreasInit={booksInfo[book_id] === undefined ? [] : booksInfo[book_id].highlights}
                            highlightAreasBooks={highlightAreas}
                            setHighlightAreasBooks={setHighlightAreas}
                            setHighlightPluginInstance={setHighlightPluginInstance}
                        />
                    ));
                }
            });
            
        }
        
        return () => { };
    }, [book_id, loadedEpubs, booksInfo]);
    
    const bookRef = useRef(null);
    
    // useEffect(() => {
    //     if (loadedEpubs[book_id] === undefined) return () => { };
        
    //     let k = Math.max(currentPage - Math.floor(minPagesCount / 2), 0)
    //     let endPage = k + minPagesCount;
    //     loadPages(k, endPage);
        
    //     return () => { };
    // }, [currentPage]);
    
    const [constantHeight, setConstantHeight] = useState("960px");
    const [TopBarWidth, setTopBarWidth] = useState("1000px");
    const sideId = "side-bar";
    const topId = "top-bar";
    const resizeObserver = useRef(null);
    const resizeObserver2 = useRef(null);

    useEffect(() => {
        const elementToWatch = document.getElementById(sideId);
        const elementToWatch2 = document.getElementById(topId);

        if (elementToWatch && elementToWatch2) {
            resizeObserver.current = new ResizeObserver((entries) => {
                for (let entry of entries) {
                    const height1 = entry.contentRect.height;
                    const height2 = elementToWatch2.clientHeight;
                    const newHeight = `${height1 - height2}px`;
                    setConstantHeight(newHeight);
                }
            });

            resizeObserver.current.observe(elementToWatch);
            
            resizeObserver2.current = new ResizeObserver((entries) => {
                for (let entry of entries) {
                    const width2 = entry.contentRect.width;
                    if (width2 < 1000) {
                        setTopBarWidth(`${width2}px`);
                    }
                }
            });
            
            resizeObserver2.current.observe(elementToWatch2);
        }

        return () => {
            if (resizeObserver.current) {
                resizeObserver.current.disconnect();
            }
            if (resizeObserver2.current) {
                resizeObserver2.current.disconnect();
            }
        };
    }, [sideId, topId]);
    return (
        <div className="book" ref={bookRef} style={{ height: constantHeight }} >
            <PagesCount page={currentPage[book_id]===undefined? 1: currentPage[book_id]+1} totalPages={pages[book_id]?pages[book_id]:0} /> 
            {Object.keys(pdfViewers).length > 0 ? Object.keys(pdfViewers).map((bookId, index) => {
                return (
                    <div key={index} className={`pdf-viewer-container ${bookId!=book_id?'hide':''}`}>
                        {renderPdfViewer(bookId)}
                    </div>
                );
                
            }) : null}
            
            <BookMenu/>
        </div>
    );
};

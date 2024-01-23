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

export const Book = ({ book_id, client, loadedEpubs }) => {
    const [showPDF, setShowPDF] = useState(false);
    
    const pageNavigationPluginInstance = pageNavigationPlugin();
    const { CurrentPageInput, NumberOfPages } = pageNavigationPluginInstance;
    
    const [paragraphs, setParagraphs] = useState([]);
    const [pages, setPages] = useState(0);
    const [booksInfo, setBooksInfo] = useState({});
    
    const [currentPage, setCurrentPage] = useState(-1);
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
            // console.log(response.data);
            return response.data.book_info;
        } catch (error) {
            console.error("Error fetching book info:", error);
        }
        return undefined;
    }
    
    const lastPage = useRef(-1);
    const saveBookPage = async () => {
        try {
            if (currentPage === lastPage.current) return;
            lastPage.current = currentPage;
            const response = await client.post(`api/book/info/`, { book_id: book_id, page: currentPage });
            if (response.data.error === 0) {
                console.log("Book page saved", currentPage);
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
    
    useEffect(() => {
        console.log(loadedEpubs, book_id);
        if (loadedEpubs[book_id] === undefined) return () => { };
        
        
        // loadedEpubs[book_id].getBookLength().then((length) => {
        //     setPages(length);
        // });
        
        
        
        getBookInfo().then((bookInfo) => {
            console.log(bookInfo);
            if (bookInfo === undefined) return;
            setCurrentPage(bookInfo.page)
        });
        
        return () => { };
    }, [book_id, loadedEpubs]);
    
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
    
    // const getUpperVisibleDiv = () => {
    //     const content = scrollRef.current;
    //     if (content) {
    //         const { scrollTop, clientHeight } = content;
    //         const divs = document.querySelectorAll('.book-element.paragraph'); // Replace with your div selector
    
    //         for (let i = 0; i < divs.length; i++) {
    //             const div = divs[i];
    //             const { top, bottom } = div.getBoundingClientRect();
    //             if (top >= 0 && bottom <= clientHeight) {
    //                 // Return the div that is fully visible in the upper portion
    //                 return div;
    //             }
    //         }
    //     }
    //     return null;
    // };
    
    // const getPageFromClassName = (className) => {
    //     const match = className.match(/page-(\d+)/);
    //     if (match && match[1]) {
    //         return parseInt(match[1]);
    //     }
    //     return null;
    // };
    
    // const scrollRef = useRef(null);
    // const scrollSignal = 0.2;
    // useEffect(() => {
    //     const handleScroll = () => {
    //         const content = scrollRef.current;
    //         if (content) {
    //             const { scrollTop, scrollHeight, clientHeight } = content;
    //             const isAtBottom = scrollTop + clientHeight >= scrollHeight * (1 - scrollSignal);
    //             const isAtTop = scrollTop <= scrollHeight * scrollSignal;
    //             // console.log(content.scrollHeight > content.clientHeight);
    //             const upperVisibleDiv = getUpperVisibleDiv();
    //             const currentPage = upperVisibleDiv ? getPageFromClassName(upperVisibleDiv.className) : null;
    //             setCurrentPage(currentPage);
    //             // if (isAtBottom) {
    //             //     // Logic to add items at the bottom
    //             //     console.log("Reached bottom");
    //             // }

    //             // if (isAtTop) {
    //             //     // Logic to remove items from the top
    //             //     console.log("Reached top");
    //             // }
    //         }
    //     };

    //     const content = scrollRef.current;
    //     if (content) {
    //         content.addEventListener("scroll", handleScroll);
    //     }

    //     return () => {
    //         if (content) {
    //             content.removeEventListener("scroll", handleScroll);
    //         }
    //     };
    // }, []);
    
    const { show } = useContextMenu({
        id: 'book-menu',
    });
    
    return (
        <div className="book" ref={bookRef} style={{ height: constantHeight }} onContextMenu={(e)=>{show({event: e, });}}>
            {/* <div className="paragraphs" ref={scrollRef} style={{ height: constantHeight }}>
                {paragraphs.map((paragraph, index) => (
                    <Paragraph key={index} mainText={''} text={paragraph.content} page={Number(paragraph.page) + 1} />
                ))}
                {/*
                <EndOfParagraph/>
                <NewChapter text='New chapter'/>
            </div>*/}
            <PagesCount page={booksInfo[book_id]===undefined? 0: currentPage} totalPages={pages} /> 
            <PdfViewer
                pdfUrl={loadedEpubs[book_id] === undefined ? '' : loadedEpubs[book_id]}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                pageNavigationPluginInstance={pageNavigationPluginInstance}
                maxWidth_={TopBarWidth}
                setPages={setPages}
                pages={pages}
            />
            
            <BookMenu/>
        </div>
    );
};

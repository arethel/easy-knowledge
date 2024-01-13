import React, { useEffect, useRef, useState } from "react";
import "./style.css";

import { PagesCount } from "./pagesCount/PagesCount.jsx";
import { Paragraph } from "./paragraph/Paragraph.jsx";
import { EndOfParagraph } from "./endOfParagraph/EndOfParagraph.jsx";
import { NewChapter } from "./newChapter/NewChapter"; 
import { PDFView } from "../../../main_page/PDFView/PDFView.tsx";
import Button from '@mui/material/Button';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Tooltip } from "@mui/material";
import Fade from '@mui/material/Fade';


export const Book = ({book_id, client, loadedEpubs}) => {
    const [showPDF, setShowPDF] = useState(false);
    
    const [paragraphs, setParagraphs] = useState([]);
    const [pages, setPages] = useState(0);
    const [booksInfo, setBooksInfo] = useState({});
    
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
    
    const loadPages = async (page1, page2) => {
        const newOpenedPages = {};
        let k = page1;
        let endPage = page2;
        while (k < endPage) {
            if (openedPages[k]===undefined){
                await loadedEpubs[book_id].get_by_page(k).then((newParagraphs) => { 
                    newOpenedPages[k] = newParagraphs;
                    
                    console.log(newParagraphs);
                });
            }
            else {  
                newOpenedPages[k] = openedPages[k];
            }
            k += 1;
        }
        setOpenedPages(newOpenedPages);
        setParagraphs([].concat(...Object.values(newOpenedPages)));
    }
    
    useEffect(() => {
        // console.log(loadedEpubs, book_id);
        if (loadedEpubs[book_id] === undefined) return () => {};
        
        
        loadedEpubs[book_id].getBookLength().then((length) => {
            setPages(length);
        });
        
        getBookInfo().then((bookInfo) => {
            if (bookInfo === undefined) return;
            let k = Math.max(bookInfo.page - Math.floor(minPagesCount / 2), 0)
            let endPage = k + minPagesCount;
            loadPages(k, endPage);
            
        });
        
        return () => {};
    }, [book_id, loadedEpubs]);
    
    const [constantHeight, setConstantHeight] = useState("960px");
    const sideId = "side-bar";
    const topId = "top-bar";
    const resizeObserver = useRef(null);

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
        }

        return () => {
            if (resizeObserver.current) {
                resizeObserver.current.disconnect();
            }
        };
    }, [sideId, topId]);
    
    const scrollRef = useRef(null);
    const scrollSignal = 0.2;
    useEffect(() => {
        const handleScroll = () => {
            const content = scrollRef.current;
            if (content) {
                const { scrollTop, scrollHeight, clientHeight } = content;
                const isAtBottom = scrollTop + clientHeight >= scrollHeight*(1-scrollSignal);
                const isAtTop = scrollTop <= scrollHeight*scrollSignal;
                console.log(content.scrollHeight > content.clientHeight);
                if (isAtBottom) {
                    // Logic to add items at the bottom
                    console.log("Reached bottom");
                }

                if (isAtTop) {
                    // Logic to remove items from the top
                    console.log("Reached top");
                }
            }
        };

        const content = scrollRef.current;
        if (content) {
            content.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (content) {
                content.removeEventListener("scroll", handleScroll);
            }
        };
    }, []);
    
    return (
        <>
        <Tooltip
            enterDelay={500}
            leaveDelay={50}
            title={`${showPDF ? 'Hide PDF' : 'Show PDF'}`}
            placement="top">
                <Button
                    variant="text"
                    color="primary"
                    onClick={togglePDFView}
                    sx={{
                        border: 'none',
                        padding: '10px 0px',
                        minWidth: '30px',
                        width: '50px',
                        height: '50px',
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        outline: 'none',
                        position: 'absolute',
                        left: '0',
                        top: '450px',
                        transform: 'translateY(-50%)',
                        transition: 'background-color 0.3s ease',
                        alignItems: 'center',
                        zIndex: '1',
                    }}
                >
                    {showPDF ? <ArrowBackIosIcon sx={{ height: '1em', width: '1em'}}/> : <ArrowForwardIosIcon sx={{ height: '1em', width: '1em'}}/>}
                </Button>
        </Tooltip>
        <div>
            <PDFView fileUrl="./file/Gibel_Imperii_Gaidar.pdf" showPDF={showPDF}/>
        </div>
        {!showPDF && 
        <div className="book" >
            <div className="paragraphs" ref={scrollRef} style={{ height: constantHeight }}>
                {paragraphs.map((paragraph, index) => (
                    <Paragraph key={index} mainText={''} text={paragraph.content} />
                ))}
                {/*
                <EndOfParagraph/>
                <NewChapter text='New chapter'/>
                */}
            </div>
            <PagesCount page={booksInfo[book_id]===undefined? 0: booksInfo[book_id].page} totalPages={pages} />
        </div>}
        </>
    );
};

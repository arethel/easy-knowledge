import React, { useEffect, useRef, useState } from "react";
import "./style.css";

import { PagesCount } from "./pagesCount/PagesCount.jsx";
import { Paragraph } from "./paragraph/Paragraph.jsx";
import { EndOfParagraph } from "./endOfParagraph/EndOfParagraph.jsx";
import { NewChapter } from "./newChapter/NewChapter";

export const Book = () => {
    
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
    
    return (
        <div className="book" >
            <div className="paragraphs" style={{ height: constantHeight }}>
                <Paragraph mainText={'Cell Structure and Function:'} text={
                `Biology explores the fundamental unit of life, the
                cell. Cells are the building blocks of all living
                organisms and can vary in size and complexity. They
                are classified into two main categories: prokaryotic
                cells, lacking a true nucleus, and eukaryotic cells,
                which have a welsadfgasdgsagdasgdfasl-defined nucleus. Each cell carries
                out sp, such as metabolism,
                reproduction, and reasfdgasfgasfgasfgafgasponding to external stimuli  sadfsdagfsafgsafgasfg.  `} />
                <Paragraph mainText={'Cell Structure and Function:'} text={
                `Biology explores the fundamental unit of life, the
                cell. Cells are the building blocks of all living
                organisms and can vary in size and complexity. They
                are classified into two main categories: prokaryotic
                cells, lacking a true nucleus, and eukaryotic cells,
                which have a welsadfgasdgsagdasgdfasl-defined nucleus. Each cell carries
                out sp, such as metabolism,
                reproduction, and reasfdgasfgasfgasfgafgasponding to external stimuli  sadfsdagfsafgsafgasfg.  `} />
                <EndOfParagraph/>
                <NewChapter text='New chapter'/>
                
                
                <Paragraph mainText={''} text={
                `Ecology studies the relationships between organisms
                and their environments. Ecosystems consist of all
                living organisms and their physical surroundings.
                Topics in ecology include the flow of energy through
                food chains and webs, the cycling of nutrients, and
                the impact of human activities on ecosystems.`} />
                
                
            </div>
            <PagesCount page={100} totalPages={400} />
        </div>
    );
};

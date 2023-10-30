import React from "react";
import "./style.css";

import { PagesCount } from "./pagesCount/PagesCount.jsx";
import { Paragraph } from "./paragraph/Paragraph.jsx";

export const Book = () => {
    return (
        <div className="book">
            <div className="paragraphs">
                <Paragraph mainText={'Cell Structure and Function:'} text={
                `Biology explores the fundamental unit of life, the
                cell. Cells are the building blocks of all living
                organisms and can vary in size and complexity. They
                are classified into two main categories: prokaryotic
                cells, lacking a true nucleus, and eukaryotic cells,
                which have a welsadfgasdgsagdasgdfasl-defined nucleus. Each cell carries
                out sp, such as metabolism,
                reproduction, and reasfdgasfgasfgasfgafgasponding to external stimuli  sadfsdagfsafgsafgasfg.  `} />
                
                <div className="new-chapter">
                    <div className="overlap">
                        <div className="text-wrapper-2">New chapter</div>
                    </div>
                </div>
                
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

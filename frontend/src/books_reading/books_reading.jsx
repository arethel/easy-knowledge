import React, { useState, useRef, useEffect } from "react";

import { TopBar } from "./components/topBar/TopBar.jsx";
import { SideBar } from "./components/sideBar/SideBar.jsx";
import { Logo } from "./components/logo/Logo.jsx";
import { Book } from "./components/currentBook/Book.jsx";
import { Settings } from "./components/settings/Settings.jsx";
import { Tests } from "./components/tests/Tests.jsx";
import { Test } from "./components/test/Test.jsx";
import { Highlights } from "./components/highlights/Highlights.jsx";

import "./style.css";

const openedBooks_init = {
    selected: { id: -1 },
};

const booksInFolder_init = {
};

export const BooksReading = ({ userData, client, URL }) => { 
    const test = useRef(null);
    const tests = useRef(null);

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const [active, setActive] = useState(false);
    
    const [sectionName, setSectionName] = useState({id: -1, name: "Section Name"});
    const [openedBooks, setOpenedBooks] = useState(openedBooks_init);
    const [loadedEpubs, setLoadedEpubs] = useState({});
    const [booksInFolder, setBooksInFolder] = useState(booksInFolder_init);
    
    const [updateInfo, setUpdateInfo] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    
    useEffect(() => {
        const fetchBooksData = async () => {
        try {
            const response = await client.get("api/opened-books");
            setOpenedBooks(response.data.opened_books_data);
            console.log('check', response.data.opened_books_data);
            const lastSection = response.data.last_section_data
            setBooksInFolder(lastSection.sections);
            // console.log(lastSection);
            setSectionName({ id: lastSection.section_id, name: lastSection.section_name });
            // console.log({ id: lastSection.section_id, name: lastSection.section_name });
        } catch (error) {
            console.error("Error fetching books data:", error);
        }
        };

        fetchBooksData();
        return () => {};
    }, []);

    const [testsPanel, setTestsPanel] = useState(false);
    const [testPanel, setTestPanel] = useState(false);
    const [highlightsPanel, setHighlightsPanel] = useState(false);
    const [highlightAreas, setHighlightAreas] = useState([]);
    const [highlightPluginInstance, setHighlightPluginInstance] = useState(null);
    const [test_id, setTest_id] = useState(0);
    const [book_id, setBook_id] = useState(0);
    const [booksInfo, setBooksInfo] = useState({});

    return (
        <div className="book-page-container">
            {isSidebarOpen && (
                <SideBar
                    booksDictionary={booksInFolder}
                    setBooksDictionary={setBooksInFolder}
                    settingsSetActive={setActive}
                    pagesDictionary={openedBooks}
                    setPagesDictionary={setOpenedBooks}
                    setTestsPanel={setTestsPanel}
                    setHighlightsPanel={setHighlightsPanel}
                    setBook_id={setBook_id}
                    sectionName={sectionName}
                    setSectionName={setSectionName}
                    setUpdateInfo={setUpdateInfo}
                    updateInfo={updateInfo}
                    client={client}
                    loadedEpubs={loadedEpubs}
                    setLoadedEpubs={setLoadedEpubs}
                />
            )}
            <div className="main-container">
                <TopBar
                    booksDictionary={openedBooks}
                    setBooksDictionary={setOpenedBooks}
                    setTestsPanel={setTestsPanel}
                    setHighlightsPanel={setHighlightsPanel}
                    setBook_id={setBook_id}
                    setUpdateInfo={setUpdateInfo}
                    updateInfo={updateInfo}
                    client={client}
                    loadedEpubs={loadedEpubs}
                    setLoadedEpubs={setLoadedEpubs}
                    isSidebarOpen={isSidebarOpen}
                    toggleSidebar={toggleSidebar}
                />
                <div className="book-area">
                    <Logo />
                    <Book
                        booksDictionary={openedBooks}
                        book_id={book_id}
                        client={client}
                        loadedEpubs={loadedEpubs}
                        booksInfo={booksInfo}
                        setBooksInfo={setBooksInfo}
                        highlightAreas={highlightAreas}
                        setHighlightAreas={setHighlightAreas}
                        highlightPluginInstance={highlightPluginInstance}
                        setHighlightPluginInstance={setHighlightPluginInstance}
                    />
                </div>
            </div>
            <Settings active={active} setActive={setActive} client={client} />
            <Tests
                ref={tests}
                test={test}
                booksDictionary={openedBooks}
                active={testsPanel}
                book_id={book_id}
                setActive={setTestsPanel}
                activateTest={setTestPanel}
                setTestId={setTest_id}
                client={client}
                URL={URL}
            />
            <Test
                ref={test}
                tests={tests}
                active={testPanel}
                setActive={setTestPanel}
                activateTests={setTestsPanel}
                test_id={test_id}
                client={client}
                highlightPluginInstance={highlightPluginInstance}
            />
            <Highlights
                active={highlightsPanel}
                setActive={setHighlightsPanel}
                book_info={booksInfo[book_id]}
                highlightAreas={highlightAreas}
                highlightPluginInstance={highlightPluginInstance}
            />
            <div className="bg"></div>
        </div>
    );
};

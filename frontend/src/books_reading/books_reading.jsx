import React, { useState, useRef } from "react";

import { TopBar } from "./components/topBar/TopBar.jsx";
import { SideBar } from "./components/sideBar/SideBar.jsx";
import { Logo } from "./components/logo/Logo.jsx";
import { Book } from "./components/currentBook/Book.jsx";
import { Settings } from "./components/settings/Settings.jsx";
import { Tests } from "./components/tests/Tests.jsx";
import { Test } from "./components/test/Test.jsx";

import "./style.css";

const openedBooks_init = {
    1: { title: "Book1 Title" },
    2: { title: "Book2 Title" },
    3: { title: "Book3 Title" },
    4: { title: "Book4 Title" },
    selected: { id: 1 },
};

const booksInFolder_init = {
    1: { title: "Book1 Title" },
    2: { title: "Book2 Title" },
    3: { title: "Book3 Title" },
    4: { title: "Book4 Title" },
};

export const BooksReading = () => {
    const test = useRef(null);
    const tests = useRef(null);

    const [active, setActive] = useState(false);

    const [openedBooks, setOpenedBooks] = useState(openedBooks_init);
    const [booksInFolder, setBooksInFolder] = useState(booksInFolder_init);

    const [testsPanel, setTestsPanel] = useState(false);
    const [testPanel, setTestPanel] = useState(false);
    const [test_id, setTest_id] = useState(0);
    const [book_id, setBook_id] = useState(0);

    return (
        <div className="book-page-container">
            <SideBar
                booksDictionary={booksInFolder}
                setBooksDictionary={setBooksInFolder}
                settingsSetActive={setActive}
                pagesDictionary={openedBooks}
                setPagesDictionary={setOpenedBooks}
                setTestsPanel={setTestsPanel}
                setBook_id={setBook_id}
            />
            <div className="main-container">
                <TopBar
                    booksDictionary={openedBooks}
                    setBooksDictionary={setOpenedBooks}
                    setTestsPanel={setTestsPanel}
                    setBook_id={setBook_id}
                />
                <div className="book-area">
                    <Logo />
                    <Book />
                </div>
            </div>
            <Settings active={active} setActive={setActive} />
            <Tests
                ref={tests}
                test={test}
                booksDictionary={openedBooks}
                active={testsPanel}
                book_id={book_id}
                setActive={setTestsPanel}
                activateTest={setTestPanel}
                setTestId={setTest_id}
            />
            <Test
                ref={test}
                tests={tests}
                active={testPanel}
          setActive={setTestPanel}
          activateTests={setTestsPanel}
                test_id={test_id}
            />
            <div className="bg"></div>
        </div>
    );
};

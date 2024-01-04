import React, { useState, useRef, useEffect } from "react";

import { TopBar } from "./components/topBar/TopBar.jsx";
import { SideBar } from "./components/sideBar/SideBar.jsx";
import { Logo } from "./components/logo/Logo.jsx";
import { Book } from "./components/currentBook/Book.jsx";
import { Settings } from "./components/settings/Settings.jsx";
import { Tests } from "./components/tests/Tests.jsx";
import { Test } from "./components/test/Test.jsx";

import "./style.css";

import axios from "axios";

const openedBooks_init = {
    selected: { id: -1 },
};

const booksInFolder_init = {
};


axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

const client = axios.create({
    baseURL: "http://localhost:3030",
    headers: {
        "Content-Type": "application/json",
    },
});

export const BooksReading = ({ userData, newClient }) => {
    
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    useEffect(() => {
        const fetchUserData = async () => {
        try {
            const response = await client.get("users/auth/get-user");
            if (response.data.error === 1) {
                const response = await client.post("users/auth/login/", { username: "user1", password: "user1" });
            }
            // else{
            //     console.log(response.data);
            // }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
        };

        fetchUserData();
    }, [isAuthenticated]);
    
    const test = useRef(null);
    const tests = useRef(null);

    const [active, setActive] = useState(false);
    
    const [sectionName, setSectionName] = useState({id: 0, name: "Section Name"});
    const [openedBooks, setOpenedBooks] = useState(openedBooks_init);
    const [loadedEpubs, setLoadedEpubs] = useState({});
    const [booksInFolder, setBooksInFolder] = useState(booksInFolder_init);
    
    const [updateInfo, setUpdateInfo] = useState(true);
    
    useEffect(() => {
        const fetchBooksData = async () => {
        try {
            const response = await client.get("api/opened-books");
            setOpenedBooks(response.data.opened_books_data);
            const lastSection = response.data.last_section_data
            if (lastSection.section_id !== -1){
                setBooksInFolder(lastSection.books);
                setSectionName({ id: lastSection.section_id, name: lastSection.section_name });
            }
            else {
                setBooksInFolder(lastSection.sections);
                setSectionName({ id: lastSection.section_id, name: lastSection.section_name });
            }
            // console.log({ id: lastSection.section_id, name: lastSection.section_name });
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching books data:", error);
        }
        };

        fetchBooksData();
        return () => {};
    }, [updateInfo]);

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
                sectionName={sectionName}
                setUpdateInfo={setUpdateInfo}
                updateInfo={updateInfo}
                client={client}
                loadedEpubs={loadedEpubs}
                setLoadedEpubs={setLoadedEpubs}
            />
            <div className="main-container">
                <TopBar
                    booksDictionary={openedBooks}
                    setBooksDictionary={setOpenedBooks}
                    setTestsPanel={setTestsPanel}
                    setBook_id={setBook_id}
                    setUpdateInfo={setUpdateInfo}
                    updateInfo={updateInfo}
                    client={client}
                    loadedEpubs={loadedEpubs}
                    setLoadedEpubs={setLoadedEpubs}
                />
                <div className="book-area">
                    <Logo />
                    <Book
                        book_id={book_id}
                        client={client}
                        loadedEpubs={loadedEpubs}
                    />
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

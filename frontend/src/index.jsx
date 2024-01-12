import React, { useState, useEffect} from "react";
import ReactDOMClient from "react-dom/client";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import axios from "axios";
import { BooksReading } from "./books_reading/books_reading.jsx";
import { SignIn } from "./sign_in/SignIn.jsx";
import { MainPage } from "./main_page/MainPage.jsx";
import { PDFView } from "./main_page/PDFView/PDFView.tsx";
import Cookies from 'js-cookie';


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

const app = document.getElementById("app");
const root = ReactDOMClient.createRoot(app);


const Index = () => {
    const [userData, setUserData] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    useEffect(() => {
        const fetchUserData = async () => {
        try {
            const response = await client.get("/users/auth/get-user");
            if (response.data.error === 0) {
                console.log('User is authenticated');
                setIsAuthenticated(true);
                setUserData(response.data);
                console.log(response.data);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
        };

        fetchUserData();
    }, [isAuthenticated, setIsAuthenticated]);
    
    return (
        <Router>
            <Routes>
                <Route path="/" element={isAuthenticated ? <Navigate to="/main" /> : <SignIn client={client} isSignIn={true} setIsAuthenticated={setIsAuthenticated}/>} />
                <Route path="/books-reading" element={isAuthenticated ? <BooksReading userData={userData} client={client} /> : <SignIn client={client} isSignIn={true} setIsAuthenticated={setIsAuthenticated}/>} />
                <Route path="/main" element={isAuthenticated ? <MainPage userData={userData} client={client} /> : <SignIn client={client} isSignIn={true} setIsAuthenticated={setIsAuthenticated}/>} />
                <Route path="/sign-up" element={<SignIn client={client} isSignIn={false} setIsAuthenticated={setIsAuthenticated}/>} />
                <Route path="/sign-in" element={<SignIn client={client} isSignIn={true} setIsAuthenticated={setIsAuthenticated}/>} />
            </Routes>
        </Router>
    );
}

root.render(<Index />);
//root.render(<PDFView fileUrl="./file/Gibel_Imperii_Gaidar.pdf"/>);
//root.render(<BooksReading />);

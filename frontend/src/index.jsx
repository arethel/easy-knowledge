import React, { useState, useEffect} from "react";
import ReactDOMClient from "react-dom/client";
import axios from "axios";
import { BooksReading } from "./books_reading/books_reading.jsx";
import { SignIn } from "./sign_in/SignIn.jsx";
import { MainPage } from "./main_page/MainPage.jsx";
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
            const response = await client.get("/api/get-user-data");
            if (response.data.error === 0) {
                setIsAuthenticated(true);
                setUserData(response.data);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
        };

        fetchUserData();
    }, []);
    
    
    return (
        <div>
            {isAuthenticated ? (
                <div>
                    {/* <BooksReading userData={userData} /> */}
                    <MainPage userData={userData} />
                </div>
            ) : (
                <SignIn client={client} />
            )}
        </div>
    );
}

// root.render(<Index />);
root.render(<BooksReading />);
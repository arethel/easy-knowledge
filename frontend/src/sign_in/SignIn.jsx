import React from "react";
import SignInForm from "./components/SignInForm.jsx";
import SignUpForm from "./components/SignUpForm.jsx";
import { ReactComponent as Smartphone } from '../images/smartphone.svg';
import { ReactComponent as LogoEK } from '../images/logo.svg';
import { ReactComponent as SideImage } from '../images/sun-tornado.svg';

import "./style.css";

export const SignIn = ({ client, isSignIn=false }) => {
    return (
        <div className="main-container">
            <div className="side-image-container">
                <div className="side-image">
                    <SideImage className="bg-image" />
                    <div className="logo-text-container">
                        <div className="logo-container">
                            <LogoEK className="easy-knowledge-logo" />
                            <div className="text-wrapper-4">Easy Knowledge</div>
                        </div>
                        <div className="welcome-to-easy">
                            <span className="span">Welcome to </span>
                            <span className="text-wrapper-5">Easy Knowledge</span>
                        </div>
                        <div className="text-wrapper-6">Join Us Now!</div>
                    </div>
                    <div className="smartphone-container">
                        <Smartphone className="smartphone"/>
                    </div>
                </div>
            </div>
            <div className="sign-in-container">
                { isSignIn ? <SignInForm /> : <SignUpForm client={client} /> }
            </div>
        </div>
    )
}

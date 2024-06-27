import React, {Component, useEffect, useState} from "react";
import './App.css';
import axios from "axios";
import Cookies from 'universal-cookie';
import Logout from "./Logout";
import Bet from "./Bet";
import {Navigate, useNavigate,NavLink} from 'react-router-dom'; // Import for navigation


function Login(){
    const [email,setEmail]=useState("");
    const [username,setUsername]=useState("");
    const [errorCode,setErrorCode]=useState(null);
    const [secret,setSecret]=useState("");
    /*const state={
        email:"",
        username:"",
        password:"",
        errorCode:null,
        products:[],
        cookie:"",
        money:0,
        data:"",
        user:null
    };*/
    const validEmail=()=>{
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,7}$/;
        return emailRegex.test(email);

    }
    const validUsername=()=>{
        const usernameRegex = /^[a-zA-Z0-9_]{4,20}$/;

        const isValid = usernameRegex.test(username);
        return isValid;
    }
    const change_email=()=>{
        axios.get("http://localhost:9124/change-email",{
            params:{
                secret:secret,
                email:email
            }
        }).then(res=>{
            if(res.data.success){
                //this.setState({data:res.data})
                const cookies = new Cookies(null, { path: '/' });
                cookies.set('secret', res.data.user.secret);
                cookies.set('money', res.data.user.money);
                cookies.set('username', res.data.user.username);
                cookies.set('email', res.data.user.email);

                setUsername(cookies.get("username"));
                setSecret(cookies.get("secret"));
                setEmail(cookies.get("email"));
                alert("email changed successfully");
                // Redirect to user zone on successful login
            }else {
                setErrorCode(res.data.errorCode);
                errorMessage();
            }
        });
    };
    const change_username=()=>{
        axios.get("http://localhost:9124/change-username",{
            params:{
                secret:secret,
                username:username
            }
        }).then(res=>{
            if(res.data.success){
                //this.setState({data:res.data})
                const cookies = new Cookies(null, { path: '/' });
                cookies.set('secret', res.data.user.secret);
                cookies.set('money', res.data.user.money);
                cookies.set('username', res.data.user.username);
                cookies.set('email', res.data.user.email);

                setUsername(cookies.get("username"));
                setSecret(cookies.get("secret"));
                setEmail(cookies.get("email"));
                alert("username changed successfully");
                // Redirect to user zone on successful login
            }else {
                setErrorCode(res.data.errorCode);
                errorMessage();
            }
        });
    };
    const errorMessage=()=>{
        let message="";
        if(errorCode!=null){
            if(errorCode==5){
                message="email or password are wrong ";
            }else if(errorCode==9){
                message="email is already taken";
            }else if(errorCode==14){
                message="password does not match as requested";
            }else if(errorCode==16){
                message="no email";
            }else if(errorCode==2){
                message="no password";
            }else if(errorCode==16){
                message="no email";
            }else if(errorCode==7){
                message="no relevant cookies";
            }else if(errorCode==13){
                message="game already started";
            }else if(errorCode==10){
                message="invalid guess";
            }else if(errorCode==11){
                message="game not available";
            }else if (errorCode==8){
                message="no such user";
            }alert("error: "+message);
            setErrorCode(null);
            setUsername("");

        }

    }
    useEffect(() => {
        const cookies = new Cookies();
        const getCookies = () => {
            try {
                setUsername(cookies.get('username') || '');
                setSecret(cookies.get('secret') || '');
                setEmail(cookies.get('email')||'');
            } catch (error) {
                console.error('Error getting cookies:', error);
                //errorMessage();
            }
        };

        getCookies();

        //const intervalId = setInterval(getCookies, 1000); // Check every second

        //return () => clearInterval(intervalId); // Cleanup on unmount
    }, []);

    return (
        <div>
            edit your data:
            <div>
                <div>
                    {errorMessage()}
                    {(true)?(
                        <div>
                            hi {username}! here you can change your data!
                            <div>
                                change your email:
                                <input value={email}
                                       onChange={(event) => {
                                           setEmail(event.target.value)
                                       }}/>
                                <div>
                                    <button onClick={change_email} disabled={!validEmail()}>change email</button>
                                </div>
                            </div>
                            <div>
                                change your username:
                                <input value={username}
                                       onChange={(event) => setUsername(event.target.value)}/>
                                <div>
                                    <button onClick={change_username} disabled={!validUsername()}>change username</button>
                                </div>
                            </div>
                            <div style={{display: "flex"}}>
                                <div className="card_email">Email instructions</div>
                                <div className="card_username">Username instructions</div>
                            </div>
                        </div>) : <div><Navigate to={"/"} replace/></div>}

                </div>
            </div>
            <div>
                {/*
                        this.state.errrorCode!=null&&
                        <div>
                            error
                        </div>*/
                }
            </div>
            <div>
                {
                    /* this.state.products.map((product)=>{
                         return <div>{product.description}</div>;
                     })*/
                }
            </div>

        </div>
    );


}

export default Login;
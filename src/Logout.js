import React, {useEffect, useState} from "react"
import './App.css';
import axios from "axios";
import Cookies from 'universal-cookie';
import {Navigate} from "react-router-dom";
function Logout(){
    const [secret, setSecret] = useState("");
    useEffect(() => {


        const cookies = new Cookies();
        const getCookies = () => {
            try {
                setSecret(cookies.get('secret') || '');
            } catch (error) {
                console.error('Error getting cookies:', error);
            }
        };

        getCookies();
        deleteCookie();

        const intervalId = setInterval(getCookies, 1000); // Check every second

        return () => clearInterval(intervalId);

    }, []);
    const deleteCookie=()=>{
        const cookies = new Cookies(null, { path: '/' });
        cookies.remove('secret');
        cookies.remove('username');
        cookies.remove('money');
        cookies.remove("email");
    }
    return(
        <div className="App">
            {(secret==""||secret==undefined||secret==null)&&<Navigate to={"/"}/>}
        </div>
    );
}

export default Logout;
/* {this.state.users.map(item=>{
                        return(
                            <div>
                                <div>
                                    {item.username}
                                </div>
                                <button>
                                    login as
                                </button>
                            </div>
                        )
                    })}
*/


/*
deleteCookie=()=>{
        const cookies = new Cookies(null, { path: '/' });
        cookies.remove('secret');
        cookies.remove('username');
        cookies.remove('money');
    }
*/
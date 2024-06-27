
import React, {useEffect, useState} from "react";
import './App.css';
import axios from "axios";
import Cookies from 'universal-cookie';
import {Navigate, NavLink} from "react-router-dom";


function Signup (){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [valPassword, setValPassword] = useState("");
    const [email, setEmail] = useState("");
    const [errorCode, setErrorCode] = useState(null);
    const [secret, setSecret] = useState("");
    const [money, setMoney] = useState("");
    const [nav,setNav] = useState(null);

    const validPassword=()=>{
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\S+$).{8,}$/;

        const isValid = passwordRegex.test(password);
        return isValid;
    }
    const validEmail=()=>{
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,7}$/;
        return emailRegex.test(email);

    }
    const validUsername=()=>{
        const usernameRegex = /^[a-zA-Z0-9_]{4,20}$/;

        const isValid = usernameRegex.test(username);
        return isValid;
    }

    const disableSignButton=()=>{
        return ((!validUsername())||(!validEmail())||(!validPassword())||(valPassword!==password));
    }
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

    const signup=()=>{
        axios.post("http://localhost:9124/signup?username="+username+"&email="+email+"&password="+password,{
            params:{
                username:username,
                email:email,
                password: password
            }
        }).then(res=>{
            console.log(res.data);
            if(res.data.success){
                const cookies = new Cookies(null, { path: '/' });
                cookies.set('secret', res.data.user.secret,{ expires: new Date(Date.now() + 3600000) });
                cookies.set('money', res.data.user.money,{ expires: new Date(Date.now() + 3600000) });
                cookies.set('username', res.data.user.username,{ expires: new Date(Date.now() + 3600000) });
                cookies.set('email', res.data.user.email,{ expires: new Date(Date.now() + 3600000) });
                /*axios.get("http://localhost:9124/get-products",{
                    params:{
                        secret:res.data.secret
                    }
                }).then(response =>{
                    this.setState({
                        products:response.data.products
                    })
                })*/
                setUsername(cookies.get("username"));
                setSecret(cookies.get("secret"));
                setMoney(cookies.get("money"));
                setEmail(cookies.get("email"));
                //this.setState({username:})
            }else {
                setErrorCode(res.data.errorCode);
                errorMessage();
            }
        });
    };
    useEffect(() => {
        const cookies = new Cookies();
        const getCookies = () => {
            try {
                setUsername(cookies.get('username') || '');
                setMoney(cookies.get('money') || '');
                setSecret(cookies.get('secret') || '');
                setEmail(cookies.get('email')||'');
            } catch (error) {
                console.error('Error getting cookies:', error);
            }
        };

        getCookies();

        //const intervalId = setInterval(getCookies, 1000); // Check every second

        //return () => clearInterval(intervalId); // Cleanup on unmount
    }, []);

        return (
            <div>
                signup
                <div>
                    {errorMessage()}
                    <NavLink className={"value"} to={'/'} replace={true}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" id="svg8">
                            <g transform="translate(-33.022 -30.617)" id="layer1">
                                <path
                                    d="m49.021 31.617c-2.673 0-4.861 2.188-4.861 4.861 0 1.606.798 3.081 1.873 3.834h-7.896c-1.7 0-3.098 1.401-3.098 3.1s1.399 3.098 3.098 3.098h4.377l.223 2.641s-1.764 8.565-1.764 8.566c-.438 1.642.55 3.355 2.191 3.795s3.327-.494 3.799-2.191l2.059-5.189 2.059 5.189c.44 1.643 2.157 2.631 3.799 2.191s2.63-2.153 2.191-3.795l-1.764-8.566.223-2.641h4.377c1.699 0 3.098-1.399 3.098-3.098s-1.397-3.1-3.098-3.1h-7.928c1.102-.771 1.904-2.228 1.904-3.834 0-2.672-2.189-4.861-4.862-4.861zm0 2c1.592 0 2.861 1.27 2.861 2.861 0 1.169-.705 2.214-1.789 2.652-.501.203-.75.767-.563 1.273l.463 1.254c.145.393.519.654.938.654h8.975c.626 0 1.098.473 1.098 1.1s-.471 1.098-1.098 1.098h-5.297c-.52 0-.952.398-.996.916l-.311 3.701c-.008.096-.002.191.018.285 0 0 1.813 8.802 1.816 8.82.162.604-.173 1.186-.777 1.348s-1.184-.173-1.346-.777c-.01-.037-3.063-7.76-3.063-7.76-.334-.842-1.525-.842-1.859 0 0 0-3.052 7.723-3.063 7.76-.162.604-.741.939-1.346.777s-.939-.743-.777-1.348c.004-.019 1.816-8.82 1.816-8.82.02-.094.025-.189.018-.285l-.311-3.701c-.044-.518-.477-.916-.996-.916h-5.297c-.627 0-1.098-.471-1.098-1.098s.472-1.1 1.098-1.1h8.975c.419 0 .793-.262.938-.654l.463-1.254c.188-.507-.062-1.07-.563-1.273-1.084-.438-1.789-1.483-1.789-2.652.001-1.591 1.271-2.861 2.862-2.861z"
                                    id="path26276" fill="#7D8590"></path>
                            </g>
                        </svg>
                        back to homepage</NavLink>
                    <div>
                        {secret != ""&&secret!=undefined&&secret!=null ? (
                                <div>
                                    hi {username} you look handsome today
                                    <Navigate to={"/user-zone"} replace/>
                                </div>) :
                            (<table>
                                <tr>
                                    <td>
                                        username:
                                    </td>
                                    <td>
                                        <input value={username} placeholder={"enter username"}
                                               onChange={(event) => setUsername(event.target.value)}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        email:
                                    </td>
                                    <td>
                                        <input value={email} type={"email"} placeholder={"enter email"}
                                               onChange={(event) => setEmail(event.target.value)}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        password:
                                    </td>
                                    <td>
                                        <input type={"password"} value={password} placeholder={"enter password"}
                                               onChange={(event) => setPassword(event.target.value)}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        password:
                                    </td>
                                    <td>
                                        <input type={"password"} value={valPassword} placeholder={"enter password to validate"}
                                               onChange={(event) => setValPassword(event.target.value)}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <button onClick={signup} disabled={disableSignButton()}>
                                            login
                                        </button>
                                    </td>
                                </tr>
                            </table>)
                        }

                    </div>
                </div>
                <div style={{display: "flex"}}>
                    <div className="card_email">Email instructions</div>
                    <div className="card_username">Username instructions</div>
                    <div className="card_pwd">Password instructions</div>
                </div>

            </div>
        );


}

export default Signup;
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

Validation Criteria:

The email address must consist of the following parts:
Local Part (Username):
Must start with a letter (a-z or A-Z).
Can contain letters (a-z or A-Z), numbers (0-9), special characters (defined in the regular expression: !#$%&'*+/=?^_`{|}~-).
Can have periods (.) to separate characters within the local part.
Cannot end with a period (.).
Separator (@ symbol):
Must be present exactly once.
username: Must start with a letter | can contain letters,numbers, special characters | can have period | cannot end with period. separator:@. domain name: Must start with letter | can contain letters, numbers, hyphens | Must have periods to separate subdomain to domain name. top level domain: Must consist of 2 to 7 letters.
Domain Name:
Must start with a letter (a-z or A-Z).
Can contain letters (a-z or A-Z), numbers (0-9), and hyphens (-).
Must have periods (.) to separate subdomains within the domain name.
The top-level domain (TLD) must consist of 2 to 7 letters (a-z).



The usernameRegex pattern defines the following rules:
Starts with a letter (a-zA-Z)
Contains only letters, numbers, and underscores (_)
Has a minimum length of 4 characters and a maximum of 20 characters (.{4,20})








                    The passwordRegex pattern incorporates similar complexity requirements:
At least one digit ((?=.*\d))
At least one lowercase letter ((?=.*[a-z]))
At least one uppercase letter ((?=.*[A-Z]))
At least one special character ((?=.*[@#$%^&+=!]))
No whitespace ((?=\S+$))
Minimum length of 8 characters (.{8,}$)
*/




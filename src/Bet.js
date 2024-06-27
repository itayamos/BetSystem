
import './App.css';
import React,{useState,useEffect} from "react";
import axios from "axios";
import Cookies from 'universal-cookie';
import 'animate.css';
import {Navigate} from "react-router-dom";


function Bet(props){

    const [secret,setSecret]=useState("");
    const [money,setMoney]=useState(1000);
    const [betMoney,setBetMoney]=useState(0);
    const [data,setData]=useState(null);
    const [choice,setChoice]=useState("");
    const [choices,setChoices]=useState([]);
    const [guess,setGuess]=useState("");
    const [errorCode,setErrorCode]=useState(null);
    const [username,setUsername]=useState("");
    const [email,setEmail]=useState("");
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

        updateStats();
        getCookies();
        getUpcomingGames();
        const intervalId1 = setInterval(getCookies, 1000); // Check every second
        const intervalId2= setInterval(getUpcomingGames,5000);
        const intervalId3= setInterval(updateStats,1000);
        return () => {clearInterval(intervalId1); clearInterval(intervalId2); clearInterval(intervalId3);}; // Cleanup on unmount
    }, []);



    const updateStats=()=>{

        axios.get("http://localhost:9124/constant-update",{params:{
                secret:secret
            }}).then(res=>{
            const update=res.data;console.log(update);
            //const getChoices=update.games.map((q)=>{return q.game_id+": "+q.game_name});
            if (update.success){

                const cookies=new Cookies(null, { path: '/' });
                cookies.set('username',update.user.username);
                cookies.set("email",update.user.email);
                cookies.set("secret",update.user.secret);
                cookies.set("money",update.user.money);
                setUsername(update.user.username);
                setEmail(update.user.email);
                setSecret(update.user.secret);
                setMoney(update.user.money);
                console.log(money);
            }else {
                setErrorCode(update.errorCode);
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

    /*const available_games=()=>{
        console.log("ijhgfdefghjmngfghngfghmnhgghmnhghmhghmngghmhghjmhghjkj")
        const event = new EventSource("http://localhost:9124/start-streaming1");
        //const eventList = document.querySelector("ul");

        event.onopen=function (){console.log(event.readyState);
            console.log("---------start----------");
        }
        let context=this;
        event.onerror = (event) => {
            console.error('EventSource failed:', event);
            event.close();
        };
        event.onmessage = function (message){
            //const update=JSON.parse(message.data);
            const update=JSON.parse(message.data);
            //const getChoices=update.games.map((q)=>{return q.game_id+": "+q.game_name});
            let Upcoming=update.games.map((q)=>{return q.game_id+": "+q.game_name});
            let stringUpcoming="";
            for (let i = 0; i < Upcoming.length; i++) {
                stringUpcoming+=Upcoming.at(i);
            }setData(stringUpcoming);
            setChoices(update.games.map((q)=>{return <option value={q.game_id}>{q.game_name}</option>}));
            context.setState();context.setState({});
            /*   context.setState({active_game:<table>
                       <tr><td>home</td><td>home score</td><td>away score</td><td>away</td><td>minute</td></tr>
                       <tr><td>{update.home}</td><td>{update.home_score}</td><td>{update.away_score}</td><td>{update.away}</td><td>{update.minute}</td></tr>
               </table>});*/
     /*   };

    }*/
    const getUpcomingGames=()=>{
        axios.get("http://localhost:9124/stream-upcoming-games").then(res=>{
            const update=res.data;
            //const getChoices=update.games.map((q)=>{return q.game_id+": "+q.game_name});
            if(update.games!=undefined){
                let dataTotable=<table>
                    <tr>
                        <td>club name</td>
                        <td>home win prediction (%)</td>
                        <td>draw prediction (%)</td>
                        <td>away win prediction (%)</td>
                    </tr>
                    {update.games.map((q) => {
                        return (<tr
                            className={"animate__animated animate__fadeIn"}>
                            <td>{q.game_name}</td>
                            <td>{q.home_prob}%</td>
                            <td>{q.draw_prob}%</td>
                            <td>{q.away_prob}%</td>
                        </tr>);
                })}</table>;
                setData(dataTotable);
                setChoices(update.games.map((q)=>{return <option value={q.game_id}>{q.game_name}</option>}));
            }

        });
    };






    const bet=async (event)=>{
        let flag="cannot bet game have already started";
        if (betMoney>0&&choice>0&&guess>=0&&guess<=2&&secret!=null&&secret!=undefined&&secret!=""){
            const choice1=parseInt(choice);
            const secret1=secret;
            const money1=betMoney;
            const guess1=parseInt(guess);
            const ce={params:{gameId:choice1,secret:secret1,money:money1,guess:guess1}};
            if(ce!=null&&ce!=undefined/*&&ce.params!=null&&ce.params.secret!=null*/){
                await axios.get("http://localhost:9124/bet",ce)
                    .then(res=>{

                        console.log("data: ",ce);
                        console.log("response: ",JSON.stringify(res));
                        if(res.data.success){flag=`bet placed successfully `+username;
                            const updatedbalance=res.data.bet.user.money;
                            setMoney(updatedbalance);
                            setBetMoney(0);
                            setGuess("");
                            setChoice("");
                        }else {
                            setErrorCode(res.data.errorCode);
                        }
                    });
            }else {
                flag="no data can be sent";
                errorMessage();
            }
        }else {
            flag="invalid data";
            errorMessage();

        }
        return alert(flag);
    }

    const disableBet=()=>{
        return guess==""||choice==""||money<betMoney||betMoney<=0;
    }

    return (
        <div className="App">
            <div>
                <div>
                    <h1>note:</h1>
                    <h2>the bet system goes "against all odds", thus the potential bonus will be 100%
                    minus the the percentage prediction of your guess</h2>

                </div>
                <div>
                    {data}
                </div>
                <div>
                    <select value={choice} onChange={(event) => {
                        setChoice(event.target.value)}}>
                        <option value={""} >select guess</option>
                        {choices}
                    </select>

                </div>
                <div>
                    <select value={guess} onChange={(event)=>{setGuess(event.target.value)}}>
                        <option value={""} disabled={true}>select guess</option>
                        <option value={0}>home win</option>
                        <option value={1}>draw</option>
                        <option value={2}>away win</option>
                    </select>
                </div>
                <div>
                    <div>your balance:{money}</div>
                    <div>how much money you want to bet?</div>
                    <input value={betMoney} type={"number"} onChange={(event)=>{setBetMoney(event.target.value)}}/>
                    <div>currently:{betMoney}</div>
                </div>
            </div>
            <button disabled={disableBet()} onClick={(event)=>{bet(event)}}>bet</button>

        </div>
    );
}

export default Bet;
//<input type={"text"} placeholder={"enter username"} value={this.state.cookie} onChange={(event)=>{this.inputChange("email",event)}}/>
//                 <input placeholder={"enter password"} value={this.state.password} onChange={(event)=>{this.inputChange("password",event)}}/>
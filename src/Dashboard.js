import './App.css';
import {BrowserRouter as Router, Route, Routes, Link, Switch, BrowserRouter, NavLink, Navigate} from "react-router-dom";
import React, { useState, useEffect } from 'react';
import "./App.css";
import axios from "axios";
import Cookies from "universal-cookie";
import 'animate.css';

function Dashboard() {
    const [rankTable, setRankTable] = useState(null);
    const [active_game, setActive_game] = useState(null);
    const [home_goals, setHome_goals] = useState(null);
    const [away_goals, setAway_goals] = useState(null);
    const [money,setMoney] = useState(0);
    const [data,setData] = useState(null);
    const [choices, setChoices] = useState(null);
    const [betNotStartedTable, setBetNotStartedTable] = useState(null);
    const [betActiveTable, setBetActiveTable] = useState(null);
    const [betFinishedTable, setBetFinishedTable] = useState(null);
    const [hasBets,setHasBet]=useState(false);
    const [secret,setSecret] = useState("");
    const [email,setEmail]=useState("");
    const [username,setUsername]=useState("");
    const[isUser,setIsUser]=useState(false);
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
        const getTable = () => {
            axios.get("http://localhost:9124/get-team-rank").then((res)=>{
                setRankTable(<table><tr>
                    <td>rank</td>
                    <td>name</td>
                    <td>points</td>
                    <td>goal_diff</td>
                    <td>wins</td>
                    <td>draws</td>
                    <td>loses</td>
                </tr>
                    {res.data.clubs.map((q) => {
                        return <tr>
                            <td>{q.rank}</td>
                            <td>{q.name}</td>
                            <td>{q.points}</td>
                            <td>{q.goal_diff}</td>
                            <td>{q.wins}</td>
                            <td>{q.draws}</td>
                            <td>{q.loses}</td>
                        </tr>
                    })}</table>);
                //console.log(res.data.clubs);
            });
        };
        const getIsUser=()=>{
            if (secret!=""&&secret!=undefined&&secret!=null){
                setIsUser(true);
            }else {
                setIsUser(false);
            }
        }
        getTable();
        getGames();
        getUpcomingGames();
        getBetHistory();
        getCookies();
        getIsUser();
        const intervalId1 = setInterval(getTable, 1000); // Check every second
        const intervalId2 = setInterval(getGames, 33);
        const intervalId3= setInterval(getUpcomingGames,5000);
        const intervalId4= setInterval(getBetHistory,400);
        const intervalId5= setInterval(getCookies,5000);
        const intervalId6= setInterval(getIsUser,1000);
        return () =>{clearInterval(intervalId1); clearInterval(intervalId2); clearInterval(intervalId3); clearInterval(intervalId4); clearInterval(intervalId5);clearInterval(intervalId6);};// Cleanup on unmount
    }, []);
    const getGames = () => {
        axios.get("http://localhost:9124/stream-games").then((res)=>{
            const update=res.data;
            if(update.home_goals!=undefined){
                //let homeGoals=;
                setHome_goals(<table className={"border"}><tbody>
                <tr className={"animate__animated animate__flip animate__fadeIn"}><td className={"content"}>side</td><td className={"content"}>scorer</td><td className={"content"}>minute</td></tr>
                {update.home_goals.map((q)=>{return <tr className={"animate__animated animate__flip"}>
                    <td className={"content"}>{q.side}</td>
                    <td className={"content"}>{q.scorer}</td>
                    <td className={"content"}>{q.minute}</td>
                </tr>})}</tbody>
                </table>);
            }else {setHome_goals(null);}
            if(update.away_goals!=undefined){
                //let awayGoals=;
                setAway_goals(<table className={"border"}>
                        <tbody>

                        <tr className={"animate__animated animate__flip animate__fadeIn"}>
                            <td className={"content"}>side</td>
                            <td className={"content"}>scorer</td>
                            <td className={"content"}>minute</td>
                        </tr>
                        {update.away_goals.map((q) => {
                            return <tr className={"animate__animated animate__flip"}>
                                <td className={"content"}>{q.side}</td>
                                <td className={"content"}>{q.scorer}</td>
                                <td className={"content"}>{q.minute}</td>
                            </tr>
                        })}</tbody>
                    </table>
                );
            } else {
                setAway_goals(null);
            }
            //console.log(update);
            setActive_game(<table className={"border"}>
                <tr>
                    <td className={"content"}>home</td>
                    <td className={"content"}>home score</td>
                    <td className={"content"}>away score</td>
                    <td className={"content"}>away</td>
                    <td className={"content"}>minute</td>
                </tr>

                <tr className={"border"}>
                    <td className={"content"}>{update.home}</td>
                    <td className={"content"}>{update.home_score}</td>
                    <td className={"content"}>{update.away_score}</td>
                    <td className={"content"}>{update.away}</td>
                    <td className={"content"}>{update.minute}</td>
                </tr>

            </table>);

            //console.log(res.data.clubs);
        });
    };
    const getUpcomingGames=()=>{
        axios.get("http://localhost:9124/stream-upcoming-games").then(res=>{
            const update=res.data;
            //const getChoices=update.games.map((q)=>{return q.game_id+": "+q.game_name});
            if(update.games!=undefined){
                let dataTotable=<table>{update.games.map((q)=>{return <tr>{q.game_name}<td></td></tr>;})}</table>;
                setData(dataTotable);
                setChoices(update.games.map((q)=>{return <option value={q.game_id}>{q.game_name}</option>}));
            }

        });
    };

    const getBetHistory=()=>{
        axios.get("http://localhost:9124/user-bet-games",{params:{secret:new Cookies(null, { path: '/' }).get('secret')}}).then(res=>{
            const update=res.data;
            //const getChoices=update.games.map((q)=>{return q.game_id+": "+q.game_name});

            if(update.bet_history_games!==undefined){setHasBet(true);
                const betHistory=update.bet_history_games;
                //console.log(betHistory);
                let notStartedChart=[];
                let activeChart=[];
                let finishedChart=[];
                betHistory.map((q)=>{
                    console.log(q.guess);
                    const money_bet_on_game=q.money_bet_on_game;
                    const home_team_name=q.home_team_name;
                    const away_team_name=q.away_team_name;
                    const game_status=q.game_status;
                    const bonus=q.bonus;
                    const guessInt=q.guess;
                    let guess="";
                    if (guessInt===0){
                        guess=home_team_name+" wins";
                    }else if(guessInt===1){
                        guess="draw";
                    }else if(guessInt===2){
                        guess=away_team_name+" wins";
                    }
                    if (game_status==="not started"){
                        const home_prob=q.home_prob;
                        const draw_prob=q.draw_prob;
                        const away_prob=q.away_prob;
                        notStartedChart.push(<tr>
                            <td>
                                {home_team_name}
                            </td>
                            <td>
                                {away_team_name}
                            </td>
                            <td>
                                {money_bet_on_game}
                            </td>
                            <td>
                                {guess}
                            </td>
                            <td>
                                {home_prob}%
                            </td>
                            <td>
                                {draw_prob}%
                            </td>
                            <td>
                                {away_prob}%
                            </td>
                            <td>
                                {bonus*100}%
                            </td>
                        </tr>);
                    } else {
                        const home_score=q.home_score;
                        const away_score=q.away_score;

                        if (game_status === "active") {
                            const minute = q.minute;
                            activeChart.push(<tr>
                                <td>
                                    {home_team_name}
                                </td>
                                <td>
                                    {home_score}
                                </td>
                                <td>
                                    {away_score}
                                </td>
                                <td>
                                    {away_team_name}
                                </td>
                                <td>
                                    {money_bet_on_game}
                                </td>
                                <td>
                                    {guess}
                                </td>
                                <td>
                                    {minute}'
                                </td>
                                <td>
                                    {bonus*100}%
                                </td>
                            </tr>);
                        } else if (game_status === "finished") {
                            const response_bet=q.response_bet;
                            const result = q.result;

                            finishedChart.push(<tr>
                                <td>
                                    {home_team_name}
                                </td>
                                <td>
                                    {home_score}
                                </td>
                                <td>
                                    {away_score}
                                </td>
                                <td>
                                    {away_team_name}
                                </td>
                                <td>
                                    {money_bet_on_game}
                                </td>
                                <td>
                                    {guess}
                                </td>
                                <td>
                                    {(response_bet && result != undefined) ? result : " - "}
                                </td>
                                <td>
                                    {bonus*100}%
                                </td>
                            </tr>);
                        }
                    }
                });
                setBetNotStartedTable(<table>
                    <tr>
                        <td>
                            home
                        </td>
                        <td>
                            away
                        </td>
                        <td>
                            money bet
                        </td>
                        <td>
                            guess
                        </td>
                        <td>
                            home win(%)
                        </td>
                        <td>
                            draw(%)
                        </td>
                        <td>
                            away win(%)
                        </td>
                        <td>
                            potential bonus(%)
                        </td>
                    </tr>
                    {notStartedChart.map((row) => row)}
                </table>);
                setBetActiveTable(<table>
                    <tr>
                        <td>
                            home
                        </td>
                        <td>
                            home score
                        </td>
                        <td>
                            away score
                        </td>
                        <td>
                            away
                        </td>
                        <td>
                            money bet
                        </td>
                        <td>
                            guess
                        </td>
                        <td>
                            minute
                        </td>
                        <td>
                            potential bonus(%)
                        </td>
                    </tr>
                    {activeChart.map((row) => row)}
                </table>);
                setBetFinishedTable(<table>
                    <tr>
                        <td>
                            home
                        </td>
                        <td>
                            home score
                        </td>
                        <td>
                            away score
                        </td>
                        <td>
                            away
                        </td>
                        <td>
                            money bet
                        </td>
                        <td>
                            guess
                        </td>
                        <td>
                            result
                        </td>
                        <td>
                            potential bonus(%)
                        </td>
                    </tr>
                    {finishedChart.map((row) => row)}
                </table>);
            }else{setHasBet(false);}

        });
    };

    return (<div className={"App"}>
        <div>

            <div>
                game:
                {active_game}
                <div style={{display: "flex"}}>
                    home goals:
                    {home_goals}
                    away goals:
                    {away_goals}
                </div>
            </div>
            <div>
                rank table:
                {rankTable}
            </div>Upcoming games:
            {data}



                bet:
                {hasBets?(<div>{betNotStartedTable}
                    {betActiveTable}
                    {betFinishedTable}</div>):"no bets yet"}




        </div>
    </div>);
}

export default Dashboard;
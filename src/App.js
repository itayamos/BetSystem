
import React from "react"
import './App.css';
import axios from "axios";
import {BrowserRouter as Router, Route, Routes, Switch,useNavigate , BrowserRouter, NavLink,
  Link,
  LinkProps,
  createBrowserRouter,
  RouterProvider,
  Outlet,} from "react-router-dom";
import Dashboard from "./Dashboard";
import Logout from "./Logout";
import Bet from "./Bet";
import Cookies from "universal-cookie";
import Login from "./Login";
import Signup from "./Signup";
import UserZone from "./UserZone";
import HomePage from "./HomePage";
import Guest from "./Guest";
import NotFound from "./NotFound";
import EditData from "./EditData";



const router=createBrowserRouter([{
  path:'/',element:<HomePage/>,errorElement:<NotFound/>,children:[{},{},{}]
},{
  path:'/login',element:<Login/>,errorElement:<NotFound/>
},{
  path:'/signup',element:<Signup/>,errorElement:<NotFound/>
},{
  path:'/guest',element:<Guest/>,errorElement:<NotFound/>,children:[{path:'/guest/dashboard',element:<Dashboard/>}]
},{
  path:'/user-zone',element:<UserZone/>,errorElement:<NotFound/>,children:[{path:'/user-zone/bet',element:<Bet/>},{path:'/user-zone/dashboard',element:<Dashboard/>},{path:'/user-zone/edit',element:<EditData/>},{path:'/user-zone/logout',element:<Logout/>}]
}])


class App extends React.Component{
  state={
    users:[],cookie:null
  };
  componentDidMount() {
    this.getCooked();
    //axios.get("http://localhost:9124/get-all-users").then(res=>{this.setState({users: res.data});});
  }
  getCooked=()=>{
    const cookies = new Cookies(null, { path: '/' });
    if ((cookies.get('secret')!==""&&cookies.get('secret')!==undefined&&cookies.get('secret')!==null)){
      this.setState({cookie:cookies.get('secret')});
    }else {
      this.setState({cookie:""});
    }
  }
  render=()=>{
    return (
        <div className="App">
          <RouterProvider router={router} />
        </div>
    );
  }

}

export default App;

//,
//   {path:'/profiles',element:<Profiles/>,children:[{path:'/profiles/:palestine',element:<Profile/>}]}
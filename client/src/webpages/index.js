import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import Home from './home';
import Admin from './admin';
import Login from './login';
import EditFlightPage from './editFlightPage';
import MyReservations from './myReservations';
import MyInformation from './myInformation';
import SignUp from './signUp';
import ChangePassword from './changePassword';

function Webpages()
{
    return(
        <Router>
        <Routes>
            <Route exact path="/" element= {<Home/>} />
            <Route path = "/admin" element = {<Admin/>} />
            <Route path = "/login" element = {<Login />} />
            <Route path = "/editFlight" element = {<EditFlightPage />} />   
            <Route path ="/myReservations" element = {<MyReservations />} />
            <Route path ="/myInformation" element = {<MyInformation />} />
            <Route path ="/signUp" element = {<SignUp />} />
            <Route path ="/changePassword" element = {<ChangePassword />} />
        </Routes>
        </Router>
    );
};
export default Webpages;
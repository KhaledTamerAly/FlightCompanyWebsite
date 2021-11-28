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
function Webpages()
{
    return(
        <Router>
        <Routes>
            <Route exact path="/" element= {<Home/>} />
            <Route path = "/admin" element = {<Admin/>} />
            <Route path = "/login" element = {<Login />} />
            <Route path = "/editFlight" element = {<EditFlightPage />} />
        </Routes>
        </Router>
    );
};
export default Webpages;
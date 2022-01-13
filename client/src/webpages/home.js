import React,{useEffect} from 'react'
import {useNavigate, useLocation} from 'react-router-dom';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import { Button} from 'reactstrap';
import GeneralSearch from '../components/GeneralSearch.js';
import EnhancedTable from '../components/ScheduleViewer';
import Navbar from '../components/Navbar';

function Home()
{
  const location = useLocation();
  const [loggedIn,setIsLoggedIn]=React.useState(false);
  const [username,setUsername] = React.useState(localStorage.getItem('username') || null);
  
  useEffect(()=>{
    if(localStorage.getItem('username')==null)
      setIsLoggedIn(false);
    else{
      setUsername(localStorage.getItem('username'));
      setIsLoggedIn(true);
    }
  },[]);

  function Login(username)
  {
    setIsLoggedIn(true);
    setUsername(username);
  }

    const navigate = useNavigate();

    function goToAdmin() {
      navigate('/admin')
    }
    return (
      <>
        <div>
          <Navbar loggedIn={loggedIn}/>
        </div>
        <div>
            <h1>Welcome to Osama Airlines</h1>
            <p></p>
        </div>
        <div>
          <EnhancedTable />
        </div>
        <div>
          <GeneralSearch login={Login} isLoggedIn={location?.state?.loggedIn??loggedIn}/>
          </div>
        </>
    );
}

export default Home;
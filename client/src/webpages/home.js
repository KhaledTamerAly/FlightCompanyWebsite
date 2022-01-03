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
  const location  = useLocation();
  const [loggedIn,setIsLoggedIn]=React.useState(false);
  
  useEffect(()=>{
    setIsLoggedIn(location?.state?.loggedIn??false);
  },[]);

  function Login()
  {
    setIsLoggedIn(true);
  }

    const navigate = useNavigate();

    function goToAdmin() {
      navigate('/admin')
    }
    function goToLogin() {
        navigate('/login')
      }
    return (
      <>
        <div>
          <Navbar loggedIn={loggedIn}/>
        </div>
        <div>
            <h1>Welcome to Osama Airlines</h1>
            <p></p>
            <Button color="primary" outline onClick={goToAdmin}> Login as Admin </Button>
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
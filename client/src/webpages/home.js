import React from 'react'
import {useNavigate} from 'react-router-dom';
import { Button} from 'reactstrap';
import GeneralSearch from '../components/GeneralSearch.js';
import EnhancedTable from '../components/ScheduleViewer';

function Home()
{
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
            <h1>Welcome to placeholder flights</h1>
            <p></p>
            <Button color="primary" outline onClick={goToAdmin}> Login as Admin </Button>
            <Button color="primary" outline onClick={()=> navigate('/user')}> Login as User </Button>
            <Button color="success" outline> Register </Button>
        </div>
        <div>
          <EnhancedTable />
        </div>
        <div>
          <GeneralSearch />
          </div>
        </>
    );
}

export default Home;
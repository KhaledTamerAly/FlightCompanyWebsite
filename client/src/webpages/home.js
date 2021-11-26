import React from 'react'
import {useNavigate} from 'react-router-dom';
import { Button} from 'reactstrap';

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
        <div>
            <h1>Welcome to placeholder flights</h1>
            <p></p>
            <Button color="primary" outline onClick={goToLogin}> Login </Button>
            <Button color="success" outline> Register </Button>
        </div>
    );
}

export default Home;
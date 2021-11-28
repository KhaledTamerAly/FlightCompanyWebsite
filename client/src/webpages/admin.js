import React from "react";
import Search from '../components/Search'
import {Button} from 'reactstrap';
import {useNavigate} from 'react-router-dom';

function Admin()
{
    const navigate=useNavigate();
    function goToAddFlight(){
        navigate('/editFlight', { state:{isAdd:true}, replace:false })
    }
    function goToHome()
    {
        navigate('/');
    }
    return (
        <>
        <div>
        <Button
                id="backToHome"
                type="button"
                color="primary"
                onClick = {goToHome}
            >
            Go Back To Home
            </Button>
            <Button
                id="addFlight"
                type="button"
                color="success"
                onClick = {goToAddFlight}
            >
            Add new flight
            </Button>
        </div>
        <div>
            <Search />
        </div>
        </>
    );
}

export default Admin;
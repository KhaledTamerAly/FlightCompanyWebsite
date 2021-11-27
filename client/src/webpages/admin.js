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
    return (
        <>
        <div>
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
import React, { useEffect, useState } from 'react';
import {Button} from 'reactstrap';
import {useNavigate, useLocation} from 'react-router-dom';
import FormComponent from '../components/FormComponent';

function AddFlight(){
    return(
        <div>
            hi this is add
            <FormComponent add = {true} />
            
        </div>
    );
}
function UpdateFlight(props)
{
    return(
        <div>
            hi this is update
            <FormComponent add = {false} id={props.id} />
        </div>
    );
}
function EditFlightPage(props)
{
    const location = useLocation();
    return (
        <div>
            {location.state.isAdd && <AddFlight />}
            {!location.state.isAdd && <UpdateFlight id = {location.state.id}/>}
        </div>

    );
}
export default EditFlightPage;
import React, { useEffect } from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import FormComponent from '../components/FormComponent';

function AddFlight(){
    return(
        <div>
            <FormComponent add = {true} />
            
        </div>
    );
}
function UpdateFlight(props)
{
    return(
        <div>
            <FormComponent add = {false} id={props.id} />
        </div>
    );
}
function EditFlightPage()
{
    const navigate=useNavigate();
    useEffect(()=>{
        if(localStorage.getItem('type')==null || localStorage.getItem('type')=='User'){
            navigate('/');
        }
    })
    const location = useLocation();

    var isAdd=true;
    if(location?.state?.isAdd!=null)
        isAdd=location.state.isAdd;
    return (
        <div>
            {isAdd && <AddFlight />}
            {!isAdd && <UpdateFlight id = {location.state.id}/>}
        </div>

    );
}
export default EditFlightPage;
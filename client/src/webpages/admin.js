import React from "react";
import Search from '../components/Search'
import {Button} from 'reactstrap';
import {useNavigate} from 'react-router-dom';

function Admin()
{
    const navigate=useNavigate();
    React.useEffect(()=>{
        if(localStorage.getItem('type')==null || localStorage.getItem('type')=='User'){
            navigate('/');
        }
      })

    function goToAddFlight(){
        navigate('/editFlight', { state:{isAdd:true}, replace:false })
    }
    function goToHome()
    {
        localStorage.removeItem('username');
        localStorage.removeItem('type');
        navigate('/',{
            state: {
              loggedIn:false
            }
          });
          window.location.reload();
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
            Sign out
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
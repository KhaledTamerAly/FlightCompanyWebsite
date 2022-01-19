import React from "react";
import Search from '../components/Search'
import {Button} from 'reactstrap';
import {useNavigate} from 'react-router-dom';
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import { fontSize } from '@mui/system';
import styles from '../css/admin.module.css';
import IconButton from '@mui/material/IconButton';

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
        <div className={styles.backgroundIMG}>
            <IconButton onClick={()=>{navigate('/admin')}} size='large' sx={{color:"whitesmoke",fontSize:"40px",fontFamily:"fantasy"}}>
            <AirplaneTicketIcon fontSize="inherit" />
            &nbsp;
            {'Osama Airlines'}
        </IconButton>
        <div className={styles.buttons}>
            <Button
                id="addFlight"
                type="button"
                color="success"
                onClick = {goToAddFlight}
            >
            Add new flight
            </Button>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Button
                id="backToHome"
                type="button"
                color="danger"
                onClick = {goToHome}
            >
            Sign out
            </Button>
        </div>
        <div>
            <Search />
        </div>
        </div>
    );
}

export default Admin;
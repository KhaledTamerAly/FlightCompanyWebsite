import React from "react";
import Search from '../components/Search'
import {Button} from 'reactstrap';
import {useNavigate} from 'react-router-dom';
import styles from '../css/admin.module.css';

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
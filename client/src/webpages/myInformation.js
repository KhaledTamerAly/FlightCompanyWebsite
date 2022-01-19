import * as React from 'react';
import Navbar from '../components/Navbar';
import UserForm from '../components/UserForm';
import {useNavigate, useLocation} from 'react-router-dom'; 
import styles from '../css/home.module.css';

export default function MyInformation() {
  const navigate=useNavigate();
  const location  = useLocation();
  React.useEffect(()=>{
    if(localStorage.getItem('username')==null)
      navigate('/'); 
    else if(localStorage.getItem('type')=='Admin')
      navigate('/admin');
  })
  return (
      <div className={styles.backgroundIMG}>
          <Navbar loggedIn={true}/>
          <div></div>
          <UserForm signUp={false} />
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
        </ div>
  );
}

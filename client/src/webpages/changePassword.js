import * as React from 'react';
import {useEffect} from 'react';
import PasswordForm from '../components/PasswordForm';
import Navbar from '../components/Navbar';
import {useNavigate} from 'react-router-dom';
import styles from '../css/home.module.css';

export default function ChangePassword() {
  const navigate = useNavigate();

  useEffect(()=>{
    if(localStorage.getItem('username')==null)
      navigate('/');
    else if(localStorage.getItem('type')=='Admin')
      navigate('/admin');
  });

  return (
      <div className={styles.backgroundIMG}>
          <Navbar loggedIn={true} />
          <div></div>
          <PasswordForm />
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
        </ div>
  );
}

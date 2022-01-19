import * as React from 'react';
import LoginForm from '../components/LoginForm';
import Navbar from '../components/Navbar';
import {useNavigate} from 'react-router-dom';
import styles from '../css/home.module.css';


export default function SignIn() {
  const navigate = useNavigate();
  return (
      <div className={styles.backgroundIMG}>
          <Navbar loggedIn={false} signUp={false}/>
          <div></div>
          <LoginForm buttonFunction={(username)=>{navigate('/',{
                state: {
                  loggedIn:true
                }
              })}}/>
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
          <br/>
          <br/>
          <br/>
        </ div>
  );
}

import * as React from 'react';
import LoginForm from '../components/LoginForm';
import Navbar from '../components/Navbar';
import {useNavigate} from 'react-router-dom';


export default function SignIn() {
  const navigate = useNavigate();
  return (
      <div>
          <Navbar loggedIn={false} signUp={false}/>
          <div></div>
          <LoginForm buttonFunction={(username)=>{navigate('/',{
                state: {
                  loggedIn:true
                }
              })}}/>
        </ div>
  );
}

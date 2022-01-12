import * as React from 'react';
import {useEffect} from 'react';
import PasswordForm from '../components/PasswordForm';
import Navbar from '../components/Navbar';
import {useNavigate} from 'react-router-dom';

export default function ChangePassword() {
  const navigate = useNavigate();

  useEffect(()=>{
    if(localStorage.getItem('username')==null)
      navigate('/');
  });

  return (
      <div>
          <Navbar loggedIn={true} />
          <div></div>
          <PasswordForm />
        </ div>
  );
}

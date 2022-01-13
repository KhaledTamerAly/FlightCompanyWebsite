import * as React from 'react';
import UserForm from '../components/UserForm';
import Navbar from '../components/Navbar';

export default function signUp() {

  return (
      <div>
          <Navbar loggedIn={false} signUp={true}/>
          <div></div>
          <UserForm signUp={true}/>
        </ div>
  );
}

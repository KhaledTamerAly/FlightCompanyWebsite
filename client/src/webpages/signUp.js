import * as React from 'react';
import UserForm from '../components/UserForm';
import Navbar from '../components/Navbar';
import styles from '../css/home.module.css';

export default function signUp() {

  return (
      <div className={styles.backgroundIMG}>
          <Navbar loggedIn={false} signUp={true}/>
          <div></div>
          <UserForm signUp={true}/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
        </ div>
  );
}

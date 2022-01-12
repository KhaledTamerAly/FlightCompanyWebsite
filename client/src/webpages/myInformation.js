import * as React from 'react';
import Navbar from '../components/Navbar';
import UserForm from '../components/UserForm';
import {useNavigate, useLocation} from 'react-router-dom'; 

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
      <div>
          <Navbar loggedIn={true}/>
          <div></div>
          <UserForm signUp={false} />
        </ div>
  );
}

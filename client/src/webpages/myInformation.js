import * as React from 'react';
import Navbar from '../components/Navbar';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react'

export default function MyInformation() {

    const [user,setUser]=React.useState();
    

    
    const [fName, setFName] = React.useState("");
    const [lName, setLName] = React.useState("");
    const [homeAddress, setHomeAddress] = React.useState("");
    const [countryCode, setCountryCode] = React.useState("");
    const [telephoneNumber, setTelephoneNumber] = React.useState("");
    const [passportNumber, setPassportNumber] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [username, setUsername] = React.useState("");
    const [clicked, setClicked] = React.useState(false);

    useEffect(()=>{axios.get('users/userInfo/youssef')
    .then(User=> {
        setUser(User.data);
        setFName(User.data.fName);
        setLName(User.data.lName);
        setHomeAddress(User.data.homeAddress);
        setCountryCode(User.data.countryCode);
        setTelephoneNumber(User.data.telephoneNumber);
        setPassportNumber(User.data.passportNumber);
        setEmail(User.data.email);
        setUsername(User.data.username);
    })
    },[]);
    

  const handleFName = (event) => {
    setFName(event.target.value);
    setClicked(true);
  };

  const handleLName = (event) => {
    setLName(event.target.value);
    setClicked(true);
  };

  const handleHomeAddress = (event) => {
    setHomeAddress(event.target.value);
    setClicked(true);
  };

  const handleCountryCode = (event) => {
    setCountryCode(event.target.value);
    setClicked(true);
  };

  const handleTelephoneNumber = (event) => {
    setTelephoneNumber(event.target.value);
    setClicked(true);
  };

  const handlePassportNumber = (event) => {
    setPassportNumber(event.target.value);
    setClicked(true);
  };

  const handleEmail = (event) => {
    setEmail(event.target.value);
    setClicked(true);
  };

  function update(){
      var userinfo={fName:fName,lName:lName,username:username,countryCode:countryCode,telephoneNumber:telephoneNumber,homeAddress:homeAddress,passportNumber:passportNumber,email:email};
      axios.put('/users/updateUser/youssef',userinfo,{headers:{}}).then(console.log("tmam"));
      window.location.reload(false);
  }

  return (
      <div>
          <Navbar loggedIn={true}/>
          <div></div>
          <Typography
          sx={{ m:1, flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          My Information
        </Typography>
        <Box
        component="form"
        sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
        >
        <div>
            <TextField
            id="username"
            label="Username"
            value={username}
            disabled
            />
        </div>
        <div>
            <TextField
            required
            id="fName"
            label="First name"
            value={fName}
            onChange={handleFName}
            />
            <TextField
            id="lName"
            label="Last Name"
            required
            value={lName}
            onChange={handleLName}
            />
        </div>
        <div>
            <TextField
            required
            id="email"
            label="E-mail"
            value={email}
            onChange={handleEmail}
            style ={{width: '40%'}}
            />
        </div>
        <div>
            <TextField
            required
            id="homeAddress"
            label="Home Address"
            multiline
            maxRows={5}
            value={homeAddress}
            onChange={handleHomeAddress}
            />
        </div>
        <div>
        <TextField
            required
            id="countryCode"
            label="Country Code"
            value={countryCode}
            onChange={handleCountryCode}
            style ={{width: '8%'}}
            />
            <TextField
            required
            id="telephoneNumber"
            label="Telephone Number(s)"
            value={telephoneNumber}
            onChange={handleTelephoneNumber}
            style ={{width: '23.5%'}}
            />
        </div>
        <div>
            <TextField
            required
            id="passportNumber"
            label="Passport number"
            value={passportNumber}  
            onChange={handlePassportNumber}
            style ={{width: '40%'}}
            />
        </div>
        <div>
            {clicked? (<Button onClick= {update} sx={{ m: 1 }} variant="contained" color="success">
                Update
            </Button>)
            :
            <></>}
            
        </div>
        </Box>
        </ div>
  );
}

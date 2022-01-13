import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react'
import {useNavigate} from 'react-router-dom';

export default function UserForm(props) {

    const [user,setUser]=React.useState();
    const [fName, setFName] = React.useState("");
    const [lName, setLName] = React.useState("");
    const [homeAddress, setHomeAddress] = React.useState("");
    const [countryCode, setCountryCode] = React.useState("");
    const [telephoneNumber, setTelephoneNumber] = React.useState("");
    const [passportNumber, setPassportNumber] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [username, setUsername] = React.useState("");
    const [password1, setPassword1] = React.useState("");
    const [password2, setPassword2] = React.useState("");
    const [clicked, setClicked] = React.useState(false);
    const [errors,setErrors] = React.useState();

        useEffect(()=>{
            if(!props.signUp){
              const path="/users/userInfo/"+localStorage.getItem('username');
                axios.get(path)
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
            }
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

  const handleUsername = (event) => {
    setUsername(event.target.value);
    setClicked(true);
  };

  const handlePassword1 = (event) => {
    setPassword1(event.target.value);
    setClicked(true);
  };

  const handlePassword2 = (event) => {
    setPassword2(event.target.value);
    setClicked(true);
  };

  const navigate = useNavigate();

  function toLogin(){
    navigate('/login');
  }

  function update(){
      var userinfo={fName:fName,lName:lName,username:username,password1:password1,password2:password2,countryCode:countryCode,telephoneNumber:telephoneNumber,homeAddress:homeAddress,passportNumber:passportNumber,email:email};
      if(props.signUp){
        axios.post('/users/signUp',userinfo,{headers:{}}).then(res=>{
          setErrors(res.data.errors);
          console.log(res.data.errors);
          if(res.data.errors==null){
            navigate('/login');
          }
        });
      }
      else{
        const path="/users/updateUser/"+localStorage.getItem('username');
        axios.put(path,userinfo,{headers:{}}).then(res=>{
          setErrors(res.data.errors);
          if(res.data.errors==null){
            window.location.reload();
          }
        });
      }
  }

  function changePassword(){
    navigate('/changePassword',{
      state: {
        username:username
      }
    });
  }

  return (
      <div>
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
            {!props.signUp? (
                <div>
                <TextField
                    id="username"
                    label="Username"
                    value={username}
                    disabled
                />
                </div>
            ):
            (
                <div>
                <TextField
                    id="username"
                    label="Username"
                    value={username}
                    onChange={handleUsername}
                    required
                />
                <TextField
                    id="password1"
                    label="Password"
                    type="password"
                    value={password1}
                    onChange={handlePassword1}
                    required
                />
                <TextField
                    id="password2"
                    label="Confirm password"
                    type="password"
                    value={password2}
                    onChange={handlePassword2}
                    required
                />
                </div>
            )}
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
            style ={{width: '18%'}}
            />
            <TextField
            required
            id="telephoneNumber"
            label="Telephone Number(s) (Comma Separated)"
            multiline
            maxRows={4}
            value={telephoneNumber}
            onChange={handleTelephoneNumber}
            style ={{width: '20.8%'}}
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
        <div style={{color: "red", textIndent:12}}>
          {errors}
        </div>
        <div>
            {!props.signUp?(
            <div>
          <Button onClick= {changePassword} sx={{ m: 1 }} variant="contained" color="info">
            Change password
          </Button>
            {clicked? (<Button onClick= {update} sx={{ m: 1 }} variant="contained" color="success">
                Update information
            </Button>)
            :
            <></>}
            </div>):
            (
                <div>
                    <Button onClick= {update} sx={{ m: 1 }} variant="contained" color="success">
                        Sign Up
                    </Button>
                    <Button onClick ={toLogin} sx={{ m: 1 }} variant="contained" color="info">
                        Login instead
                    </Button>
                </div>
        )

            }
            
        </div>
        </Box>
        </ div>
  );
}

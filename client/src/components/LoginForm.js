import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import Button from '@mui/material/Button';
import {useNavigate} from 'react-router-dom';

export default function LoginForm(props)
{
    const [username,setUsername] = React.useState("");
    const [password,setPassword] = React.useState("");
    const [errors,setErrors] = React.useState();

    const navigate = useNavigate();
    function toSignUp(){
        navigate('/signUp');
    }
    const handleUsername = (event) => {
        setUsername(event.target.value);
      };
    
      const handlePassword = (event) => {
        setPassword(event.target.value);
      };
    function login()
    {
        var userinfo={username:username,password:password};
        axios.post('/users/login',userinfo,{headers:{}}).then(res=>{
          setErrors(res.data.errors);
          if(res.data.errors==null){
            console.log(res.data.username);
            localStorage.setItem('username',res.data.username);
            localStorage.setItem('type',res.data.type);
            console.log(localStorage.getItem('type'));
            if(res.data.type=="Admin")
              navigate("/admin")
            else
              props.buttonFunction();
            }
            //console.log(res);
        })
    }
    return (
        <div className="App">
          <Typography
          sx={{ m:1, flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Login
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
            required
            id="username"
            label="Username"
            value={username}
            onChange={handleUsername}
            style ={{width: '40%'}}
            />
        </div>
        <div>
            <TextField
            required
            id="password"
            label="Password"
            value={password}
            onChange={handlePassword}
            style ={{width: '40%'}}
            type="password"
            />
        </div>
        <div style={{color: "red"}}>
          {errors}
        </div>
        <div>
            <Button onClick= {login} sx={{ m: 1 }} variant="contained" color="success">
            Login
            </Button>
            <Button onClick ={toSignUp} sx={{ m: 1 }} variant="contained" color="info">
                Sign up instead
            </Button>
        </div>
        </Box>
        </div>

    );
}

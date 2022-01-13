import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import Button from '@mui/material/Button';
import {useNavigate} from 'react-router-dom';

export default function PasswordForm(props)
{
    const [newPassword1,setNewPassword1] = React.useState("");
    const [newPassword2,setNewPassword2] = React.useState("");
    const [oldPassword,setOldPassword] = React.useState("");
    const [errors,setErrors] = React.useState();

    const navigate = useNavigate();
    
      const handleOldPassword = (event) => {
        setOldPassword(event.target.value);
      };

      const handleNewPassword1 = (event) => {
        setNewPassword1(event.target.value);
      };

      const handleNewPassword2 = (event) => {
        setNewPassword2(event.target.value);
      };

    function changePassword()
    {
        var userinfo={oldPassword:oldPassword,newPassword1:newPassword1,newPassword2:newPassword2};
        var path="/users/changePassword/"+localStorage.getItem('username');
        axios.put(path,userinfo,{headers:{}}).then(res=>{
            if(res.data.errors=="Password changed successfully!")
                toMyInformation();
            else
                setErrors(res.data.errors);
        })
    }

    function toMyInformation(){
        navigate('/myInformation',{
          state: {
            username:props.username
          }
        });
    }
    return (
        <div className="App">
          <Typography
          sx={{ m:1, flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Change password
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
            id="oldPassword"
            label="Old password"
            value={oldPassword}
            onChange={handleOldPassword}
            style ={{width: '30%'}}
            type="password"
            />
        </div>
        <div>
            <TextField
            required
            id="newPassword1"
            label="New password"
            value={newPassword1}
            onChange={handleNewPassword1}
            style ={{width: '30%'}}
            type="password"
            />
        </div>
        <div>
            <TextField
            required
            id="newPassword2"
            label="Confirm new password"
            value={newPassword2}
            onChange={handleNewPassword2}
            style ={{width: '30%'}}
            type="password"
            />
        </div>
        <div style={{color: "red"}}>
            {errors}
        </div>
        <div>
            <Button onClick= {toMyInformation} sx={{ m: 1 }} variant="contained" color="info">
            Go back
            </Button>
            <Button onClick= {changePassword} sx={{ m: 1 }} variant="contained" color="success">
            Change
            </Button>
        </div>
        </Box>
        </div>

    );
}

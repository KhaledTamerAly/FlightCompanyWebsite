import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import {useNavigate} from 'react-router-dom';

export default function Navbar(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);


  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

    const navigate = useNavigate();

    function goToMyReservations() {
        handleClose();
        navigate('/myReservations');
    }

    function goToMyInformation() {
        handleClose();
        navigate('/myInformation')
      }

    function goToHomepage() {
      handleClose();
      localStorage.removeItem('username');
      localStorage.removeItem('type');
      navigate('/',{
        state: {
          loggedIn:false
        }
      });
      window.location.reload();
    }

    function signUp(){
      navigate('/signUp');
    }

    function login(){
      navigate('/login');
    }

    function mainButton(){
      if(props.loggedIn){
        navigate('/',{
        state: {
          loggedIn:true
        }
      });
      window.location.reload();
    }
      else
        goToHomepage();
    }
    
  return (

    
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
        <Button onClick={mainButton} variant="text" style={{fontSize: "30px", textAlign: "right"}} color="inherit" sx={{ flexGrow: 1 }}>
            {'Osama Airlines'}
          </Button>
          {props.loggedIn && props.signUp==null &&(
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={goToMyReservations}>My reservations</MenuItem>
                <MenuItem onClick={goToMyInformation}>My information</MenuItem>
                <MenuItem onClick={goToHomepage}>Log out</MenuItem>
              </Menu>
            </div>
          )}
          {!props.loggedIn && props.signUp==null &&(
            <div>
              <Button onClick= {signUp} sx={{ m: 1 }} variant="contained" color='warning'>Sign up</Button>
              <Button onClick= {login} sx={{ m: 1 }} variant="contained" color='warning'>Login</Button>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
import React, { useState } from 'react';
import {Form, FormGroup, Label, Input, Button} from 'reactstrap';
import {useNavigate} from 'react-router-dom';

function Login()
{
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");

    const navigate = useNavigate();
    function goToAdmin() 
    {
        navigate('/admin')
    }
    function handleTypingUsername(event)
    {
        setUsername(event.target.value)
    }
    function handleTypingPassword(event)
    {
        setPassword(event.target.value)
    }
    function loggingIn()
    {
        var uName = username;
        var pass = password;

        goToAdmin();
    }
    return (
        <Form inline>
  <FormGroup className="mb-2 me-sm-2 mb-sm-0">
    <Label
      className="me-sm-2"
      for="exampleUsername"
    >
      Username
    </Label>
    <Input
      id="exampleUsername"
      name="username"
      value = {username}
      placeholder=""
      type="username"
      onChange={handleTypingUsername}
    />
  </FormGroup>
  <FormGroup className="mb-2 me-sm-2 mb-sm-0">
    <Label
      className="me-sm-2"
      for="examplePassword"
    >
      Password
    </Label>
    <Input
      id="examplePassword"
      name="password"
      value = {password}
      type="password"
      onChange={handleTypingPassword}
    />
  </FormGroup>
  <Button onClick={loggingIn}> Submit</Button>
</Form>

    );
}

export default Login;
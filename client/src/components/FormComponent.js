import React, { useState } from 'react';
import {Form,FormGroup,Label,Input,Button} from 'reactstrap';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

function FormComponent (props){

  const [flightNumber,setFlightNumber]= useState("");
  const [departureTerminal,setDepartureTerminal]= useState("");
  const [arrivalTerminal,setArrivalTerminal]= useState("");
  const [flightDate,setFlightDate]= useState("");
  const [departureTime,setDepartureTime]= useState("");
  const [arrivalTime,setArrivalTime]= useState("");
  const [noOfEconSeats,setNoOfEconSeats]= useState(0);
  const [noOfBusinessSeats,setNoOfBusinessSeats]= useState(0);
  const [noOfFirstSeats,setNoOfFirstSeats]= useState(0);
  const [errors,setErrors]= useState({});


  const navigate = useNavigate();

  function goToAdmin() {
      navigate('/admin')
    }

  let onSubmit=(event) =>{
    
  const newFlight={
    flightNumber:flightNumber,
    departureTerminal:departureTerminal,
    arrivalTerminal:arrivalTerminal,
    flightDate:flightDate,
    departureTime:departureTime,
    arrivalTime:arrivalTime,
    noOfEconSeats:noOfEconSeats,
    noOfBusinessSeats:noOfBusinessSeats,
    noOfFirstSeats:noOfFirstSeats
  }
  console.log(newFlight);

  const api={};
  var path='/flights/';

  if (props.add){
    path+='link';
    axios.post(path,newFlight,{headers: api});
  }
  else{
    path+=props.id;
    axios.put(path,newFlight,{headers: api});
    event.preventDefault();
    
  }
  console.log("axios tmam")
  
}
  
    return (<Form noValidate onSubmit={onSubmit}>
        <FormGroup>
          <Label for="flightNumber">
            Flight Number
          </Label>
          <Input
            id="flightNumber"
            name="flightNumber"
            value={flightNumber}
            onChange={(event)=> setFlightNumber(event.target.value)}
            error={errors.flightNumber}
            placeholder="Example: MS 107"
            type="flightNumber"
          />
        </FormGroup>
        <FormGroup>
          <Label for="departureTerminal">
            Departure Terminal
          </Label>
          <Input
            id="departureTerminal"
            name="departureTerminal"
            value={departureTerminal}
            onChange={(event)=> setDepartureTerminal(event.target.value)}
            error={errors.departureTerminal}
            placeholder="Example: JFK"
            type="departureTerminal"
          />
        </FormGroup>
        <FormGroup>
          <Label for="arrivalTerminal">
            Arrival Terminal
          </Label>
          <Input
            id="arrivalTerminal"
            name="arrivalTerminal"
            value={arrivalTerminal}
            onChange={(event)=> setArrivalTerminal(event.target.value)}
            error={errors.arrivalTerminal}
            placeholder="Example: JFK"
            type="arrivalTerminal"
          />
        </FormGroup>
        <FormGroup>
          <Label for="flightDate">
          Flight Date
          </Label>
          <Input
            id="flightDate"
            value={flightDate}
            onChange={(event)=> setFlightDate(event.target.value)}
            error={errors.flightDate}
            name="flightDate"
            type="date"
          />
        </FormGroup>
        <FormGroup>
          <Label for="departureTime">
            Departure Time
            </Label>
            <Input
            id="departureTime"
            value={departureTime}
            onChange={(event)=> setDepartureTime(event.target.value)}
            error={errors.departureTime}
            name="departureTime"
            type="time"
          />
        </FormGroup>
        <FormGroup>
          <Label for="arrivalTime">
            Arrival Time
            </Label>
            <Input
            id="arrivalTime"
            value ={arrivalTime}
            onChange={(event)=> setArrivalTime(event.target.value)}
            error={errors.arrivalTime}
            name="arrivalTime"
            type="time"
          />
        </FormGroup>
        <FormGroup>
          <Label for="noOfEconSeats">
            Number of Economy class seats
          </Label>
          <Input
            id="noOfEconSeats"
            value={noOfEconSeats}
            onChange={(event)=> setNoOfEconSeats(event.target.value)}
            error={errors.noOfEconSeats}
            name="noOfEconSeats"
            type="noOfEconSeats"
          />
        </FormGroup>
        <FormGroup>
          <Label for="noOfBusinessSeats">
            Number of Business class seats
          </Label>
          <Input
            id="noOfBusinessSeats"
            value={noOfBusinessSeats}
            onChange={(event)=> setNoOfBusinessSeats(event.target.value)}
            error={errors.noOfBusinessSeats}
            name="noOfBusinessSeats"
            type="noOfBusinessSeats"
          />
        </FormGroup>
        <FormGroup>
          <Label for="noOfFirstSeats">
            Number of First class seats
          </Label>
          <Input
            id="noOfFirstSeats"
            value={noOfFirstSeats}
            onChange={(event)=> setNoOfFirstSeats(event.target.value)}
            error={errors.noOfFirstSeats}
            name="noOfFirstSeats"
            type="noOfFirstSeats"
          />
        </FormGroup>
        <Button  color= "success" type="submit"> Submit </Button>
        <Button color="primary" type="button" onClick={goToAdmin}> Home page </Button>
        </Form>);
}

export default FormComponent;
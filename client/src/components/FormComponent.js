import React, { useState,useEffect } from 'react';
import {Form,FormGroup,Label,Input,Button} from 'reactstrap';
import axios from 'axios';
import {useNavigate} from 'react-router-dom'

function FormComponent (props){

  const [flightNumber,setFlightNumber]= useState("");
  const [departureTerminal,setDepartureTerminal]= useState("");
  const [arrivalTerminal,setArrivalTerminal]= useState("");
  const [flightDate,setFlightDate]= useState("");
  const [departureTime,setDepartureTime]= useState("");
  const [arrivalTime,setArrivalTime]= useState("");
  const [noOfEconSeats,setNoOfEconSeats]= useState("");
  const [noOfBusinessSeats,setNoOfBusinessSeats]= useState("");
  const [noOfFirstSeats,setNoOfFirstSeats]= useState("");
  const [didChange,setDidChange]= useState(false);
  const [errors,setErrors]= useState({});

  useEffect(()=>{
    if(!props.add){
      const path="/flights/"+props.id;
        axios.get(path)
        .then(flight=> {
            setFlightNumber(flight.data.flightNumber);
            setDepartureTerminal(flight.data.departureTerminal);
            setArrivalTerminal(flight.data.arrivalTerminal);
            setNoOfEconSeats(flight.data.noOfEconSeats);
            setNoOfBusinessSeats(flight.data.noOfBusinessSeats);
            setNoOfFirstSeats(flight.data.noOfFirstSeats);
            console.log(flight);
        })
    }
},[]);

  const navigate = useNavigate();

  function goToAdmin() {
      navigate('/admin')
    }


    function goToAddFlight(){
      navigate('/editFlight', { state:{isAdd:true}, replace:false })
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
    noOfFirstSeats:noOfFirstSeats,
    didChange:didChange
  }
  console.log(newFlight);
  
  const api={};
  var path='/flights/';

  if (props.add){
    path+='link';
    axios.post(path,newFlight,{headers: api});
    event.preventDefault();
    window.location.reload();
  }
  else{
    path+=props.id;
    axios.put(path,newFlight,{headers: api});
    event.preventDefault();
    goToAdmin();
  }
  
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
            onChange={(event)=> {setFlightNumber(event.target.value);setDidChange(true)}}
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
            Number of Economy class seats (must be a number)
          </Label>
          <Input
            id="noOfEconSeats"
            value={noOfEconSeats}
            onChange={(event)=> {
              if(!isNaN(event.target.value))
                setNoOfEconSeats(event.target.value);
            }}
            error={errors.noOfEconSeats}
            name="noOfEconSeats"
            type="text"
          />
        </FormGroup>
        <FormGroup>
          <Label for="noOfBusinessSeats">
            Number of Business class seats (must be a number)
          </Label>
          <Input
            id="noOfBusinessSeats"
            value={noOfBusinessSeats}
            onChange={(event)=> {
              if(!isNaN(event.target.value))
                setNoOfBusinessSeats(event.target.value);
            }}
            error={errors.noOfBusinessSeats}
            name="noOfBusinessSeats"
            type="noOfBusinessSeats"
          />
        </FormGroup>
        <FormGroup>
          <Label for="noOfFirstSeats">
            Number of First class seats (must be a number)
          </Label>
          <Input
            id="noOfFirstSeats"
            value={noOfFirstSeats}
            onChange={(event)=> {
              if(!isNaN(event.target.value))
                setNoOfFirstSeats(event.target.value);
            }
            }
            error={errors.noOfFirstSeats}
            name="noOfFirstSeats"
            type="noOfFirstSeats"
          />
        </FormGroup>
        <Button color="primary" type="button" onClick={goToAdmin}> Go back </Button>
        <Button  color= "success" type="submit"> Submit </Button>
        </Form>);
}

export default FormComponent;
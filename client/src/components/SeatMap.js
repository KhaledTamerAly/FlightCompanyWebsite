import '../App.css';
import React, { Component ,  useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import { Paper } from '@mui/material';
function SeatMap(props) 
{
    const [flightSeats,setFlightSeats] = useState([]);
    const [chosenSeats,setChosenSeats] = useState([]);
    const [numberOfSeatsToReservre, setNumberOfSeat] = useState(props.numberOfSeats)

async function updateStates() 
{
   const bodyDep = { 
    flightNumber: props.flightNumber,
  }
    const api = {};
    await axios.post('/flights/seatsOf/', bodyDep, {headers: api}).then(res=> setFlightSeats(res.data));
}
useEffect(async()=>
    {
        updateStates();
    },[]);
    function handleChange(event, seatNumber)
    {
        if(event.target.checked)
        {
            if(numberOfSeatsToReservre>0)
            {
                props.func(seatNumber,true);
                setNumberOfSeat(numberOfSeatsToReservre-1);
            }
        }
        else
        {
            props.func(seatNumber,false);
            setNumberOfSeat(numberOfSeatsToReservre+1);
        }
    }
    return (
        <div>
            <h3>Select your prefered seats in your {props.type} flight with Flight Number: {props.flightNumber}</h3>
            <h4>You have {numberOfSeatsToReservre} seats to reserve</h4>
                {(flightSeats??[]).map((row, i) =>{
                return (
                    <Box>
                        <ol>
                        {
                        (row??[]).map((col, j) => 
                        {
                            if(col!=null)
                            {
                                if(props.oldSeats.includes(col.seatNumber) && props.oldSeats!=[])
                                {
                                    return (
                                        <FormControl component="fieldset" variant="standard" id={i+j}>
                                        <FormGroup>
                                        {col!=null && <FormControlLabel
                                        
                                        onChange={(event)=>{handleChange(event,col.seatNumber);
                                            if(event.target.checked)
                                            {
                                                col.isClicked = true;
                                            }
                                        else{
                                            col.isClicked = false;
                                        }}}
                                        id={i+j}
                                        control={<Checkbox disabled = {(numberOfSeatsToReservre==0 && !col.isClicked) || (col.cabinType != props.cabinType)}color="success"/>}
                                        label={col.seatNumber}
                                        labelPlacement="top"
                                        />}
                                        </FormGroup>
                                        </FormControl>
                                        );
                                }
                                else
                                {
                                    return (
                                            <FormControl component="fieldset" variant="standard" id={i+j}>
                                            <FormGroup>
                                            {col!=null && col.isTaken &&<FormControlLabel
                                            id={i+j}
                                            disabled
                                            control={<Checkbox color="default" disabled checked/>}
                                            label={col.seatNumber}
                                            labelPlacement="top"
                                            />}
                                            {col!=null && !col.isTaken && <FormControlLabel
                                            
                                            onChange={(event)=>{handleChange(event,col.seatNumber);
                                                if(event.target.checked)
                                                {
                                                    col.isClicked = true;
                                                }
                                            else{
                                                col.isClicked = false;
                                            }}}
                                            id={i+j}
                                            control={<Checkbox disabled = {(numberOfSeatsToReservre==0 && !col.isClicked) || (col.cabinType != props.cabinType)}color="success"/>}
                                            label={col.seatNumber}
                                            labelPlacement="top"
                                            />}
                                            </FormGroup>
                                            </FormControl>
                                            );
                                }
                            } 
                        })
                        }
                        </ol>
                        </Box>
                );
                })
            }
        </div>
    );
}

export default SeatMap;
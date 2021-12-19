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

function SeatMap(props) 
{
    const [flightSeats,setFlightSeats] = useState([]);
    const [chosenSeats,setChosenSeats] = useState([]);


async function updateStates() 
{
    await axios.get('/flights/seatsOf/'+props.id)
    .then(res =>{
      const allFlights = res.data;
      setFlightSeats(allFlights);
   })
}
useEffect(async()=>
{
    updateStates();
},[]);
    return (
        <div>
                {
                    (flightSeats??[]).map((row, i) =>
                    {
                        return (
                            <Box>
                                <ol>
                                    {
                                        (row??[]).map((col, j) => 
                                        {
                                            if(col!=null)
                                            console.log(col.isTaken+ " " + col.seatNumber);
                                            return (
                                                <FormControl component="fieldset" variant="standard" id={i}>
                                                        <FormGroup>
                                                            {col!=null && col.isTaken && <FormControlLabel
                                                                disabled
                                                                control={<Checkbox color="default" disabled checked/>}
                                                                label={col.seatNumber}
                                                                labelPlacement="top"
                                                            />}
                                                            {col!=null && !col.isTaken && <FormControlLabel
                                                                control={<Checkbox color="success"/>}
                                                                label={col.seatNumber}
                                                                labelPlacement="top"
                                                            />}
                                                        </FormGroup>
                                                </FormControl>
                                            );
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
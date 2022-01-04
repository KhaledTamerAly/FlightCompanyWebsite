import '../App.css';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import SeatMap from './SeatMap';
import { Button } from '@mui/material';


function SeatChange(props)
{

    const [chosenSeats,setChosenSeats] = useState([]);
    const [isSelectedAllSeats, setIsSelectedSeats] = useState(true);
    const [reservation, setReservation] = useState(null);

    useEffect(()=>{
        axios.get('/users/reservationDetails/'+props.bookingNumber).then(res=>{
            setReservation(res.data);
        })
    },[]);

    function chooseSeats(seatNumber,isAdd)
    {
        if(isAdd)
        {
            var allChecked = chosenSeats;
            allChecked.push(seatNumber);
            setChosenSeats(allChecked);
            console.log(chosenSeats);
        }
        else
        {
            var newChosenSeats = chosenSeats;
            const index = newChosenSeats.indexOf(seatNumber);
            newChosenSeats.splice(index,1);
            setChosenSeats(newChosenSeats);
            console.log(chosenSeats);
        }
    }
    async function handleClick()
    {
        if(reservation==null)
            return;
        if(chosenSeats.length!=reservation.chosenSeats.length)
            setIsSelectedSeats(false);
        else
            {
                const bodyDep = { 
                        bookingNumber:reservation.bookingNumber,
                        chosenSeats: chosenSeats,
                        oldChosenSeats: reservation.chosenSeats,
                        flightNumber: reservation.flightNumber
                    }
                const api = {};
                axios.post('/users/updateSeatReservation', bodyDep, {headers: api});
                window.location.reload();
            }
    }
    return (
        <div>
                {!isSelectedAllSeats && <h5>Please Select more seats</h5>}
                {reservation && 
                    <SeatMap oldSeats = {reservation.chosenSeats} cabinType = {reservation.cabinType} flightNumber={reservation.flightNumber} numberOfSeats ={reservation.chosenSeats.length}  type="" func={chooseSeats}/>
                }
                <Button color="success" onClick={handleClick}> Confirm Seats </Button>
    </div>
    );
}

export default SeatChange;


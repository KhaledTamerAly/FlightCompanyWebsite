import '../App.css';
import React, { Component ,  useState, useEffect } from 'react';
import axios from 'axios';
import { Button} from 'reactstrap';
import SeatMap from './SeatMap';
import Summary from './Summary';


function SeatComponent(props)
{
    const [isChoosingDepSeats, setIsChoosingDep] = useState(true);
    const [isDoneChoosing, setIsDone] = useState(false);
    const [chosenSeatsDep,setChosenSeatsDep] = useState([]);
    const [chosenSeatsRet,setChosenSeatsRet] = useState([]);
    const [bookingNumberD, setBookingNumberD] = useState("");
    const [bookingNumberR, setBookingNumberR] = useState("");

    function chooseSeatsDep(seatNumber,isAdd)
    {
        if(isAdd)
        {
            var allChecked = chosenSeatsDep;
            allChecked.push(seatNumber);
            setChosenSeatsDep(allChecked);
            console.log(chosenSeatsDep);
        }
        else
        {
            var newChosenSeats = chosenSeatsDep;
            const index = newChosenSeats.indexOf(seatNumber);
            newChosenSeats.splice(index,1);
            setChosenSeatsDep(newChosenSeats);
            console.log(chosenSeatsDep);
        }
    }
    function chooseSeatsRet(seatNumber,isAdd)
    {
        if(isAdd)
        {
            var allChecked = chosenSeatsRet;
            allChecked.push(seatNumber);
            setChosenSeatsRet(allChecked);
            console.log(chosenSeatsRet);
        }
        else
        {
            var newChosenSeats = chosenSeatsRet;
            const index = newChosenSeats.indexOf(seatNumber);
            newChosenSeats.splice(index,1);
            setChosenSeatsRet(newChosenSeats);
            console.log(chosenSeatsRet);
        }
    }
    function exit()
    {

    }
    async function handleClick()
    {
        if(isChoosingDepSeats)
            setIsChoosingDep(false);
        else
            {
                //reserve axios
                
                const bodyDep = { 
                    username:props.userInfo.username,
                    firstName: props.userInfo.firstName,
                    lastName: props.userInfo.lastname,
                    passport: props.userInfo.passport,
                    email: props.userInfo.email,
                    flightNumber: props.depFlight,
                    chosenSeats: chosenSeatsDep
                  }
                    const api = {};
                    await axios.post('/users/addReservation', bodyDep, {headers: api}).then(res=> setBookingNumberD(res.data));

                const bodyRet = { 
                    username:props.userInfo.username,
                    firstName: props.userInfo.firstName,
                    lastName: props.userInfo.lastname,
                    passport: props.userInfo.passport,
                    email: props.userInfo.email,
                    flightNumber: props.retFlight,
                    chosenSeats: chosenSeatsRet
                  }
                    await axios.post('/users/addReservation', bodyRet, {headers: api}).then(res=>setBookingNumberR(res.data));
                    setIsDone(true);
            }
    }
    return (
        <div>
            {!isDoneChoosing && isChoosingDepSeats && <SeatMap flightNumber={props.depFlight} numberOfSeats ={props.depFlightNumSeats}  type="Departure" func={chooseSeatsDep}/>}
            {!isDoneChoosing &&!isChoosingDepSeats && <SeatMap flightNumber={props.retFlight} numberOfSeats ={props.retFlightNumSeats}  type="Return" func={chooseSeatsRet}/>}
            {isDoneChoosing &&!isChoosingDepSeats && <Summary depFlight= {props.depFlight} retFlight={props.retFlight} depCabinClass={props.depCabinClass} retCabinClass={props.retCabinClass} chosenSeatsD ={chosenSeatsDep} chosenSeatsR={chosenSeatsRet} bookingNumberD={bookingNumberD} bookingNumberR={bookingNumberR}/>}
            {!isDoneChoosing && <Button color="success" onClick={handleClick}> Confirm Seats </Button>}
            {isDoneChoosing && <Button color="primary" onClick={exit}> Go Back to Home Page </Button>}
    </div>
    );
}

export default SeatComponent;
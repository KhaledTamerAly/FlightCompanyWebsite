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
    function handleClick()
    {
        if(isChoosingDepSeats)
            setIsChoosingDep(false);
        else
            {
                //reserve axios
                setIsDone(true);
            }
    }
    return (
        <div>
            {!isDoneChoosing && isChoosingDepSeats && <SeatMap id={props.depFlight} numberOfSeats ={props.depFlightNumSeats}  type="Departure" func={chooseSeatsDep}/>}
            {!isDoneChoosing &&!isChoosingDepSeats && <SeatMap id={props.retFlight} numberOfSeats ={props.retFlightNumSeats}  type="Return" func={chooseSeatsRet}/>}
            {isDoneChoosing &&!isChoosingDepSeats && <Summary depFlight= {props.depFlight} retFlight={props.retFlight} depCabinClass={props.depCabinClass} retCabinClass={props.retCabinClass} chosenSeatsD ={chosenSeatsDep} chosenSeatsR={chosenSeatsRet}/>}
            {!isDoneChoosing && <Button color="success" onClick={handleClick}> Confirm Seats </Button>}
            {isDoneChoosing && <Button color="primary" onClick={exit}> Confirm Reservation </Button>}
    </div>
    );
}

export default SeatComponent;
import React, { Component ,  useState, useEffect } from 'react';
import SeatComponent from './SeatsComponent';
import Summary from './Summary';
import { Button,UncontrolledPopover,PopoverBody,PopoverHeader } from 'reactstrap';
import Payment from './Payment';
import SeatMap from './SeatMap';
import axios from 'axios';
import StripeComponent from './StripeComponent';



function ChangeFlights(props)
{
    const [isChangingMoreThanOneFlight, setIsChangingMTOF] = useState((props.flightsToChange.length>1));
    const [isChoosingFirstFlightSeats, setIsChoosingFFSeats] = useState(true);
    const [isDoneChoosing, setIsDone] = useState(false);
    const [chosenSeatsF,setChosenSeatsF] = useState([]);
    const [chosenSeatsS,setChosenSeatsS] = useState([]);
    const [bookingNumberF, setBookingNumberF] = useState(props.flightsToChange[0].bookingNumber);
    const [bookingNumberS, setBookingNumberS] = useState(props.flightsToChange[1]?.bookingNumber??"");
    const [isSelectedAllSeats, setIsSelectedSeats] = useState(true);
    const [didPay, setDidPay] = useState(false);
    
    function chooseSeatsF(seatNumber,isAdd)
    {
        if(isAdd)
        {
            var allChecked = chosenSeatsF;
            allChecked.push(seatNumber);
            setChosenSeatsF(allChecked);
            console.log(chosenSeatsF);
        }
        else
        {
            var newChosenSeats = chosenSeatsF;
            const index = newChosenSeats.indexOf(seatNumber);
            newChosenSeats.splice(index,1);
            setChosenSeatsF(newChosenSeats);
            console.log(chosenSeatsF);
        }
    }
    function chooseSeatsS(seatNumber,isAdd)
    {
        if(isAdd)
        {
            var allChecked = chosenSeatsS;
            allChecked.push(seatNumber);
            setChosenSeatsS(allChecked);
            console.log(chosenSeatsS);
        }
        else
        {
            var newChosenSeats = chosenSeatsS;
            const index = newChosenSeats.indexOf(seatNumber);
            newChosenSeats.splice(index,1);
            setChosenSeatsS(newChosenSeats);
            console.log(chosenSeatsS);
        }
    }
    async function handleClick()
        {
            if(isChoosingFirstFlightSeats)
            {
                if(chosenSeatsF.length==props.flightNumSeats)
                {
                        setIsChoosingFFSeats(false);
                        if(!isChangingMoreThanOneFlight)
                        {
                            setIsDone(true);
                        }
                }
                else
                    {
                        setIsSelectedSeats(false);
                    }
            }
            else
                {
                    //reserve axios
                    if(chosenSeatsS.length!=props.flightNumSeats)
                        setIsSelectedSeats(false);
                    else
                    {
                        setIsDone(true);
                        setIsSelectedSeats(false);      
                    }
                }
    }
    async function reserveFlights()
    {
            const bodyF = { 
                bookingNumber:props.flightsToChange[0].bookingNumber, 
                username:props.userInfo.username,
                firstName: props.userInfo.firstName,
                lastName: props.userInfo.lastname,
                passport: props.userInfo.passport,
                email: props.userInfo.email,
                flightNumber: props.flightsToChange[0].flightNumber,
                chosenSeats: chosenSeatsF,
                price:props.price,
                cabin:props.cabinClass,
                flightType: props.flightsToChange[0].type
            }
                const api = {};
                axios.post('/users/changeReservation', bodyF, {headers: api}).then((res)=> {console.log(isChangingMoreThanOneFlight);});
                
            if(isChangingMoreThanOneFlight)
            {
                const bodyS = { 
                    bookingNumber:props.flightsToChange[1].bookingNumber, 
                    username:props.userInfo.username,
                    firstName: props.userInfo.firstName,
                    lastName: props.userInfo.lastname,
                    passport: props.userInfo.passport,
                    email: props.userInfo.email,
                    flightNumber: props.flightsToChange[1].flightNumber,
                    chosenSeats: chosenSeatsS,
                    price:props.price,
                    cabin:props.cabinClass,
                    flightType: props.flightsToChange[1].type
                }
                    const api = {};
                    axios.post('/users/changeReservation', bodyS, {headers: api}).then((res)=> {});
                }
                setDidPay(true);
    }
    return (
        <div className="App">
            {!isDoneChoosing && isChoosingFirstFlightSeats && 
                <>
                {!isSelectedAllSeats && <h5>Please Select more seats</h5>}
                <SeatMap oldSeats = {[]} cabinType = {props.cabinClass} flightNumber={props.flightsToChange[0].flightNumber} numberOfSeats ={props.flightNumSeats}  type={props.flightsToChange[0].type} func={chooseSeatsF}/>
                </>
            } 
            {!isDoneChoosing && isChangingMoreThanOneFlight &&!isChoosingFirstFlightSeats && 
                <>
                {!isSelectedAllSeats && <h5>Please Select more seats</h5>}
                <SeatMap oldSeats={[]} cabinType = {props.cabinClass} flightNumber={props.flightsToChange[1].flightNumber} numberOfSeats ={props.flightNumSeats}  type={props.flightsToChange[1].type} func={chooseSeatsS}/>
                </>
            }
            
            {isDoneChoosing &&!isChoosingFirstFlightSeats && didPay && <Summary depFlight= {props.flightsToChange[0].flightNumber} retFlight={props.flightsToChange[1]?.flightNumber??null} cabinClass={props.cabinClass} chosenSeatsD ={chosenSeatsF} chosenSeatsR={chosenSeatsS} bookingNumberD={bookingNumberF} bookingNumberR={bookingNumberS} price={props.price}/>}
            {isDoneChoosing && !isChoosingFirstFlightSeats && !didPay && <StripeComponent price = {props.price} reserve= {reserveFlights}/>}
            {!isDoneChoosing && <Button color="success" onClick={handleClick}> Confirm Seats </Button>}
            {!isDoneChoosing && isChoosingFirstFlightSeats && <Button color="primary" onClick={props.backButton}> Go Back to see summary </Button>}
            {!isDoneChoosing && !isChoosingFirstFlightSeats && <Button color="primary" onClick={()=>{setIsChoosingFFSeats(true);setChosenSeatsF([])}}> Go Back to choose first flight seats again</Button>}
    </div>
    );
}

export default ChangeFlights;
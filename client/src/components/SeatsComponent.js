import '../App.css';
import React, { Component ,  useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import { Button} from 'reactstrap';
import SeatMap from './SeatMap';
import Summary from './Summary';
import StripeComponent from './StripeComponent'


function SeatComponent(props)
{
    const [isChoosingDepSeats, setIsChoosingDep] = useState(true);
    const [isDoneChoosing, setIsDone] = useState(false);
    const [chosenSeatsDep,setChosenSeatsDep] = useState([]);
    const [chosenSeatsRet,setChosenSeatsRet] = useState([]);
    const [bookingNumberD, setBookingNumberD] = useState("");
    const [bookingNumberR, setBookingNumberR] = useState("");
    const [isSelectedAllSeats, setIsSelectedSeats] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(props.isLoggedIn);
    const [didPay, setDidPay] = useState(false);

    const navigate = useNavigate();
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
        navigate('/',{
            state: {
              loggedIn:true
            }
          });
          window.location.reload();
    }
    async function handleClick()
    {
        if(isChoosingDepSeats)
        {
            if(chosenSeatsDep.length==props.depFlightNumSeats)
                setIsChoosingDep(false);
            else
                setIsSelectedSeats(false);
        }
        else
            {
                //reserve axios
                if(chosenSeatsRet.length!=props.retFlightNumSeats)
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
        const bodyDep = { 
            username:props.userInfo.username,
            firstName: props.userInfo.firstName,
            lastName: props.userInfo.lastname,
            passport: props.userInfo.passport,
            email: props.userInfo.email,
            flightNumber: props.depFlight,
            chosenSeats: chosenSeatsDep,
            price:props.price,
            cabin:props.depCabinClass,
            flightType: "Departure"
        }
        const bodyRet = { 
            username:props.userInfo.username,
            firstName: props.userInfo.firstName,
            lastName: props.userInfo.lastname,
            passport: props.userInfo.passport,
            email: props.userInfo.email,
            flightNumber: props.retFlight,
            chosenSeats: chosenSeatsRet,
            price:props.price,
            cabin: props.retCabinClass,
            flightType: "Return"
        }
            const api = {};
            await axios.post('/users/addReservation', bodyDep, {headers: api}).then(async(res1)=> {
                setBookingNumberD(res1.data);
                await axios.post('/users/addReservation', bodyRet, {headers: api}).then(async(res2)=>{
                    setBookingNumberR(res2.data)
                    setDidPay(true);
                    const body = { 
                        departBookingNumber: res1.data,
                        returnBookingNumber: res2.data
                    }
                    await axios.post('users/linkReservations', body, {headers: api});
                });
                
            });
    }
    return (
        <div>
            {isLoggedIn && <>
                {!isDoneChoosing && isChoosingDepSeats && 
                <>
                {!isSelectedAllSeats && <h5>Please Select more seats</h5>}
                <SeatMap oldSeats = {[]} cabinType = {props.depCabinClass} flightNumber={props.depFlight} numberOfSeats ={props.depFlightNumSeats}  type="Departure" func={chooseSeatsDep}/>
                </>
                }
                
                {!isDoneChoosing &&!isChoosingDepSeats && 
                <>
                {!isSelectedAllSeats && <h5>Please Select more seats</h5>}
                <SeatMap oldSeats={[]} cabinType = {props.retCabinClass} flightNumber={props.retFlight} numberOfSeats ={props.retFlightNumSeats}  type="Return" func={chooseSeatsRet}/>
                </>
                }
                
                {isDoneChoosing &&!isChoosingDepSeats && didPay && <Summary depFlight= {props.depFlight} retFlight={props.retFlight} depCabinClass={props.depCabinClass} retCabinClass={props.retCabinClass} chosenSeatsD ={chosenSeatsDep} chosenSeatsR={chosenSeatsRet} bookingNumberD={bookingNumberD} bookingNumberR={bookingNumberR} price={props.price}/>}
                {isDoneChoosing && !isChoosingDepSeats && !didPay && <StripeComponent price = {props.price} reserve= {reserveFlights}/>}
                {!isDoneChoosing && <Button color="success" onClick={handleClick}> Confirm Seats </Button>}
                {isDoneChoosing && <Button color="primary" onClick={exit}> Go Back to Home Page </Button>}
                {!isDoneChoosing && isChoosingDepSeats && <Button color="primary" onClick={props.backButton}> Go Back to see summary </Button>}
                {!isDoneChoosing && !isChoosingDepSeats && <Button color="primary" onClick={()=>{setIsChoosingDep(true);setChosenSeatsDep([])}}> Go Back to choose Departure Seats Again</Button>}
                </>
            }
            {!isLoggedIn && <>
            
            <h3 style={{ color: 'red' }}>Please Login</h3>
            <Button color="success" onClick={()=>{props.login();setIsLoggedIn(true)}}>Login</Button>
            </>
            }
    </div>
    );
}

export default SeatComponent;
import '../App.css';
import React, { Component ,  useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import { Button} from 'reactstrap';
import SeatMap from './SeatMap';
import Summary from './Summary';
import LoginForm from './LoginForm';


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
    const [username, setUsername] = useState(null);

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
                    var user = null;
                    if(props.userInfo!=null)
                    {
                        user = props.userInfo;
                    }
                    else
                    {
                        const path="users/userInfo/"+localStorage.getItem('username');
                        await axios.get(path).then(userRes=> {
                        const userInfoObject=  {
                            username:userRes.data.username,
                            firstName: userRes.data.fName,
                            lastname: userRes.data.lName,
                            passport: userRes.data.passportNumber,
                            email: userRes.data.email
                        }
                        user = userInfoObject;
                        });
                    }
                    const bodyDep = { 
                        username:user.username,
                        firstName: user.firstName,
                        lastName: user.lastname,
                        passport: user.passport,
                        email: user.email,
                        flightNumber: props.depFlight,
                        chosenSeats: chosenSeatsDep,
                        price:props.price,
                        cabin:props.depCabinClass
                    }
                        const api = {};
                        await axios.post('/users/addReservation', bodyDep, {headers: api}).then(res=> setBookingNumberD(res.data));

                    const bodyRet = { 
                        username:user.username,
                        firstName: user.firstName,
                        lastName: user.lastname,
                        passport: user.passport,
                        email: user.email,
                        flightNumber: props.retFlight,
                        chosenSeats: chosenSeatsRet,
                        price:props.price,
                        cabin: props.retCabinClass
                    }
                        await axios.post('/users/addReservation', bodyRet, {headers: api}).then(res=>setBookingNumberR(res.data));
                        setIsDone(true);
                        setIsSelectedSeats(false);
                    }
            }
    }
    return (
        <div>
            {console.log(localStorage.getItem('username'))}
            {isLoggedIn && <>
                {!isDoneChoosing && isChoosingDepSeats && 
                <>
                {!isSelectedAllSeats && <h5>Please Select more seats</h5>}
                <SeatMap cabinType = {props.depCabinClass} flightNumber={props.depFlight} numberOfSeats ={props.depFlightNumSeats}  type="Departure" func={chooseSeatsDep}/>
                </>
                }
                
                {!isDoneChoosing &&!isChoosingDepSeats && 
                <>
                {!isSelectedAllSeats && <h5>Please Select more seats</h5>}
                <SeatMap cabinType = {props.retCabinClass} flightNumber={props.retFlight} numberOfSeats ={props.retFlightNumSeats}  type="Return" func={chooseSeatsRet}/>
                </>
                }
                
                {isDoneChoosing &&!isChoosingDepSeats && <Summary depFlight= {props.depFlight} retFlight={props.retFlight} depCabinClass={props.depCabinClass} retCabinClass={props.retCabinClass} chosenSeatsD ={chosenSeatsDep} chosenSeatsR={chosenSeatsRet} bookingNumberD={bookingNumberD} bookingNumberR={bookingNumberR} price={props.price}/>}
                {!isDoneChoosing && <Button color="success" onClick={handleClick}> Confirm Seats </Button>}
                {isDoneChoosing && <Button color="primary" onClick={exit}> Go Back to Home Page </Button>}
                {!isDoneChoosing && isChoosingDepSeats && <Button color="primary" onClick={props.backButton}> Go Back to see summary </Button>}
                {!isDoneChoosing && !isChoosingDepSeats && <Button color="primary" onClick={()=>{setIsChoosingDep(true);setChosenSeatsDep([])}}> Go Back to choose Departure Seats Again</Button>}
                </>
            }
            {!isLoggedIn && <>
            <LoginForm buttonFunction={(username)=>{props.login(username);setIsLoggedIn(true); setUsername(username)}}/>
            </>
            }
    </div>
    );
}

export default SeatComponent;
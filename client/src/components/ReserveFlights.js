import React, { Component ,  useState, useEffect } from 'react';
import SeatComponent from './SeatsComponent';
import Summary from './Summary';
import { Button,UncontrolledPopover,PopoverBody,PopoverHeader } from 'reactstrap';
import Payment from './Payment';



function ReserveFlights(props)
{
    const [isDoneConfirm, setIsDone] = useState(false);

    var priceOfSeat;
    if(props.cabinClass=="Economy")
        priceOfSeat = 10;
    else if(props.cabinClass=="First")
        priceOfSeat = 30;
    else
        priceOfSeat = 20;

    return (
        
        <div>
            { !isDoneConfirm && 

            <>
                <Summary depFlight= {props.depFlight} retFlight={props.retFlight} cabinClass={props.cabinClass} 
                chosenSeatsD ={[]} chosenSeatsR={[]} 
                bookingNumberD={""} bookingNumberR={""} price = {(priceOfSeat*props.flightNumSeats)+props.price}/>

                <div className="text-center">
                <Button
                        id={"UncontrolledPopover"}
                        type="button"
                        color="success"
                >
                    Choose Seats
                </Button>
                <UncontrolledPopover
                        placement="right"
                        target={"UncontrolledPopover"}
                        trigger="legacy"
                >
                    <PopoverHeader>
                        Are you sure?
                    </PopoverHeader>
                    <PopoverBody>
                        Click outside this popup to return.
                    </PopoverBody>
                        <div className="text-center">
                        <Button
                            id="deleteConfirm"
                            type="button"
                            color="success"
                            onClick = {()=>{setIsDone(true)}}
                        >
                        Choose Seats, I am Sure.
                        </Button>
                        </div>
                </UncontrolledPopover>    
                </div>
                
                <Button onClick={()=>props.backButton()}>Go Back to Search</Button>
                </>
            }
            { isDoneConfirm && 
                <SeatComponent login = {()=>{props.login()}} 
                depFlight= {props.depFlight} 
                retFlight={props.retFlight} 
                flightNumSeats ={props.flightNumSeats} 
                cabinClass={props.cabinClass}  
                userInfo ={props.userInfo} price={(priceOfSeat*props.flightNumSeats)+props.price}
                isLoggedIn = {props.isLoggedIn}
                
                backButton ={()=>{setIsDone(false)}}
                
                />
            }
         </div>
         );
}

export default ReserveFlights;
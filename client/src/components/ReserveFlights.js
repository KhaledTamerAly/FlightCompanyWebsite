import React, { Component ,  useState, useEffect } from 'react';
import SeatComponent from './SeatsComponent';
import Summary from './Summary';
import { Button,UncontrolledPopover,PopoverBody,PopoverHeader } from 'reactstrap';
import styles from '../css/home.module.css'



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

            <div className={styles.summaryReserve}>
                <Summary depFlight= {props.depFlight} retFlight={props.retFlight} cabinClass={props.cabinClass} 
                chosenSeatsD ={[]} chosenSeatsR={[]} 
                bookingNumberD={""} bookingNumberR={""} price = {(priceOfSeat*props.flightNumSeats)+props.price}/>
                <div className="text-center">
                <Button style = {{margin:"20px 0px 0px 150px"}}
                        id={"UncontrolledPopover"}
                        type="button"
                        color="success"
                >
                    Choose Seats
                </Button>
                <UncontrolledPopover
                        placement="bottom"
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
                        <Button style={{margin:"0px 0px 10px 0px"}}
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
                <Button style = {{margin:"-67px 0px 0px -150px"}} onClick={()=>props.backButton()}>Go Back to Search</Button>
                </div>
            }
            { isDoneConfirm && 
                <SeatComponent login = {()=>{props.login()}} 
                depFlight= {props.depFlight} 
                retFlight={props.retFlight} 
                flightNumSeats ={props.flightNumSeats} 
                cabinClass={props.cabinClass}  
                userInfo ={props.userInfo}
                price={(priceOfSeat*props.flightNumSeats)+props.price}
                isLoggedIn = {props.isLoggedIn}
                
                backButton ={()=>{setIsDone(false)}}
                
                />
            }
         </div>
         );
}

export default ReserveFlights;
import React, { Component ,  useState, useEffect } from 'react';
import SeatComponent from './SeatsComponent';
import Summary from './Summary';
import { Button,UncontrolledPopover,PopoverBody,PopoverHeader } from 'reactstrap';



function ReserveFlights(props)
{
    const [isDoneConfirm, setIsDone] = useState(false);


    return (
        
        <div>
            { !isDoneConfirm &&

            <>
                <Summary depFlight= {props.depFlight} retFlight={props.retFlight} depCabinClass={props.depCabinClass} 
                retCabinClass={props.retCabinClass} chosenSeatsD ={[]} chosenSeatsR={[]} 
                bookingNumberD={""} bookingNumberR={""} price = {props.price}/>

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
                </>
            }
            
            { isDoneConfirm &&
                <SeatComponent depFlight= {props.depFlight} retFlight={props.retFlight} depFlightNumSeats ={props.depFlightNumSeats} 
                retFlightNumSeats={props.retFlightNumSeats} depCabinClass={props.depCabinClass} retCabinClass={props.retCabinClass} 
                userInfo ={props.userInfo} price={props.price}/>
            }
         </div>
         );
}

export default ReserveFlights;
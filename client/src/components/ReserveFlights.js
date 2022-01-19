import React, { Component ,  useState, useEffect } from 'react';
import SeatComponent from './SeatsComponent';
import Summary from './Summary';
import { Button,UncontrolledPopover,PopoverBody,PopoverHeader } from 'reactstrap';
import styles from '../css/home.module.css';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });


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
        <div className='App'>
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
            <Dialog
            open={isDoneConfirm}
            TransitionComponent={Transition}
            keepMounted
            onClose={()=>setIsDone(false)}
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle>{"____________Confirm Flight Reservation______________"}</DialogTitle>
            <DialogContent>
              {isDoneConfirm && <SeatComponent login = {()=>{props.login()}} 
                depFlight= {props.depFlight} 
                retFlight={props.retFlight} 
                flightNumSeats ={props.flightNumSeats} 
                cabinClass={props.cabinClass}  
                userInfo ={props.userInfo}
                price={(priceOfSeat*props.flightNumSeats)+props.price}
                isLoggedIn = {props.isLoggedIn}
                
                backButton ={()=>{setIsDone(false)}}
                
                />}
            </DialogContent>
            <DialogActions>
              <Button onClick={()=>{setIsDone(false); window.location.reload()}}>Exit</Button>
            </DialogActions>
          </Dialog>
            }
         </div>
         );
}

export default ReserveFlights;
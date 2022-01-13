import '../App.css';
import React, { Component ,  useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {Button} from 'reactstrap';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ChangeFlights from '../components/ChangeFlight';


class PostBookSearch extends Component {

  state = {
    selectedDepartureTerminal: null,
    selectedArrivalTerminal: null,
    selectedDepDate: null,
    selectedNumOfPass: null,
    flightToBeListed: [],
    departureHasBeenChosen: false,
    isDoneSelectingFlights: false,
    selectedDepartureFinal: null,
    isAllFieldsSelected: true,
    selectedCabinClass : null,
    isStopRenderSearch: false,
    bookingNumber: null,
    triggerDialogue: false,
    currentFlightType: null,
    linkedFlight: null,
    target:null,
    selectedArrivalFinal: null,
    isChangingDepartFlight: true,
    user:null,
    linkedBooking:null,
    ticketPrice:null,
    oldPrice:null
  };

constructor(props)
{
    super(props);
    this.state = 
    {
      bookingNumber:props.bookingNumber,
      user:props.user
    }
}
async updateStates() 
{
  await axios.get('/flights').then(res =>{
    const allFlights = res.data;
    this.setState({flights:allFlights});

    var options = [];
    allFlights.forEach((flight) => {options.push(flight.flightDate)});
    var distinct = [...new Set(options)];
    for(var i =0;i<distinct.length;i++)
    {
      var elem = {value:distinct[i], label:distinct[i]};
      distinct[i] = elem;
    }
    this.setState({dateOptions: [{label:"_" ,value:null}].concat(distinct)});

    var options = [];
    allFlights.forEach((flight) => {options.push(flight.flightNumber)});
    var distinct = [...new Set(options)];
    for(var i =0;i<distinct.length;i++)
    {
      var elem = {value:distinct[i], label:distinct[i]};
      distinct[i] = elem;
    }
    this.setState({flightNumberOptions: [{label:"_" ,value:null}].concat(distinct)});
  });

  var urlpath = '/users/flightInfo/'+ this.state.bookingNumber;
  await axios.get(urlpath).then(combo=>
    {
      this.setState({selectedArrivalTerminal: combo.data.fnFlight.arrivalTerminal});
      this.setState({selectedDepartureTerminal: combo.data.fnFlight.departureTerminal});
      this.setState({selectedNumOfPass: combo.data.bnReservation.chosenSeats.length});
      this.setState({currentFlightType: combo.data.bnReservation.flightType});
      this.setState({linkedFlight: combo.data.linkedFlight});
      this.setState({linkedBooking:combo.data.linkedBooking});
      this.setState({oldPrice:combo.data.bnReservation.paid});
    });
}
async componentDidMount()
{
  this.setState({ticketPrice:this.getRndInteger(60,99)});
  this.updateStates();
}
getRndInteger(min, max) 
{
  return (Math.floor(Math.random() * (max - min) ) + min);
}
async userInput(event)
{
  var selDepDate, selCabClass;
  
  selDepDate = this.state.selectedDepDate;
  selCabClass = this.state.selectedCabinClass;

  if(selDepDate ==null || selCabClass==null)
  {
    this.setState({isAllFieldsSelected:true});
    return;
  }
  if(this.state.currentFlightType=="Departure")
  {
    this.setState({isChangingDepartFlight:true});
    
    const body = {
      selectedDepDate: this.state.selectedDepDate,
      selectedCabinClass:selCabClass.value,
      selectedArrivalTerminal: this.state.selectedArrivalTerminal,
      selectedDepartureTerminal: this.state.selectedDepartureTerminal,
      selectedNumOfPass: this.state.selectedNumOfPass
    }
    
    axios.post('/flights/matchesUserSearch', body, {headers: {}});
    axios.get('/flights/matchesUserSearch').then(res =>{
      this.setState({selectedDepDate:null});
      this.setState({flightToBeListed: res.data.departFlights});
    });
  }
  else if(this.state.currentFlightType=="Return")
  {
    this.setState({isChangingDepartFlight:false});
    this.setState({departureHasBeenChosen: true});
    var selCabClass = this.state.selectedCabinClass;                                      
    
    const body = {
      arrivalTerminal:this.state.selectedArrivalTerminal,
      departureTerminal:this.state.selectedDepartureTerminal,
      depDate: this.state.selectedDepDate,
      cabinClass:selCabClass.value,
      numOfPass:this.state.selectedNumOfPass
    }
    const api = {}; 
    await axios.post('/flights/matchesUserSearch_Response', body, {headers: api}).then(res=>{
                this.setState({returnFlightToBeListed:res.data});
              });
  }
}
getCabin(option)
{
  var cabOp = ["Economy", "Business", "First"];
  var cabOpV = null;
  var i;
  var cabOpArr = [];
  for(i =0; i<cabOp.length; i++){
    cabOpV = cabOp[i];
  

    // eslint-disable-next-line default-case
    switch(cabOpV)
    {
      case "Economy": if(option.noOfEconSeats !== 0)
                      cabOpArr.push("Economy");    
                      break;
      case "Business": if(option.noOfBusinessSeats !== 0)
                        cabOpArr.push("Business");
                      break;
      case "First": if(option.noOfFirstSeats !== 0)
                        cabOpArr.push("First");            
                      break;
    }
  }
return cabOpArr;

}
render()
{
  
  var flightsToChange = [];
  if(this.state.isStopRenderSearch)
  {
    if(this.state.selectedDepartureFinal && !this.state.selectedArrivalFinal)
    {
      flightsToChange = [{
        flightNumber:this.state.selectedDepartureFinal,
        bookingNumber: this.state.bookingNumber,
        type:"Departure",
        linkedFlight:this.state.linkedFlight,
        linkedBooking:this.state.linkedBooking
      }]
    }
    else if(!this.state.selectedDepartureFinal && this.state.selectedArrivalFinal)
    {
      flightsToChange = [{
        flightNumber:this.state.selectedArrivalFinal,
        bookingNumber: this.state.bookingNumber,
        type:"Return",
        linkedFlight:this.state.linkedFlight,
        linkedBooking:this.state.linkedBooking
      }]
    }
    else if(this.state.selectedDepartureFinal && this.state.selectedArrivalFinal)
    {
      //selected a depart flight to edit first
      if(this.state.currentFlightType=="Departure")
      {
        flightsToChange = [{
          flightNumber:this.state.selectedDepartureFinal,
          bookingNumber: this.state.bookingNumber,
          type:"Departure"
        },
        {
          flightNumber:this.state.selectedArrivalFinal,
          bookingNumber:this.state.linkedBooking.bookingNumber,
          type:"Return"
        }]
      }
      //selected a return flight to edit first
      else if(this.state.currentFlightType=="Return")
      {
        flightsToChange = [{
          flightNumber:this.state.selectedDepartureFinal,
          bookingNumber: this.state.linkedBooking.bookingNumber,
          type:"Departure"
        },
        {
          flightNumber:this.state.selectedArrivalFinal,
          bookingNumber:this.state.bookingNumber,
          type:"Return"
        }]
      }
    }
  }
  return (
  <div className="App">
    
    {!this.state.isStopRenderSearch && <div>
      <br/>
      Departure Terminal
      <br/>
      {this.state.selectedDepartureTerminal}
      <br/>
      Arrival Terminal
      <br/>
      {this.state.selectedArrivalTerminal}
      <br/>
       Cabin Class<br/>
       <Select value = {this.state.selectedCabinClass}
        options = {[{ value: 'Economy', label: 'Economy (10 Euros per seat)' },
                    { value: 'Business', label: 'Business (20 Euros per seat)' },
                    { value: 'First', label: 'First (30 Euros per seat)' }]}
        onChange = {(obj) => this.setState({selectedCabinClass: obj})}
        />
      <br/>
      Departure Date <br/>
      <DatePicker selected={this.state.selectedDepDate}
      onChange={(date) => this.setState({selectedDepDate: date})}
      isClearable
      placeholderText="Choose Departure Date"
      dateFormat = 'yyyy/MM/dd'
      />
      <button onClick={()=>window.location.reload()}>Clear</button>  
        &nbsp;&nbsp;&nbsp;&nbsp;
      <button onClick={this.userInput.bind(this)}>Search</button>
          <br/>
      Flights:
      {this.state.isChangingDepartFlight && (!this.state.departureHasBeenChosen && !this.state.isDoneSelectingFlights) &&
      <div>
        Now Selecting Departure Flight
        {this.state.flightToBeListed && <div>Found: {this.state.flightToBeListed.length} flights</div>}
        <ul>
          {
          (this.state.flightToBeListed ?? []).map((option,i) =>
            <li>
            <button id={"confirmDep"+i}
            onClick={()=> {this.setState({triggerDialogue: true});this.setState({target:option});}} title={option.flightNumber}
            subtitle="" > From: {option.departureTerminal} To:{option.arrivalTerminal}
            Flight Number: {option.flightNumber} Departure Time: {option.flightDate} Arrival Time: {option.arrivalTime} Price: {this.state.ticketPrice} <br/> Press for more details 
            </button>
            </li>
          )
          }
        </ul>
        {this.state.target && 
        <Dialog
        open={this.state.triggerDialogue}
        keepMounted
        onClose={()=>this.setState({triggerDialogue: false})}
        aria-describedby={"confirmDep"+this.state.target.flightNumber}        
        >
          <DialogTitle>{"Confirm change flight"}</DialogTitle>
          <DialogContent>
            <DialogContentText id={"confirmDep"+this.state.target.flightNumber}>
              { "Flight Number: " + this.state.target.flightNumber} <br/> {" Departure Time: " + this.state.target.flightDate} <br/> { "Arrival Time: " +this.state.target.arrivalTime+
                         " Trip Duration: "} <br/> {" Cabin Type: " + this.getCabin(this.state.target) + " Baggage: 50kg"}<br/> {" Price: " + this.state.ticketPrice} 
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={()=>this.setState({triggerDialogue: false})} >Back</Button>
            {this.state.triggerDialogue &&
            <Button id={"confirmDep"+this.state.target.flightNumber}
            type="button"
            value = {this.state.target.flightNumber}
            size="sm"
            onClick = {async(event) =>
              {
                this.setState({selectedDepartureFinal: this.state.target.flightNumber }); 
                this.setState({departureHasBeenChosen: true}); 
                this.setState({target: null}); 
                this.setState({triggerDialogue: false});

                if(this.state.target.flightDate<=this.state.linkedFlight.flightDate)
                {
                  //new selected depart flight's date is before linked return flight
                  //all good
                  //go to component khaled
                  this.setState({isStopRenderSearch:true});
                  this.setState({isDoneSelectingFlights:true});
                }
                else
                {
                  //new selected depart flight's date is after linked return flight
                  //force user to choose new return flight
                  this.setState({isChangingDepartFlight:false});

                  var selCabClass = this.state.selectedCabinClass;
                  const body = {
                    arrivalTerminal:this.state.target.departureTerminal,
                    departureTerminal:this.state.target.arrivalTerminal,
                    depDate: this.state.target.flightDate,
                    cabinClass:selCabClass.value,
                    numOfPass:this.state.selectedNumOfPass
                  }
                  const api = {}; 
                  await axios.post('/flights/matchesUserSearch_Response', body, {headers: api}).then(res=>{
                    this.setState({returnFlightToBeListed:res.data})
                  });
                }
              }
            }
            >
              <b>Select Departure Flight</b>
              </Button>
              }
              </DialogActions>
              </Dialog>
              }
              </div>
            }
            
            {!this.state.isChangingDepartFlight && (this.state.departureHasBeenChosen && !this.state.isDoneSelectingFlights) &&
            <div>
              Now Selecting Return Flight
              {this.state.returnFlightToBeListed && <div>Found: {this.state.returnFlightToBeListed.length} flights</div>}
              <ul>
                {
                (this.state.returnFlightToBeListed ?? []).map((option,i) =>
                <li>
                <button id={"confirmDep"+i}
                onClick={()=> {this.setState({triggerDialogue: true});this.setState({target:option})}} 
                title={option.flightNumber}
                subtitle="" > From: {option.departureTerminal} To:{option.arrivalTerminal} Flight Number: {option.flightNumber} Departure Time: {option.flightDate} Arrival Time: {option.arrivalTime} Price: {this.state.ticketPrice} <br/> Press for more details </button>
                </li>)
                }
              </ul>
              {this.state.target && 
              <Dialog
              open={this.state.triggerDialogue}
              keepMounted
              onClose={()=>this.setState({triggerDialogue: false})}
              aria-describedby={"confirmDep"+this.state.target.flightNumber}
              >
                <DialogTitle>{"Confirm change flight"}</DialogTitle>
                <DialogContent>
                  <DialogContentText id={"confirmDep"+this.state.target.flightNumber}>
                  { "Flight Number: " + this.state.target.flightNumber} <br/> {" Departure Time: " + this.state.target.flightDate} <br/> { "Arrival Time: " +this.state.target.arrivalTime+
                       " Trip Duration: "} <br/> {" Cabin Type: " + this.getCabin(this.state.target) + " Baggage: 50kg"}<br/> {" Price: " + this.state.ticketPrice} 
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={()=>this.setState({triggerDialogue: false})} >Back</Button>
                  {this.state.triggerDialogue &&
                  <Button id={"confirmDep"+this.state.target.flightNumber}
                  type="button"
                  value = {this.state.target.flightNumber}
                  size="sm"
                  onClick = {(event) =>
                    {
                      this.setState({selectedArrivalFinal: this.state.target.flightNumber });
                      this.setState({target: null});
                      this.setState({triggerDialogue: false})
                      if(this.state.target.flightDate>=this.state.linkedFlight.flightDate)
                      {
                        //new selected retunr flight's date is after linked depart flight
                        //all good
                        //go to component khaled
                        this.setState({isStopRenderSearch:true});
                        this.setState({isDoneSelectingFlights:true});
                      }
                      else
                      {
                        this.setState({isChangingDepartFlight:true});
                        var selCabClass = this.state.selectedCabinClass;
                        const body = {
                          selectedDepDate: this.state.target.flightDate,
                          selectedCabinClass:selCabClass.value,
                          selectedArrivalTerminal: this.state.target.departureTerminal,
                          selectedDepartureTerminal: this.state.target.arrivalTerminal,
                          selectedNumOfPass: this.state.selectedNumOfPass,
                          dateOperator: "lessThan"
                        }
                        const api = {};
                        axios.post('/flights/matchesUserSearch', body, {headers: api});
                        axios.get('/flights/matchesUserSearch').then(res =>{
                          this.setState({selectedDepDate:null})
                          this.setState({flightToBeListed: res.data.departFlights});
                          this.setState({departureHasBeenChosen:false})
                        });
                      }
                    }
                  }
                  >
                    <b>Select Return Flight</b>
                    </Button>}
              </DialogActions>
           </Dialog>
           }
           </div>
           }
           </div>
           }
           
           {this.state.isStopRenderSearch &&this.state.isDoneSelectingFlights && (flightsToChange.length!=0)&&  
              <>
              <ChangeFlights flightsToChange= {flightsToChange} 
              flightNumSeats = {this.state.selectedNumOfPass} 
              cabinClass = {this.state.selectedCabinClass.value} 
              userInfo={this.state.user} 
              price={this.state.ticketPrice}
              oldPrice={this.state.oldPrice} 
              />
              </>
            }  
  </div>
  );
}
}

export default PostBookSearch;
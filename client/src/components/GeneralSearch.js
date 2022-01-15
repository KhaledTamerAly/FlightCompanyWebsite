
import React, { Component ,  useState, useEffect } from 'react';
import Select from 'react-select';
import Popup from 'reactjs-popup';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import CardPanel from "./CardPanel";
import {Form,FormGroup,Label,Input} from 'reactstrap';
import SeatComponent from './SeatsComponent';
import Summary from './Summary';
import ReserveFlights from './ReserveFlights';
import styles from "../css/home.module.css";
import Button from '@mui/material/Button';
import { FixedSizeList } from 'react-window';
import Box from '@mui/material/Box';


class GeneralSearch extends Component {

  state = {
    isAllFieldsSelected: true,
    flights: [], 
    departureTerminalOptions: [], 
    arrivalTerminalOptions: [],
    flightNumberOptions: [],
    dateOptions: [],
    selectedDepartureTerminal: null,
    selectedArrivalTerminal: null,
    selectedDepDate: null,
    selectedReturnDate: null,
    selectedDepFlightNumber:null, 
    flightToBeListed: [],
    arrivalTime : null,
    departureTime : null,
    selectedCabinClass : null,
    selectedNumOfPass : null,
    selectedNumOfPassC : 0,
    selectedDepartureFinal : null,
    selectedArrivalFinal: null,
    departureHasBeenChosen: false,
    returnFlightToBeListed:null,
    isDoneSelectingFlights:false,
    isStopRenderSearch: false,
    userInfo:null,
    ticketPrice:null,
    gotDPComp:false,
    list:[],
    list_2:[]
  };
  constructor(props) {
    super(props);
    this.state = {
      selectedNumOfPass: 1,
      selectedNumOfPassC: 0,
      login:props.login,
      isLoggedIn: props.isLoggedIn
    }
  
  }
  async updateStates() {
  await axios.get('/flights')
         .then(res =>{
           const allFlights = res.data;
           this.setState({flights:allFlights});


           var options = [];
           allFlights.forEach((flight) => options.push(flight.departureTerminal));
           var distinct = [...new Set(options)];
           for(var i =0;i<distinct.length;i++)
           {
             var elem = {value:distinct[i], label:distinct[i]};
             distinct[i] = elem;
           }
           this.setState({departureTerminalOptions: [{label:"_" ,value:null}].concat(distinct)});
           
           var options = [];
           allFlights.forEach((flight) => options.push(flight.arrivalTerminal))
           var distinct = [...new Set(options)];
           for(var i =0;i<distinct.length;i++)
           {
             var elem = {value:distinct[i], label:distinct[i]};
             distinct[i] = elem;
           }
           this.setState({arrivalTerminalOptions: [{label:"_" ,value:null}].concat(distinct)});

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
  const path="users/userInfo/"+localStorage.getItem('username');
  await axios.get(path)
    .then(user=> {
      const userInfoObject=  {
        username:user.data.username,
        firstName: user.data.fName,
        lastname: user.data.lName,
        passport: user.data.passportNumber,
        email: user.data.email
      }
      this.setState({userInfo:userInfoObject})
    });
  
  }
  async componentDidMount()
  {
    this.setState({list:[]});
    this.setState({list_2:[]});
  this.setState({ticketPrice:this.getRndInteger(60,99)});
  this.updateStates();
  }
  async userInput(event) {
  
    var selArrT, selDepT,selNumPass, selCabClass;
    selArrT =this.state.selectedArrivalTerminal;
    selDepT =this.state.selectedDepartureTerminal;

    selNumPass = this.state.selectedNumOfPass+this.state.selectedNumOfPassC;
    selCabClass = this.state.selectedCabinClass;

    if(selArrT ==null || selDepT==null || selCabClass==null || this.state.selectedDepDate==null)
    {
      this.setState({isAllFieldsSelected:true});
      return;
    }

      const body = { 
        selectedArrivalTerminal:selArrT.value,
        selectedDepartureTerminal: selDepT.value,
        selectedDepDate: this.state.selectedDepDate,
        selectedCabinClass:selCabClass.value,
        selectedNumOfPass:selNumPass
      }
        const api = {}; 
        axios.post('/flights/matchesUserSearch', body, {headers: api});

        axios.get('/flights/matchesUserSearch')
              .then(res =>{
                  this.setState({selectedDepDate:null})
                  this.setState({flightToBeListed: res.data.departFlights})
              });
  }
  getRndInteger(min, max) 
  {
    return (Math.floor(Math.random() * (max - min) ) + min);
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
  handlePCount(value) {
  this.setState({selectedNumOfPass: (this.state.selectedNumOfPass)+1});
  }
  handleNCount(value) {
  if(this.state.selectedNumOfPass > 1)
   this.setState({selectedNumOfPass: (this.state.selectedNumOfPass)-1});
  else
    this.setState({selectedNumOfPass: 1});

  }
  handlePCountC(value) {
  this.setState({selectedNumOfPassC: (this.state.selectedNumOfPassC)+1});
  }
  handleNCountC(value) {
  if(this.state.selectedNumOfPassC !== 0)
   this.setState({selectedNumOfPassC: (this.state.selectedNumOfPassC)-1});
  else
    this.setState({selectedNumOfPassC: 0});

  }
  handleOnClick(option){
  this.setState({selectedDepartureTerminal: option.departureTerminal});
  }
  render() 
  {
    var flightsList = [];
    return (
      <div className="App">
        {!this.state.isStopRenderSearch && <div>
      {this.state.isAllFieldsSelected && <h5 style={{ color: 'red' }}>Please Select All Fields</h5>}  
      <div className={styles.generalSearch_DD}>
      Departure Terminal<br/>
      <Select 
        value = {this.state.selectedDepartureTerminal}
        options = {this.state.departureTerminalOptions}
        onChange = {(obj) => this.setState({selectedDepartureTerminal: obj})}
      />
     Arrival Terminal <br/>
      <Select 
        value = {this.state.selectedArrivalTerminal}
        options = {this.state.arrivalTerminalOptions}
        onChange = {(obj) => this.setState({selectedArrivalTerminal: obj}) }
      />
      
       Cabin Class<br/>
                  <Select
                    value = {this.state.selectedCabinClass}
                    options = {[
                      { value: 'Economy', label: 'Economy (10 Euros per seat)' },
                      { value: 'Business', label: 'Business (20 Euros per seat)' },
                      { value: 'First', label: 'First (30 Euros per seat)' }
                    ]}
                    onChange = {(obj) => this.setState({selectedCabinClass: obj})}
                  />
        </div>
        <br/>
        <div className={styles.generalSearch_PD}>
        Number of Passengers (Adults): {this.state.selectedNumOfPass}
        <br/>
        <Button  size="small" variant="contained" sign="-" selectedNumOfPass={this.state.selectedNumOfPass} onClick={this.handleNCount.bind(this)}> - </Button >
        &nbsp;&nbsp;&nbsp;&nbsp;
        <Button  size="small" variant="contained" sign="+" selectedNumOfPass={this.state.selectedNumOfPass} onClick={this.handlePCount.bind(this)}> + </Button >
        <br/>
        Number of Passengers (Children): {this.state.selectedNumOfPassC}
        <br/>
        <Button  size="small" variant="contained" sign="-" selectedNumOfPassC={this.state.selectedNumOfPassC} onClick={this.handleNCountC.bind(this)}> - </Button >
        &nbsp;&nbsp;&nbsp;&nbsp;
        <Button  size="small" variant="contained" sign="+" selectedNumOfPassC={this.state.selectedNumOfPassC} onClick={this.handlePCountC.bind(this)}> + </Button >
        <br/>

      Departure Date <br/>
      <DatePicker 
                  selected={this.state.selectedDepDate}
                  onChange={(date) => this.setState({selectedDepDate: date})}
                  isClearable
                  placeholderText="Choose Departure Date"
                  dateFormat = 'yyyy/MM/dd'
                  popperPlacement="bottom-end"
                />
      </div>
      <div className={styles.generalSearch_B}>
      {this.state.selectedDepartureFinal && <b>Selected Departure Flight is {this.state.selectedDepartureFinal ?? "NOT SELECTED"}</b>}
      <br/>
      {this.state.selectedDepartureFinal && <b>Selected Arrival Flight is {this.state.selectedArrivalFinal ?? "NOT SELECTED"}</b>}
      <br />
      <Button  variant="contained" onClick={()=>window.location.reload()}>Clear</Button >  
        &nbsp;&nbsp;&nbsp;&nbsp;
      <Button  color='warning' variant="contained" onClick={this.userInput.bind(this)}>Search</Button >
      </div>
            {this.state.flightToBeListed && (!this.state.departureHasBeenChosen && !this.state.isDoneSelectingFlights) &&
            <div className={styles.searchResults}>
              <div>
                Flights:
                <br/>
                Now Selecting Departure Flight
                {this.state.flightToBeListed && <div>Found: {this.state.flightToBeListed.length} flights</div>}
                </div>
              {!this.state.gotDPComp &&
              (this.state.flightToBeListed ?? []).map((option,i) =>
              {
                
               flightsList.push((<div style={{margin:"10px 0px 0px 10px"}}>
               <Popup contentStyle={{margin:"10px 10px 10px 10px", backgroundColor: "rgb(48, 70, 192)", textAlign:"center",  color:"white"}}
               
               trigger = { <Button variant="contained" title={option.flightNumber} 
                          subtitle="" 
                          content={"From:  "+ option.departureTerminal+ " " + "\n" +"On: "+ option.flightDate}>
                          {"From:  "+ option.departureTerminal+ " " + " " +"To: "+ option.arrivalTerminal+ "\n" +"On: "+ (option.flightDate+"").split('T')[0] } 
                          <br/></Button >
                          }
                position="left center">
                <div style={{margin:"10px 10px 10px 10px"}}>
                  { "Flight Number: " + option.flightNumber} 
                  <br/> 
                  {" Departure Time: " + (option.departureTime+"").split('T')[1]}
                  <br/>
                  { "Arrival Time: " +(option.arrivalTime+"").split('T')[1]}
                  <br/>
                  {" Trip Duration: 2 Hours"}
                  <br/> 
                  {" Cabin Type: " + this.getCabin(option)}
                  <br/>
                  {" Baggage: 50kg"}
                  <br/> 
                  {" Price: " + this.state.ticketPrice} 
                <br>
                </br>
                <Button
                    color='warning'
                    sx={{margin:"10px 0px 10px 0px"}}
                    id={"confirmDep"+i}
                    variant="contained"
                    value = {option.flightNumber}
                    size="sm"

                    onClick = {async(event) => {
                      this.setState({selectedDepartureFinal: option.flightNumber });
                      
                      var selArrT, selDepT,selNumPass, selCabClass;
                      selArrT =this.state.selectedArrivalTerminal;
                      selDepT =this.state.selectedDepartureTerminal;

                      selNumPass = this.state.selectedNumOfPass+this.state.selectedNumOfPassC;
                      selCabClass = this.state.selectedCabinClass;
                      
                      const body = { 
                        arrivalTerminal:selDepT.value,
                        departureTerminal: selArrT.value,
                        depDate: option.flightDate,
                        cabinClass:selCabClass.value,
                        numOfPass:selNumPass
                      }
                        const api = {}; 
                        await axios.post('/flights/matchesUserSearch_Response', body, {headers: api}).then(res=>{
                          this.setState({returnFlightToBeListed:res.data})
                        });
                      
                        this.setState({departureHasBeenChosen: true})
                  }}
                >
                <b>Select Departure Flight</b> 
                </Button>
                  </div>

                </Popup>
                <br/>
                </div>))
                }
              )
              }
              {!this.state.gotDPComp && this.setState({list:flightsList})}
              {!this.state.gotDPComp && this.setState({gotDPComp:true})}
              <Box sx={{ width: '100%', height: 400, maxWidth: 460, bgcolor: 'rgba(47, 79, 79, 0.0)',margin:"0px 0px 20px 50px" }}
              >
                <FixedSizeList
                height={400}
                width={460}
                itemSize={46}
                itemCount={this.state.list.length}
                overscanCount={5}
                >
                {({ index, key, style })=>{
                  
                  return (
                    <div key={key} style={{height: 46,
                      left: 0,
                      position: "absolute",
                      right: 0,
                      top: "10px",
                      width: "100%"}}>
                    {this.state.list}
                    </div>
                    );
                }}
                </FixedSizeList>
              </Box>
            </div>
            }
            {flightsList=[]}
            {(this.state.returnFlightToBeListed && (this.state.departureHasBeenChosen && !this.state.isDoneSelectingFlights)) &&
            <div className={styles.searchResults}>
              <div>
                Flights:
                <br/>
                Now Selecting Return Flight
                {this.state.returnFlightToBeListed && <div>Found: {this.state.returnFlightToBeListed.length} flights</div>}
                 </div>
                   {!this.state.gotRPComp &&
              (this.state.returnFlightToBeListed ?? []).map((option,i) =>
              {
                flightsList.push((<div style={{margin:"10px 0px 0px 10px"}}>
               <Popup contentStyle={{margin:"10px 10px 10px 10px", backgroundColor: "rgb(48, 70, 192)", textAlign:"center",  color:"white"}}
               
               trigger = { <Button variant="contained" title={option.flightNumber} 
                          subtitle="" 
                          content={"From:  "+ option.departureTerminal+ " " + "\n" +"On: "+ option.flightDate}>
                          {"From:  "+ option.departureTerminal+ " " + " " +"To: "+ option.arrivalTerminal+ "\n" +"On: "+ (option.flightDate+"").split('T')[0] } 
                          <br/></Button >
                          }
                position="left center">
                <div style={{margin:"10px 10px 10px 10px"}}>
                  { "Flight Number: " + option.flightNumber} 
                  <br/> 
                  {" Departure Time: " + (option.departureTime+"").split('T')[1]}
                  <br/>
                  { "Arrival Time: " +(option.arrivalTime+"").split('T')[1]}
                  <br/>
                  {" Trip Duration: 2 Hours"}
                  <br/> 
                  {" Cabin Type: " + this.getCabin(option)}
                  <br/>
                  {" Baggage: 50kg"}
                  <br/> 
                  {" Price: " + this.state.ticketPrice} 
                <br>
                </br>
                <Button
                    color='warning'
                    sx={{margin:"10px 0px 10px 0px"}}
                    id={"confirmDep"+i}
                    variant="contained"
                    value = {option.flightNumber}
                    size="sm"

                    onClick = {(event) => {this.setState({selectedArrivalFinal: option.flightNumber }); this.setState({isDoneSelectingFlights:true}); this.setState({isStopRenderSearch:true})}}
                
                >
                <b>Select Return Flight</b> 
                </Button>
                  </div>

                </Popup>
                <br/>
                </div>))
                }
              )
              }
              {!this.state.gotRPComp && this.setState({list_2:flightsList})}
              {!this.state.gotRPComp && this.setState({gotRPComp:true})}
              <Box sx={{ width: '100%', height: 400, maxWidth: 460, bgcolor: 'rgba(47, 79, 79, 0.0)',margin:"0px 0px 20px 50px" }}
              >
                <FixedSizeList
                height={400}
                width={460}
                itemSize={46}
                itemCount={this.state.list_2.length}
                overscanCount={5}
                >
                {({ index, key, style })=>{
                  
                  return (
                    <div key={key} style={{height: 46,
                      left: 0,
                      position: "absolute",
                      right: 0,
                      top: "10px",
                      width: "100%"}}>
                    {this.state.list_2}
                    </div>
                    );
                }}
                </FixedSizeList>
              </Box>
            </div>
            }
        </div>}
            {this.state.isStopRenderSearch &&this.state.isDoneSelectingFlights && 
              <>
                <ReserveFlights login = {this.state.login} 
                price = {this.state.ticketPrice} 
                chosenSeatsD ={null} 
                chosenSeatsR={null} 
                bookingNumberD={null}
                bookingNumberR={null} 
                depFlight= {this.state.selectedDepartureFinal} 
                retFlight={this.state.selectedArrivalFinal} 
                flightNumSeats ={this.state.selectedNumOfPass+this.state.selectedNumOfPassC} 
                cabinClass={this.state.selectedCabinClass.value} 
                userInfo ={this.state.userInfo}
                isLoggedIn={this.state.isLoggedIn}
                backButton={()=>{this.setState({isStopRenderSearch:false});
                this.setState({isDoneSelectingFlights:false});
                this.setState({departureHasBeenChosen:false});
                window.location.reload();
                }}
                />
              </>
            }  
    </div>
    );
  }
}


export default GeneralSearch;
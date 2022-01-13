
import React, { Component ,  useState, useEffect } from 'react';
import Select from 'react-select';
import Popup from 'reactjs-popup';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import CardPanel from "./CardPanel";
import {Form,FormGroup,Label,Input,Button} from 'reactstrap';
import SeatComponent from './SeatsComponent';
import Summary from './Summary';
import ReserveFlights from './ReserveFlights';


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
    userInfo:null
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
        selectedCabinClass:selCabClass.label,
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
    const flightPrice = 50;
    return (
      <div className="App">
        {!this.state.isStopRenderSearch && <div>
      {this.state.isAllFieldsSelected && <h5 style={{ color: 'red' }}>Please Select All Fields</h5>}  
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
                      { value: 'economy', label: 'Economy' },
                      { value: 'business', label: 'Business' },
                      { value: 'first', label: 'First' }
                    ]}
                    onChange = {(obj) => this.setState({selectedCabinClass: obj})}
                  />
        <br/>
        Number of Passengers (Adults): {this.state.selectedNumOfPass}
        <br/>
        <button sign="-" selectedNumOfPass={this.state.selectedNumOfPass} onClick={this.handleNCount.bind(this)}> - </button>

        <button sign="+" selectedNumOfPass={this.state.selectedNumOfPass} onClick={this.handlePCount.bind(this)}> + </button>
        <br/>
        Number of Passengers (Children): {this.state.selectedNumOfPassC}
        <br/>
        <button sign="-" selectedNumOfPassC={this.state.selectedNumOfPassC} onClick={this.handleNCountC.bind(this)}> - </button>

        <button sign="+" selectedNumOfPassC={this.state.selectedNumOfPassC} onClick={this.handlePCountC.bind(this)}> + </button>
        <br/>

      Departure Date <br/>
      <DatePicker
                  selected={this.state.selectedDepDate}
                  onChange={(date) => this.setState({selectedDepDate: date})}
                  isClearable
                  placeholderText="Choose Departure Date"
                  dateFormat = 'yyyy/MM/dd'
                />
        
      <b>Selected Departure Flight is {this.state.selectedDepartureFinal ?? "NOT SELECTED"}</b> 
      <br/>
      <b>Selected Arrival Flight is {this.state.selectedArrivalFinal ?? "NOT SELECTED"}</b>
      <br />
      <button onClick={()=>window.location.reload()}>Clear</button>  
        &nbsp;&nbsp;&nbsp;&nbsp;
      <button onClick={this.userInput.bind(this)}>Search</button>
          <br/>
          Flights:
         
            {(!this.state.departureHasBeenChosen && !this.state.isDoneSelectingFlights) &&
              <div>
                Now Selecting Departure Flight
                {this.state.flightToBeListed && <div>Found: {this.state.flightToBeListed.length} flights</div>}
                 <ul>
                   {
              (this.state.flightToBeListed ?? []).map((option,i) =>
              <li>
               <Popup trigger = { <button  title={option.flightNumber} 
                subtitle="" content={"From:  "+ option.departureTerminal+ " " + " " +"On: "+ option.flightDate}>
                {"From:  "+ option.departureTerminal+ " " + " " +"To: "+ option.arrivalTerminal+ " " + " " +"On: "+ option.flightDate } <br/> Press for more details </button> }
                position="right center">
                  <div>{ "Flight Number: " + option.flightNumber} <br/> {" Departure Time: " + option.departureTime} <br/> { "Arrival Time: " +option.arrivalTime+
                         " Trip Duration: "} <br/> {" Cabin Type: " + this.getCabin(option) + " Baggage: 50kg"}<br/> {" Price: " + flightPrice} 

                <br>
                </br>
                <Button
                    id={"confirmDep"+i}
                    type="button"
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
                        cabinClass:selCabClass.label,
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
                </li>)
                }
                </ul>             
                </div>
            }
            {(this.state.departureHasBeenChosen && !this.state.isDoneSelectingFlights) &&
              <div>
                Now Selecting Return Flight
                 <ul>
                   {
              (this.state.returnFlightToBeListed ?? []).map((option,i) =>
              {
              return (<li>
              <Popup trigger = { <button  title={option.flightNumber} 
                subtitle="" content={"To:  "+ option.arrivalTerminal+ " " + " " +"On: "+ option.flightDate}>
                {"From:  "+ option.departureTerminal+ " " + " " +"To: "+ option.arrivalTerminal+ " " + " " +"On: "+ option.flightDate } <br/> Press for more details </button> }
                position="right center">
                  <div>{ "Flight Number: " + option.flightNumber} <br/> {" Departure Time: " + option.departureTime} <br/> { "Arrival Time: " +option.arrivalTime+
                         " Trip Duration: "} <br/> {" Cabin Type: " + this.getCabin(option) + " Baggage: 50Kg"} <br/> {" Price: " + flightPrice} 
                <br>
                </br>
                <Button
                    id={"confirmArr"+i}
                    type="button"
                    value = {option.flightNumber}
                    size="sm"

                    onClick = {(event) => {this.setState({selectedArrivalFinal: option.flightNumber }); this.setState({isDoneSelectingFlights:true}); this.setState({isStopRenderSearch:true})}}
                >
                <b>Select Return Flight</b> 
                </Button>
                  </div>

                </Popup>
                </li>);}
                )
                 }
                 </ul> 
                </div>
            }
        </div>}
            {this.state.isStopRenderSearch &&this.state.isDoneSelectingFlights && 
            
              <>
                <ReserveFlights login = {this.state.login} 
                price = {flightPrice} 
                chosenSeatsD ={null} 
                chosenSeatsR={null} 
                bookingNumberD={null}
                bookingNumberR={null} 
                depFlight= {this.state.selectedDepartureFinal} 
                retFlight={this.state.selectedArrivalFinal} 
                flightNumSeats ={this.state.selectedNumOfPass+this.state.selectedNumOfPassC} 
                cabinClass={this.state.selectedCabinClass.label} 
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
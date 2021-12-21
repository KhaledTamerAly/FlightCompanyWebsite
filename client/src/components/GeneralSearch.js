import '../App.css';
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
    isStopRenderSearch: false
  };
constructor(props) {
    super(props);
    this.state = {
      selectedNumOfPass: 1,
      selectedNumOfPassC: 0
    }
  
  }
async updateStates() {
  axios.get('/flights')
         .then(res =>{
           const allFlights = res.data;
           this.setState({flights:allFlights});
           

           console.log(allFlights)


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
  
}
componentDidMount()
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
        console.log(body);
        axios.post('/flights/matchesAdmin', body, {headers: api});

        axios.get('/flights/matchesAdmin')
              .then(res =>{
                  this.setState({selectedDepDate:null})
                  this.setState({flightToBeListed: res.data.departFlights})
                  this.setState({returnFlightToBeListed: res.data.returnFlights})
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
  if(this.state.selectedNumOfPass !== 0)
   this.setState({selectedNumOfPass: (this.state.selectedNumOfPass)-1});
  else
    this.setState({selectedNumOfPass: 0});

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
    const userInfo=  {
      username:"youssef",
      firstName: "youssef",
      lastname: "Bassiouny",
      passport: "A2765",
      email: "youssefbasuny@gmail.com"
    }
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
        
      <b>Selected Departure Terminal is {this.state.selectedDepartureFinal ?? "NOT SELECTED"}</b> 
      <br/>
      <b>Selected Arrival Terminal is {this.state.selectedArrivalFinal ?? "NOT SELECTED"}</b>
      <br />
      <button onClick={this.userInput.bind(this)}>Search</button>  
          <br/>
          Flights:
         
            {(!this.state.departureHasBeenChosen && !this.state.isDoneSelectingFlights) &&
              <div>
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

                    onClick = {(event) => {this.setState({selectedDepartureFinal: option.flightNumber }); this.setState({departureHasBeenChosen: true})}}
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
                 <ul>
                   {
              (this.state.returnFlightToBeListed ?? []).map((option,i) =>
              <li>
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
                </li>)
                 }
                 </ul> 
                </div>
            }
        </div>}
            {this.state.isStopRenderSearch &&this.state.isDoneSelectingFlights && <ReserveFlights price = {flightPrice} chosenSeatsD ={null} chosenSeatsR={null} bookingNumberD={null} bookingNumberR={null} depFlight= {this.state.selectedDepartureFinal} retFlight={this.state.selectedArrivalFinal} depFlightNumSeats ={this.state.selectedNumOfPass+this.state.selectedNumOfPassC} retFlightNumSeats={this.state.selectedNumOfPass+this.state.selectedNumOfPassC} depCabinClass={this.state.selectedCabinClass.label} retCabinClass={this.state.selectedCabinClass.label} userInfo ={userInfo}/>}  
    </div>
    );
  }
}


export default GeneralSearch;
import '../App.css';
import React, { Component ,  useState, useEffect } from 'react';
import Select from 'react-select';
import Popup from 'reactjs-popup';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import CardPanel from "./CardPanel";
import {Form,FormGroup,Label,Input,Button} from 'reactstrap';


class GeneralSearch extends Component {

  state = { 
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
    selectedDepartureFinal : null,
    selectedArrivalFinal: null,
    departureHasBeenChosen: false
    

  };


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
  
    var matches = [];
    var selArrT, selDepT,selDepD, selRetD, selArrFN, selDepFN, selDepTime, selArrTime, selNumPass, selCabClass;
    selArrT =this.state.selectedArrivalTerminal;
    selDepT =this.state.selectedDepartureTerminal;
    selDepD = this.state.selectedDepDate;
    selRetD = this.state.selectedReturnDate;
    selDepFN = this.state.selectedDepFlightNumber;
    selDepTime = this.state.departureTime;
    selArrTime = this.state.arrivalTime;

    selNumPass = this.state.selectedNumOfPass;
    selCabClass = this.state.selectedCabinClass;

    if(selDepD == null && selArrT == null && selDepT == null && selRetD == null && selArrFN ==null &&selDepFN==null &&
       selDepTime==null && selArrTime==null && selCabClass == null && selNumPass == null)
    {

        this.setState({flightToBeListed: this.state.flights});
      return;
    }
    else
    {
      const body = { 
        selectedArrivalTerminal:( (selArrT==null) ? null: selArrT.value),
        selectedDepartureTerminal: ( (selDepT==null) ? null: selDepT.value),
        selectedDepDate: ( (selDepD==null) ? null: this.state.selectedDepDate),
        selectedReturnDate: ( (selRetD==null) ? null: this.state.selectedReturnDate),
        selectedDepFlightNumber: ( (selDepFN==null) ? null: selDepFN.value),
        selectedArrTime: ( (selArrTime==null) ? null: selArrTime),
        selectedDepTime: ( (selDepTime==null) ? null: selDepTime),
        selectedCabinClass: ((selCabClass==null)? null: selCabClass),
        selectedNumOfPass: ((selNumPass==null)? null: selNumPass)
      }
        const api = {};
        console.log(body);
        axios.post('/flights/matches', body, {headers: api});

        axios.get('/flights/matches')
              .then(res =>{
                  matches = res.data;
                  this.setState({selectedDepDate:null})
                  this.setState({selectedReturnDate:null})
                  this.setState({flightToBeListed: res.data});
              });
    }
}


constructor(props) {
  super(props);
  this.state = {
    selectedNumOfPass: 1
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





handlePCount(value) {
  this.setState({selectedNumOfPass: (this.state.selectedNumOfPass)+1});
}

handleNCount(value) {
  if(this.state.selectedNumOfPass !== 0)
   this.setState({selectedNumOfPass: (this.state.selectedNumOfPass)-1});
  else
    this.setState({selectedNumOfPass: 0});

}

handleOnClick(option){

  this.setState({selectedDepartureTerminal: option.departureTerminal});

 // goToReturnFlights;
}

  render() {
    
    console.log(this.state.selectedDepartureFinal);
    console.log(this.state.selectedArrivalFinal);
    return (
      <div className="App">

      Departure Terminal<br/>
      <Select 
        value = {this.state.selectedDepartureTerminal}
        options = {this.state.departureTerminalOptions}
        onChange = {(obj) => this.setState({selectedDepartureTerminal: obj})}
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
        Number of Passengers: {this.state.selectedNumOfPass}
        <br/>
        <button sign="-" selectedNumOfPass={this.state.selectedNumOfPass} onClick={this.handleNCount.bind(this)}> - </button>

        <button sign="+" selectedNumOfPass={this.state.selectedNumOfPass} onClick={this.handlePCount.bind(this)}> + </button>
        <br/>
        


      Departure Date <br/>
      <DatePicker
                  selected={this.state.selectedDepDate}
                  onChange={(date) => this.setState({selectedDepDate: date})}
                  isClearable
                  placeholderText="Choose Departure Date"
                  dateFormat = 'yyyy/MM/dd'
                />
              
                <FormGroup>
          <Label for="departureTime">
            Departure Time (Please select a date also)
            </Label>
            <Input
            id="departureTime"
            value={this.state.departureTime}
            onChange={(event)=> this.setState({departureTime:event.target.value})}
            name="departureTime"
            type="time"
          />

        </FormGroup>
        
      <b>Selected Departure Terminal is {this.state.selectedDepartureFinal?.label ?? "NOT SELECTED"}</b> 
      <br/>
      <b>Selected Arrival Terminal is {this.state.selectedArrivalFinal?.label ?? "NOT SELECTED"}</b>
      <br />
      <button onClick={this.userInput.bind(this)}>Search</button>  
          <br/>
          Flights:
          <ul>
            {
              (this.state.flightToBeListed ?? []).map((option,i) =>
              <li>
                { !this.state.departureHasBeenChosen &&<div>
               <Popup trigger = { <button  title={option.flightNumber} 
                subtitle="" content={"From:  "+ option.departureTerminal+ " " + " " +"On: "+ option.flightDate}>
                {"From:  "+ option.departureTerminal+ " " + " " +"On: "+ option.flightDate } <br/> Press for more details </button> }
                position="right center">
                  <div>{ "Flight Number: " + option.flightNumber} <br/> {" Departure Time: " + option.departureTime} <br/> { "Arrival Time: " +option.arrivalTime+
                         " Trip Duration: "} <br/> {" Cabin Type: " + this.getCabin(option) + " Baggage"} 

                <Button
                    id={"confirmDep"+i}
                    type="button"
                    value = {option.flightNumber}
                    size="sm"

                    onClick = {(event) => {this.setState({selectedDepartureFinal: option.flightNumber }); this.setState({departureHasBeenChosen: true})}}
                >

                select flight
                <br/>
                <b>Selected Departure Terminal is {this.state.selectedDepartureFinal?.label ?? "NOT SELECTED"}</b> 
               <br/>
                </Button>
                  </div>

                </Popup>
                </div>
  }

               



                <br/>
                
                  {this.state.departureHasBeenChosen && <div>
                <Popup trigger = { <button  title={option.flightNumber} 
                subtitle="" content={"To:  "+ option.arrivalTerminal+ " " + " " +"On: "+ option.flightDate}>
                {"To:  "+ option.arrivalTerminal+ " " + " " +"On: "+ option.flightDate } <br/> Press for more details </button> }
                position="right center">
                  <div>{ "Flight Number: " + option.flightNumber} <br/> {" Departure Time: " + option.departureTime} <br/> { "Arrival Time: " +option.arrivalTime+
                         " Trip Duration: "} <br/> {" Cabin Type: " + this.getCabin(option) + " Baggage"} 

                <Button
                    id={"confirmArr"+i}
                    type="button"
                    value = {option.flightNumber}
                    size="sm"

                    onClick = {(event) => {this.setState({selectedArrivalFinal: option.flightNumber })}}
                >

                select flight
                <br/>
                <b>Selected Arrival Terminal is {this.state.selectedArrivalFinal?.label ?? "NOT SELECTED"}</b> 
               <br/>
                </Button>
                  </div>

                </Popup>
                </div>
  }
                
                
                </li>)
            }
          </ul>

         
    </div>
    );
  }
}


export default GeneralSearch;
import '../App.css';
import React, { Component ,  useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import CardPanel from "./CardPanel";
import {Form,FormGroup,Label,Input,Button} from 'reactstrap';

class Search extends Component {

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
    departureTime : null
  };


async updateStates() {
  axios.get('/flights')
         .then(res =>{
           const allFlights = res.data;
           this.setState({flights:allFlights});
           this.setState({flightToBeListed:allFlights});

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
    var selArrT, selDepT,selDepD, selRetD, selArrFN, selDepFN, selDepTime, selArrTime;
    selArrT =this.state.selectedArrivalTerminal;
    selDepT =this.state.selectedDepartureTerminal;
    selDepD = this.state.selectedDepDate;
    selRetD = this.state.selectedReturnDate;
    selDepFN = this.state.selectedDepFlightNumber;
    selDepTime = this.state.departureTime;
    selArrTime = this.state.arrivalTime;

    if(selDepD == null && selArrT == null && selDepT == null && selRetD == null && selArrFN ==null &&selDepFN==null && selDepTime==null && selArrTime==null)
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
        selectedDepTime: ( (selDepTime==null) ? null: selDepTime)
      }
        const api = {};
        console.log(body);
        axios.post('/flights/matches', body, {headers: api});

        axios.get('/flights/matches')
              .then(res =>{
                  matches = res.data;
                  this.setState({selectedDepDate:null})
                  this.setState({selectedReturnDat:null})
                  this.setState({flightToBeListed: res.data});
              });
    }
}

  render() {
    
    return (
      <div className="App">

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
      Departing Flight Number<br/>

      <Select 
        value = {this.state.selectedDepFlightNumber}
        options = {this.state.flightNumberOptions}
        onChange = {(obj) => this.setState({selectedDepFlightNumber: obj})}
      />
      Departure Date <br/>
                <DatePicker
                  selected={this.state.selectedDepDate}
                  onChange={(date) => this.setState({selectedDepDate: date})}
                  isClearable
                  placeholderText="Choose Departure Date"
                  dateFormat = 'yyyy/MM/dd'
                />
              Return Date <br/>
                 <DatePicker
                  selected={this.state.selectedReturnDate}
                  onChange={(date) => this.setState({selectedReturnDate: date})}
                  isClearable
                  placeholderText="Choose Arrival Date"
                  dateFormat = 'yyyy/MM/dd'
                />
                <FormGroup>
          <Label for="departureTime">
            Departure Time
            </Label>
            <Input
            id="departureTime"
            value={this.state.departureTime}
            onChange={(event)=> this.setState({departureTime:event.target.value})}
            name="departureTime"
            type="time"
          />
        </FormGroup>
        <FormGroup>
          <Label for="arrivalTime">
            Arrival Time
            </Label>
            <Input
            id="arrivalTime"
            value ={this.state.arrivalTime}
            onChange={(event)=> this.setState({arrivalTime:event.target.value})}
            name="arrivalTime"
            type="time"
          />
        </FormGroup>
      <b>Selected Departure Terminal is {this.state.selectedDepartureTerminal?.label ?? "NOT SELECTED"}</b> 
      <br/>
      <b>Selected Arrival Terminal is {this.state.selectedArrivalTerminal?.label ?? "NOT SELECTED"}</b>
      <br />
      <button onClick={this.userInput.bind(this)}>Search</button>  
          <br/>
          Flights:
          <ul>
            {
              (this.state.flightToBeListed ?? []).map((option,i) => <li><CardPanel i = {i} idOfFlight = {option._id} deleteFlight = {()=> {this.updateStates(); console.log(this.state.flights); window.location.reload();}} title={option.flightNumber} subtitle="" content={"From:  "+ option.departureTerminal+ " "+ "To: "+option.arrivalTerminal + " " +"On: "+ option.flightDate} /></li>)
            }
          </ul>
    </div>
    );
  }
}

export default Search;
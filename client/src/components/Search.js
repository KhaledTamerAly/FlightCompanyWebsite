import '../App.css';
import React, { Component ,  useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import CardPanel from "./CardPanel";

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
    flightToBeListed: []
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
    var selArrT, selDepT,selDepD, selRetD, selArrFN, selDepFN;
    selArrT =this.state.selectedArrivalTerminal;
    selDepT =this.state.selectedDepartureTerminal;
    selDepD = this.state.selectedDepDate;
    selRetD = this.state.selectedReturnDate;
    selDepFN = this.state.selectedDepFlightNumber;

    if(selDepD == null && selArrT == null && selDepT == null && selRetD == null && selArrFN ==null &&selDepFN==null)
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
        selectedDepFlightNumber: ( (selDepFN==null) ? null: selDepFN.value)
      }
        const api = {};
        axios.post('/flights/matches', body, {headers: api});

        axios.get('/flights/matches')
              .then(res =>{
                  matches = res.data;
                  this.setState({selectedDepDate:null})
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
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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


class PostBookSearch extends Component {

  state = {
    flights: [], 
    dateOptions: [],
    selectedDepartureTerminal: null,
    selectedArrivalTerminal: null,
    selectedDepDate: null,
    selectedReturnDate: null,
    selectedDepFlightNumber:null, 
    selectedNumOfPass: null,
    flightToBeListed: [],
    arrivalTime : null,
    departureTime : null,
    departureHasBeenChosen: false,
    isDoneSelectingFlights: false,
    selectedDepartureFinal: null,
    isAllFieldsSelected: true,
    flightInfo:null,
    selectedCabinClass : null,
    isStopRenderSearch: false,
    bookingNumber: null,
    triggerDialogue: false,
    currentFlightType: null,
    linkedFlight: null,
    target:null,
    selectedArrivalFinal: null,
    isChangingDepartFlight: false
    
  };

  constructor(props) {
    super(props);
    this.state = {
      bookingNumber:props.bookingNumber,
      //triggerDialogue: false
      
    }
  
  }
async updateStates() {
  await axios.get('/flights')
         .then(res =>{
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
  await axios.get(urlpath)
    .then(combo=> {
              this.setState({selectedArrivalTerminal: combo.data.fnFlight.arrivalTerminal});
              this.setState({selectedDepartureTerminal: combo.data.fnFlight.departureTerminal});
              this.setState({selectedNumOfPass: combo.data.bnReservation.chosenSeats.length});
              this.setState({currentFlightType: combo.data.bnReservation.flightType});
              this.setState({linkedFlight: combo.data.linkedFlight});
    });
  
}
async componentDidMount()
{
  this.updateStates();
}
async userInput(event) {
  
    var selDepDate, selRetDate, selCabClass;
    

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
        selectedCabinClass:selCabClass.label,
        selectedArrivalTerminal: this.state.selectedArrivalTerminal,
        selectedDepartureTerminal: this.state.selectedDepartureTerminal,
        selectedNumOfPass: this.state.selectedNumOfPass
      }
        const api = {};
        axios.post('/flights/matchesUserSearch', body, {headers: api});

        axios.get('/flights/matchesUserSearch')
              .then(res =>{
                  this.setState({selectedDepDate:null})
                  this.setState({flightToBeListed: res.data.departFlights});
              });
    }
    else
    {
      this.setState({isChangingDepartFlight:false});
      this.setState({departureHasBeenChosen: true});
      var selCabClass = this.state.selectedCabinClass;
                                                
      const body = { 
          arrivalTerminal:this.state.selectedArrivalTerminal,
          departureTerminal:this.state.selectedDepartureTerminal,
          depDate: this.state.selectedDepDate,
          cabinClass:selCabClass.label,
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
    
    const flightPrice = 50;
    console.log(this.state.selectedDepartureFinal)
        console.log(this.state.selectedArrivalFinal)

    return (
      <div className="App">
        {!this.state.isStopRenderSearch && <div>
      
      ---------------------------------------------------------------------------------------------
      <br/>
      Departure Terminal
      <br/>

      {this.state.selectedDepartureTerminal}
      
      <br/>

     Arrival Terminal <br/>
      <br/>
      {this.state.selectedArrivalTerminal}
      <br/>
      
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

      Departure Date <br/>
      <DatePicker
                  selected={this.state.selectedDepDate}
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
             <button id={"confirmDep"+i} onClick={()=> {this.setState({triggerDialogue: true});this.setState({target:option});}} title={option.flightNumber}
              subtitle="" > Flight Number: {option.flightNumber} Departure Time: {option.departureTime} Arrival Time: {option.arrivalTime} Price: {flightPrice} <br/> Press for more details </button>
              
                </li>)
                
                 }
                 </ul>
                
                 {this.state.target && <Dialog
                open={this.state.triggerDialogue}
                keepMounted
                onClose={()=>this.setState({triggerDialogue: false})}
                aria-describedby={"confirmDep"+this.state.target.flightNumber}
                
            >
                <DialogTitle>{"Confirm change flight"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id={"confirmDep"+this.state.target.flightNumber}>
                    { "Flight Number: " + this.state.target.flightNumber} <br/> {" Departure Time: " + this.state.target.departureTime} <br/> { "Arrival Time: " +this.state.target.arrivalTime+
                         " Trip Duration: "} <br/> {" Cabin Type: " + this.getCabin(this.state.target) + " Baggage: 50kg"}<br/> {" Price: " + flightPrice} 
                    </DialogContentText>
               </DialogContent>
                <DialogActions>
                <Button onClick={()=>this.setState({triggerDialogue: false})} >Back</Button>

                {this.state.triggerDialogue && <Button
                                            id={"confirmDep"+this.state.target.flightNumber}
                                            type="button"
                                            value = {this.state.target.flightNumber}
                                            size="sm"

                                            onClick = {async(event) => {
                                                this.setState({selectedDepartureFinal: this.state.target.flightNumber }); 
                                                this.setState({departureHasBeenChosen: true}); this.setState({target: null}); 
                                                this.setState({triggerDialogue: false});
                                                
                                                if(this.state.target.flightDate<this.state.linkedFlight.flightDate)
                                                {
                                                  //new selected depart flight's date is before linked return flight
                                                  //all good
                                                  //go to component khaled
                                                  console.log("khaled's shit")
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
                                                    cabinClass:selCabClass.label,
                                                    numOfPass:this.state.selectedNumOfPass
                                                  }
                                                  const api = {}; 
                                                  await axios.post('/flights/matchesUserSearch_Response', body, {headers: api}).then(res=>{
                                                      this.setState({returnFlightToBeListed:res.data})
                                                    });
                                                }   
                                        }}
                                            >
                                            <b>Select Departure Flight</b> 
                                         </Button>}
                </DialogActions>
            
             </Dialog>}
                 </div>

            }
            {!this.state.isChangingDepartFlight && (this.state.departureHasBeenChosen && !this.state.isDoneSelectingFlights) &&
              <div>
              Now Selecting Return Flight
              <ul>
                 {
            (this.state.returnFlightToBeListed ?? []).map((option,i) =>
            <li>
           <button id={"confirmDep"+i} onClick={()=> {this.setState({triggerDialogue: true});this.setState({target:option})}} title={option.flightNumber}
            subtitle="" > "From:  "+ {option.departureTerminal}+ " " + " " +"On: "+ {option.flightDate} Press for more details </button>
            
              </li>)
               }
               </ul>
               {this.state.target && <Dialog
              open={this.state.triggerDialogue}
              keepMounted
              onClose={()=>this.setState({triggerDialogue: false})}
              aria-describedby={"confirmDep"+this.state.target.flightNumber}
              
          >
              <DialogTitle>{"Confirm change flight"}</DialogTitle>
              <DialogContent>
                  <DialogContentText id={"confirmDep"+this.state.target.flightNumber}>
                  { "Flight Number: " + this.state.target.flightNumber} <br/> {" Departure Time: " + this.state.target.departureTime} <br/> { "Arrival Time: " +this.state.target.arrivalTime+
                       " Trip Duration: "} <br/> {" Cabin Type: " + this.getCabin(this.state.target) + " Baggage: 50kg"}<br/> {" Price: " + flightPrice} 
                  </DialogContentText>
             </DialogContent>
              <DialogActions>
              <Button onClick={()=>this.setState({triggerDialogue: false})} >Back</Button>

              {this.state.triggerDialogue && <Button
                                          id={"confirmDep"+this.state.target.flightNumber}
                                          type="button"
                                          value = {this.state.target.flightNumber}
                                          size="sm"

                                          onClick = {(event) => {
                                            this.setState({selectedArrivalFinal: this.state.target.flightNumber });
                                            this.setState({target: null});
                                            this.setState({triggerDialogue: false})

                                            if(this.state.target.flightDate>this.state.linkedFlight.flightDate)
                                            {
                                              //new selected retunr flight's date is after linked depart flight
                                              //all good
                                              //go to component khaled
                                              console.log("khaled's shit")
                                            }
                                            else
                                            {
                                              this.setState({isChangingDepartFlight:true});
                                              var selCabClass = this.state.selectedCabinClass;
                                              const body = {
                                                selectedDepDate: this.state.target.flightDate,
                                                selectedCabinClass:selCabClass.label,
                                                selectedArrivalTerminal: this.state.target.departureTerminal,
                                                selectedDepartureTerminal: this.state.target.arrivalTerminal,
                                                selectedNumOfPass: this.state.selectedNumOfPass,
                                                dateOperator: "lessThan"
                                              }
                                                const api = {};
                                                axios.post('/flights/matchesUserSearch', body, {headers: api});
                                        
                                                axios.get('/flights/matchesUserSearch')
                                                      .then(res =>{
                                                          this.setState({selectedDepDate:null})
                                                          this.setState({flightToBeListed: res.data.departFlights});
                                                      });

                                            }
                                          
                                          
                                          }}
                                          >
                                          <b>Select Return Flight</b> 
                                       </Button>}
              </DialogActions>
          
           </Dialog>}
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
                depFlightNumSeats ={this.state.selectedNumOfPass+this.state.selectedNumOfPassC} 
                retFlightNumSeats={this.state.selectedNumOfPass+this.state.selectedNumOfPassC} 
                depCabinClass={this.state.selectedCabinClass.label} 
                retCabinClass={this.state.selectedCabinClass.label} 
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

export default PostBookSearch;
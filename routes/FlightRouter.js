//importing modules needed
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const excelToJson = require('convert-excel-to-json');

const db = require('../config/keys').mongoURL;
mongoose.connect(db)
    .then(()=> console.log('MongoDB connected...'))
    .catch(err=> console.log(err));

//importing Table flights
const Flights = require('../tables/Flights');

var selDepT;
var selArrT;
var selDepFN;
var selArrFN;

var selectedDepDateStart = null;
var selectedDepDateEnd = null;

var selectedReturnDateStart = null;
var selectedReturnDateEnd = null;

//Routes
router.get('/depts',(req,res)=>{
    Flights.find().distinct('departureTerminal').then(terminals => {
        res.json(terminals)
    });
})
router.get('/arrivals',(req,res)=>{
    Flights.find().distinct('arrivalTerminal').then(arrivals => {
        res.json(arrivals)
    });
})
router.get('/date', (req,res)=>{
    var array = [];
    Flights.find().select('flightDate').select('-_id').then(dates=>{
        for(var i = 0;i<dates.length;i++)
            array.push(dates[i].toObject().flightDate);
        res.json(array);
    });
})
router.get('/',(req,res)=>{
    // get all the depterminals
    Flights.find({}).then(flights => {
        res.json(flights);
    });   
})
router.post('/matches',(req,res)=>{
    selArrT = null;
    selDepT = null;
    selDepFN = null;
    selArrFN = null;
    selectedDepDateStart = null;
    selectedDepDateEnd = null;
    selectedReturnDateStart = null;
    selectedReturnDateEnd = null;


    selArrT = req.body.selectedArrivalTerminal;
    selDepT = req.body.selectedDepartureTerminal;
    selDepFN = req.body.selectedDepFlightNumber;
    selArrFN = req.body.selectedArrFlightNumber;

    if(req.body.selectedDepDate != null)
    {
        
    selectedDepDateStart = new Date(req.body.selectedDepDate);
    selectedDepDateStart = convertUTCDateToLocalDate(selectedDepDateStart);
    selectedDepDateStart.setUTCHours(0, 0, 0, 0);

    selectedDepDateEnd = new Date(req.body.selectedDepDate);
    selectedDepDateEnd = convertUTCDateToLocalDate(selectedDepDateEnd);
    selectedDepDateEnd.setUTCHours(23, 59, 59, 999);
    }
    if(req.body.selectedReturnDate != null)
    {
    selectedReturnDateStart = new Date(req.body.selectedReturnDate);
    selectedReturnDateStart = convertUTCDateToLocalDate(selectedReturnDateStart);
    selectedReturnDateStart.setUTCHours(0, 0, 0, 0);
    
    selectedReturnDateEnd = new Date(req.body.selectedReturnDate);
    selectedReturnDateEnd = convertUTCDateToLocalDate(selectedReturnDateEnd);
    selectedReturnDateEnd.setUTCHours(23, 59, 59, 999);
    }
  });

  router.get('/matches', (req,res) =>{
      
    var query = [{}];
    var searchObject = {const:""};
    if(selDepFN!=null)
        searchObject.flightNumber = selDepFN;
    if(selDepT !=null)
        searchObject.departureTerminal = selDepT;
    if(selArrT !=null)
        searchObject.arrivalTerminal = selArrT;

    if(selectedDepDateStart !=null && selectedDepDateEnd !=null)
        searchObject.flightDate = {$gte: selectedDepDateStart, $lt: selectedDepDateEnd};

    var returnFlight = {const:""};
    if(selDepT !=null)
        returnFlight.arrivalTerminal = selDepT;
    if(selArrT !=null)
        returnFlight.departureTerminal = selArrT;

    if(selectedReturnDateStart !=null && selectedReturnDateEnd !=null)
        returnFlight.flightDate = {$gte: selectedReturnDateStart, $lt: selectedReturnDateEnd};

    if(JSON.stringify(searchObject) != JSON.stringify({const:""}))
    {
        delete searchObject.const;
        query.push(searchObject);
    }
    if(JSON.stringify(returnFlight) != JSON.stringify({const:""})  && selectedReturnDateStart !=null)
    {
        delete returnFlight.const;
        query.push(returnFlight);
    }

    if(query.length >1)
        query.shift();

    console.log(query);
    Flights.find(
        {$or: query} 
            ).then(match => {
        console.log("Query Returned");
      res.json(match);
    });
})

router.delete('/:id', (req,res)=> {
    Flights.findByIdAndDelete(req.params.id)
    .then((flight)=>console.log('Deleted flight ' + flight.flightNumber +' successfully'))
    .catch(err => console.log(err));
});


//functions
function isValidDate(date) {
    return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
}
Date.prototype.addHours = function(h) {
    this.setTime(this.getTime() + (h*60*60*1000));
    return this;
  }
function convertUTCDateToLocalDate(date) {
    var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);

    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();

    newDate.addHours(hours - offset+2);

    return newDate;   
}
function getRndInteger(min, max) 
{
    return (Math.floor(Math.random() * (max - min) ) + min)+"";
}
function populateTable()
{
    var databaseSheet = Object.values(result)[3];
    var count = 0;
    for(var i =1;i<Object.keys(databaseSheet).length;i=i+3)
    {
        var fName = 'KT 7';
        var row = Object.values(databaseSheet)[i];
        var rowValues = Object.values(row);    
        var from = rowValues[0];
        var to = rowValues[1];
        var date = convertUTCDateToLocalDate(new Date(rowValues[2]));
        var firstClassSeats;
        var econClassSeats;
        var busClassSeats;
        for(var j =i;j<i+3;j++)
        {
            var rowTemp = Object.values(databaseSheet)[j];
            var rowValuesTemp = Object.values(rowTemp);
            var cabinType = rowValuesTemp[3];
            var num = rowValuesTemp[4];

            if(cabinType == 'Economy')
                econClassSeats = num;
            else if(cabinType == 'First')
                firstClassSeats = num
            else if(cabinType == 'Business')
                busClassSeats = num;
        }
        fName += getRndInteger(10,99);
        var newFlight = new Flights({
            flightNumber:fName,
            arrivalTerminal: to,
            departureTerminal: from,
            flightDate:date,
            departureTime:date,
            arrivalTime:null,
            noOfEconSeats:econClassSeats,
            noOfBusinessSeats:busClassSeats,
            noOfFirstSeats:firstClassSeats
        })
        count++;
        newFlight.save();
    }
    console.log('Added '+ count +' flights...');
}
function isValidDate(date) {
    return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
}
Date.prototype.addHours = function(h) {
    this.setTime(this.getTime() + (h*60*60*1000));
    return this;
  }
function convertUTCDateToLocalDate(date) {
    var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);

    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();

    newDate.addHours(hours - offset+2);

    return newDate;   
}
//Calling functions

/** Called once to fill table, not needed anymore. Keep just in case of
reusing its code **/

//populateTable();

//Exports
module.exports = {
    router
};

//importing modules needed
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const excelToJson = require('convert-excel-to-json');
const validateFlightInput = require('../link/validate');
const result = excelToJson({
    sourceFile: './Project Requirements.xlsx'
});

const db = require('../config/keys').mongoURL;
mongoose.connect(db)
    .then(()=> console.log('MongoDB connected...'))
    .catch(err=> console.log(err));

//importing Table flights
const Flights = require('../tables/Flights');
const isEmpty = require('is-empty');
const Reservations = require('../tables/Reservations');

var selDepT;
var selArrT;
var selDepFN;
var selArrFN;
var selArrTime;
var selDepTime;
var buildSummary;

var selectedDepDateStart = null;
var selectedDepDateEnd = null;

var selectedReturnDateStart = null;
var selectedReturnDateEnd = null;
var selCabClass = null;
var selNoP = null;
var dateOperator = null;

//Routes

router.get('/matches', (req,res) =>{
      
    var query = [{}];
    var searchObject = {const:""};
    if(selDepFN!=null)
        searchObject.flightNumber = selDepFN;
    if(selDepT !=null)
        searchObject.departureTerminal = selDepT;
    if(selArrT !=null)
        searchObject.arrivalTerminal = selArrT;
    if(selCabClass !=null){
        searchObject.cabinType = selCabClass;
        if(selNoP !=null)
        switch(selCabClass){
            case "Economy": 
                        searchObject.noOfEconSeats = selNoP;    
                            break;
            case "Business": 
                        searchObject.noOfBusinessSeats = selNoP;
                            break;
            case "First": searchObject.noOfFirstSeats = selNoP;            
                            break;
        }
    }

    if(selectedDepDateStart !=null && selectedDepDateEnd !=null)
        {
            searchObject.flightDate = {$gte: selectedDepDateStart, $lt: selectedDepDateEnd};
        }



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


    Flights.find(
        {$or: query} 
            ).then(match => {
      res.json(match);
    });
})
router.post('/matches',(req,res)=>{
    selArrT = null;
    selDepT = null;
    selDepFN = null;
    selArrFN = null;
    selArrTime = null;
    selDepTime = null;
    selectedDepDateStart = null;
    selectedDepDateEnd = null;
    selectedReturnDateStart = null;
    selectedReturnDateEnd = null;

    selectedNumOfPass = null;
    selectedCabinClass = null;


    //getting user input form ddl

    selArrT = req.body.selectedArrivalTerminal;
    selDepT = req.body.selectedDepartureTerminal;
    selDepFN = req.body.selectedDepFlightNumber;
    selArrFN = req.body.selectedArrFlightNumber;
    selArrTime = req.body.selectedArrTime;
    selDepTime = req.body.selectedDepTime;

    selNoP = req.body.selectedNumOfPass;
    selCabClass = req.body.selectedCabinClass;

    
    if(req.body.selectedDepDate != null)
    {
        
    selectedDepDateStart = new Date(req.body.selectedDepDate);
    selectedDepDateStart = convertUTCDateToLocalDate(selectedDepDateStart);
    if(selDepTime!= null)
    {
        var hours = parseInt(selDepTime.toString().substring(0,2));
        var min = parseInt(selDepTime.toString().substring(3));
        selectedDepDateStart.setUTCHours(hours, min, 0, 0);
    }
    else
        selectedDepDateStart.setUTCHours(0, 0, 0, 0);
    }
    selectedDepDateEnd = new Date(req.body.selectedDepDate);
    selectedDepDateEnd = convertUTCDateToLocalDate(selectedDepDateEnd);
    selectedDepDateEnd.setUTCHours(23, 59, 59, 999);

    if(req.body.selectedReturnDate != null)
    {
    selectedReturnDateStart = new Date(req.body.selectedReturnDate);
    selectedReturnDateStart = convertUTCDateToLocalDate(selectedReturnDateStart);
    if(selArrTime!= null)
    {
        var hours = parseInt(selArrTime.toString().substr(0,2));
        var min = parseInt(selArrTime.toString().substr(3));
        selectedReturnDateStart.setUTCHours(hours, min, 0, 0);
    }
    else
        selectedReturnDateStart.setUTCHours(0, 0, 0, 0);
    
    selectedReturnDateEnd = new Date(req.body.selectedReturnDate);
    selectedReturnDateEnd = convertUTCDateToLocalDate(selectedReturnDateEnd);
    selectedReturnDateEnd.setUTCHours(23, 59, 59, 999);
    }
});
router.post('/matchesUserSearch',(req,res)=>{
    selArrT = null;
    selDepT = null;
    selDepFN = null;
    selDepTime = null;
    selectedDepDateStart = null;
    selectedDepDateEnd = null;
    selectedReturnDateStart = null;
    selectedReturnDateEnd = null;

    selNoP = null;
    selCabClass = null;
    dateOperator = null;


    //getting user input form ddl
    selArrT = req.body.selectedArrivalTerminal
    selDepT = req.body.selectedDepartureTerminal
    selDepTime = req.body.selectedDepDate
    selCabClass = req.body.selectedCabinClass
    selNoP = req.body.selectedNumOfPass
    dateOperator = req.body.dateOperator ?? null;


    if(req.body.selectedDepDate != null)
    {
        
        selectedDepDateStart = new Date(req.body.selectedDepDate);
        selectedDepDateStart = convertUTCDateToLocalDate(selectedDepDateStart);
        
        selectedDepDateStart.setUTCHours(0, 0, 0, 0);
        selectedDepDateEnd = new Date(req.body.selectedDepDate);
        selectedDepDateEnd = convertUTCDateToLocalDate(selectedDepDateEnd);
        selectedDepDateEnd.setUTCHours(23, 59, 59, 999);
    }
});
router.get('/matchesUserSearch', (req,res) =>{
    var result ={};
    var departFlight = {};
    if(selDepT !=null)
        departFlight.departureTerminal = selDepT;
    if(selArrT !=null)
        departFlight.arrivalTerminal = selArrT;
    if(selCabClass !=null){
        departFlight.cabinType = selCabClass;
        if(selNoP !=null)
        {switch(selCabClass){
            case "Economy": 
                departFlight.noOfEconSeatsLeft = { $gte: selNoP };    
                            break;
            case "Business": 
                departFlight.noOfBusinessSeatsLeft = { $gte: selNoP };
                            break;
            case "First": 
                departFlight.noOfFirstSeatsLeft = { $gte: selNoP };            
                            break;
        }}
    }
    if(selectedDepDateStart !=null && selectedDepDateEnd !=null)
    {
        if(dateOperator=="lessThan")
            departFlight.flightDate = {$lte: selectedDepDateStart};
        else
            departFlight.flightDate = {$gte: selectedDepDateStart};
    }
    Flights.find(departFlight).then(async(match) => {
        var matchesToReturn = [];
        //check for each match if there is a return flight for it, if yes add to matchesToBeRturned
        for(var i =0;i<match.length;i++)
        {
            var flight = match[i];
            var returnFlight = {};
            if(selDepT !=null)
                returnFlight.arrivalTerminal = flight.departureTerminal;
            if(selArrT !=null)
                returnFlight.departureTerminal = flight.arrivalTerminal;
            if(selCabClass !=null){
                returnFlight.cabinType = selCabClass;
                if(selNoP !=null)
                {switch(selCabClass){
                    case "Economy": 
                        returnFlight.noOfEconSeatsLeft = { $gte: selNoP };    
                                    break;
                    case "Business": 
                        returnFlight.noOfBusinessSeatsLeft = { $gte: selNoP };
                                    break;
                    case "First": 
                        returnFlight.noOfFirstSeatsleft = { $gte: selNoP };            
                                    break;
                }}
            }
            if(selectedDepDateStart !=null && selectedDepDateEnd !=null)
            {
                returnFlight.flightDate = {$gte: flight.flightDate};
            }
            
            await Flights.find(returnFlight).then(match2 => {
                var res = match2;
                if(res.length!=0)
                    matchesToReturn.push(flight);
            });
        }
        result.departFlights = matchesToReturn;
        res.json(result);
    });
})
router.post('/matchesUserSearch_Response',(req,res)=>{
    var result ={};
    var flight = {};
    flight.departureTerminal = req.body.departureTerminal;
    flight.arrivalTerminal = req.body.arrivalTerminal;
    flight.cabinType = req.body.cabinClass;
    switch(req.body.cabinClass)
    {
        case "Economy": 
            flight.noOfEconSeatsLeft = { $gte: req.body.numOfPass };    
            break;
        case "Business": 
            flight.noOfBusinessSeatsLeft = { $gte: req.body.numOfPass };
            break;
        case "First": 
            flight.noOfFirstSeatsLeft = { $gte: req.body.numOfPass };            
            break;
    }
    flight.flightDate = {$gte: req.body.depDate};

    Flights.find(flight).then(match => {
        res.json(match);
    });
});
router.post('/seatsOf/',async (req,res)=>{

    var flightNumber = req.body.flightNumber;
    var result = {};
    var numberOfSeats = {};
    await Flights.findOne({flightNumber:flightNumber}).select('seats').then(seats => {
        result.seats = seats.seats;
    });
    await Flights.findOne({flightNumber:flightNumber}).then(flight => {
        numberOfSeats.econ = flight.noOfEconSeats;
        numberOfSeats.busi = flight.noOfBusinessSeats;
        numberOfSeats.first = flight.noOfFirstSeats;
        result.numberOfSeats = numberOfSeats;
        result.seats = generateSeatArray(result.seats,result.numberOfSeats);
    });
    res.json(result.seats);
})
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
router.post('/',(req,res)=>{
    if(req.body.flightNumber==null)
        return;
    Flights.findOne({flightNumber:req.body.flightNumber}).then(flights => {
        res.json(flights);
    });   
})
router.get('/:id',(req,res)=>{
    // get all the depterminals
    Flights.findById(req.params.id).then(flights => {
        res.json(flights);
    });   
})
router.delete('/:id', (req,res)=> {
    Flights.findByIdAndDelete(req.params.id)
    .then((flight)=>console.log('Deleted flight ' + flight.flightNumber +' successfully'))
    .catch(err => console.log(err));
});
router.put('/:id', async(req,res) => {
    var carryOn=true;
    await Flights.findOne({ flightNumber: req.body.flightNumber }).then(flight => {
        if (flight && req.body.didChange) {
            carryOn=false;
            res.json({ flightNumber: "Flight Number already exists" });
        }
    });
    if(carryOn){
const dateSample = new Date();
const flightNumber = req.body.flightNumber;
const noOfEconSeats = req.body.noOfEconSeats;
const noOfBusinessSeats = req.body.noOfBusinessSeats;
const noOfFirstSeats = req.body.noOfFirstSeats;
const arrivalTerminal = req.body.arrivalTerminal;
const departureTerminal = req.body.departureTerminal;
Flights.findById(req.params.id)
.then(flight => {
    flight.flightNumber = isEmpty(flightNumber) ? flight.flightNumber : flightNumber;
    flight.arrivalTerminal = isEmpty(arrivalTerminal) ? flight.arrivalTerminal : arrivalTerminal;
    flight.departureTerminal = isEmpty(departureTerminal) ? flight.departureTerminal : departureTerminal
    if(!isEmpty(req.body.arrivalTime)){
        flight.arrivalTime=new Date(dateSample.toDateString() + ' ' + req.body.arrivalTime);
        flight.arrivalTime.setHours(arrivalTime.getHours()+1);
    }
    if(!isEmpty(req.body.departureTime)){
        flight.departureTime=new Date(dateSample.toDateString() + ' ' + req.body.departureTime);
        flight.departureTime.setHours(departureTime.getHours()+1);
    }
    flight.noOfBusinessSeats = isEmpty(noOfBusinessSeats) ? flight.noOfBusinessSeats : noOfBusinessSeats;
    flight.noOfEconSeats = isEmpty(noOfEconSeats) ? flight.noOfEconSeats : noOfEconSeats;
    flight.noOfFirstSeats = isEmpty(noOfFirstSeats) ? flight.noOfFirstSeats : noOfFirstSeats;
    if(!isEmpty(req.body.flightDate)){
        flight.flightDate=new Date(Date.parse(req.body.flightDate));
    }
    flight.save();
    res.json({success: true});
})
.catch;
    }
});
router.post("/link",async (req,res)=> {
Flights.findOne({ flightNumber: req.body.flightNumber }).then(flight => {
    if (flight) {
      return res.status(400).json({ flightNumber: "Flight Number already exists" });
    }
});
const dateSample = new Date();
var departureTime="";
var arrivalTime="";
if(!isEmpty(req.body.arrivalTime)){
    arrivalTime = new Date(dateSample.toDateString() + ' ' + req.body.arrivalTime);
    arrivalTime.setHours(arrivalTime.getHours()+1);
}
if(!isEmpty(req.body.departureTime)){
    departureTime = new Date(dateSample.toDateString() + ' ' + req.body.departureTime);
    departureTime.setHours(departureTime.getHours()+1);
}
const flightNumber = req.body.flightNumber;
// arrivalTime = new Date(dateSample.toDateString() + ' ' + req.body.arrivalTime);
// arrivalTime.setHours(arrivalTime.getHours()+1);
const noOfEconSeats = req.body.noOfEconSeats;
const noOfBusinessSeats = req.body.noOfBusinessSeats;
const noOfFirstSeats = req.body.noOfFirstSeats;
const seatMap = generateSeats(noOfFirstSeats,noOfBusinessSeats, noOfEconSeats);
var flightDate = "";
if(!isEmpty(req.body.flightDate))
    flightDate=new Date(Date.parse(req.body.flightDate));
const arrivalTerminal = req.body.arrivalTerminal;
const departureTerminal = req.body.departureTerminal;
const flight= new Flights({
    flightNumber:flightNumber, 
    arrivalTerminal:arrivalTerminal, 
    departureTerminal:departureTerminal,
    flightDate:flightDate,
    departureTime:departureTime, 
    arrivalTime:arrivalTime, 
    noOfEconSeats:noOfEconSeats, 
    noOfBusinessSeats:noOfBusinessSeats, 
    noOfFirstSeats:noOfFirstSeats,
    noOfFirstSeatsLeft:noOfFirstSeats,
    noOfEconSeatsLeft:noOfEconSeats,
    noOfBusinessSeatsLeft:noOfBusinessSeats,
    seats:seatMap});
try{
    await flight.save();
    res.send("ok");
}catch(err){
    res.send("err");
}
});
router.get('/getFlight/:bookingNumber', async(req,res)=>{
    Reservations.findOne({bookingNumber:req.params.bookingNumber}).then((reservation)=>{
        res.json(reservation.flightNumber);
   });
});



//functions
function generateSeatArray(flightSeats,numOfSeats)
    {
        if(flightSeats == [] || numOfSeats ==[])
            return [];
        var seatArray = flightSeats;
        const numEcon = numOfSeats.econ;
        const numBusi = numOfSeats.busi;
        const numFirst = numOfSeats.first;

        var firstClassRows = seatArray.slice(0,numFirst);
        var busiClassRows = seatArray.slice(numFirst,numBusi+numFirst);
        var econClassRows = seatArray.slice(numBusi+numFirst);

        var resFirstCol = [];
        for(var i =0;i<firstClassRows.length;i+=2)
        {
            var row = [];
            for(var j =i;j<i+2;j++)
            {
                row.push(firstClassRows[j]);
            }
            resFirstCol.push(row);
        }

        var resBusiCol = [];
        for(var i =0;i<busiClassRows.length;i+=4)
        {
            var row = [];
            for(var j =i;j<i+4;j++)
            {
                row.push(busiClassRows[j]);
            }
            resBusiCol.push(row);
        }

        var resEconCol = [];
        for(var i =0;i<econClassRows.length;i+=6)
        {
            var row = [];
            for(var j =i;j<i+6;j++)
            {

                row.push(econClassRows[j]);
            }
            resEconCol.push(row);
        }
        var allSeats = [];
        allSeats = resFirstCol.concat(resBusiCol).concat(resEconCol);

        for(var i =0;i<allSeats.length;i++)
        {
            for(var j=0;j<allSeats[i].length;j++)
            {
                if(allSeats[i][j]!=null && allSeats[i][j]!=undefined)
                {
                    allSeats[i][j].isClicked = false;
                }
            }
        }
        
        return allSeats;
}
function updateSeats(chosenSeats, allSeats)
{
    for(var i =0;i<chosenSeats.length;i++)
    {
        var seatToLookFor = chosenSeats[i];

        for(var j =0;j<allSeats.length;j++)
        {
            if(seatToLookFor == allSeats[j].seatNumber)
                {
                    allSeats[j].isTaken = true;
                }
        }
    }
    return allSeats;
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
        var arrivalTime = convertUTCDateToLocalDate(new Date(rowValues[2]));
        arrivalTime.setHours(arrivalTime.getHours()+2);
        var firstClassSeats;
        var econClassSeats;
        var busClassSeats;
        var seatsOnFlight = [];
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
        seatsOnFlight = generateSeats(firstClassSeats, busClassSeats, econClassSeats);
        fName += getRndInteger(10,999);
        var newFlight = new Flights({
            flightNumber:fName,
            arrivalTerminal: to,
            departureTerminal: from,
            flightDate:date,
            departureTime:date,
            arrivalTime:arrivalTime,

            noOfEconSeats:econClassSeats,
            noOfBusinessSeats:busClassSeats,
            noOfFirstSeats:firstClassSeats,
            noOfEconSeatsLeft:econClassSeats,
            noOfBusinessSeatsLeft:busClassSeats,
            noOfFirstSeatsLeft:firstClassSeats,
            seats:seatsOnFlight
        })
        count++;
        newFlight.save();
    }
    console.log('Added '+ count +' flights...');
}
function generateSeats(first,busi,econ)
{
    var seats = [];
    var rowNum = 1;
    for(var i =0; i<first;i++)
    {
        var seat;
        if(i % 2 ==0)
        {
            seat = 'A'+ rowNum.toString();
        }
        else
        {
            seat = 'B'+ rowNum.toString();
            rowNum++;
        }
        var newSeat = {seatNumber:seat, isTaken:false ,cabinType:"First"};
        seats.push(newSeat);
    }

    if(seats.length%2!=0)
        rowNum++;

    var previousSeatLetter = 'D';
    for(var i =0; i<busi;i++)
    {
        
        if(previousSeatLetter == 'D')
        { 
            if(i!=0)
                rowNum++;
            seat = 'A'+ rowNum.toString();
            previousSeatLetter = 'A';
            
        }
        else
        {   
            previousSeatLetter = String.fromCharCode(previousSeatLetter.charCodeAt()+1);
            seat = previousSeatLetter + rowNum.toString();
        }
        
        var newSeat = {seatNumber:seat, isTaken:false,cabinType:"Business"};
        seats.push(newSeat);
    }

    if(busi%4!=0)
        rowNum++;
    var previousSeatLetter = 'F';
    for(var i =0; i<econ;i++)
    {
        var seat;
        
        if(previousSeatLetter == 'F')
        { 
            if(i!=0)
                rowNum++;
            seat = 'A'+ rowNum.toString();
            previousSeatLetter = 'A';
            
        }
        else
        {   
            previousSeatLetter = String.fromCharCode(previousSeatLetter.charCodeAt()+1);
            seat = previousSeatLetter + rowNum.toString();
        }
        var newSeat = {seatNumber:seat, isTaken:false,cabinType:"Economy"};
        seats.push(newSeat);
    }
    return seats;
}
function isValidDate(date) {
    return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
}
Date.prototype.addHours = function(h) {
    this.setTime(this.getTime() + (h*60*60*1000));
    return this;
}




/** Called once to fill table, not needed anymore. Keep just in case of
reusing its code **/
//populateTable();
//Exports
module.exports = {
    router
};
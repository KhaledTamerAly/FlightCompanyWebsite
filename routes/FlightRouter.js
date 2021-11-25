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

//Routes




//functions
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
        var date = rowValues[2];
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


router.put('/:id', async(req,res) => {
    const { errors, isValid } = validateFlightInput(req.body);
    // Check validation
        if (!isValid) {
            return res.status(400).json(errors);
        }
        Flights.findOne({ flightNumber: req.body.flightNumber }).then(flight => {
            if (flight) {
              return res.status(400).json({ flightNumber: "Flight Number already exists" });
            }
        });
    const dateSample = new Date();
    const flightNumber = req.body.flightNumber;
    var departureTime = new Date(dateSample.toDateString() + ' ' + req.body.departureTime);
    var arrivalTime = new Date(dateSample.toDateString() + ' ' + req.body.arrivalTime);
    departureTime.setHours(departureTime.getHours()+1);
    arrivalTime.setHours(arrivalTime.getHours()+1);
    const noOfEconSeats = req.body.noOfEconSeats;
    const noOfBusinessSeats = req.body.noOfBusinessSeats;
    const noOfFirstSeats = req.body.noOfFirstSeats;
    const flightDate = new Date(Date.parse(req.body.flightDate));
    const arrivalTerminal = req.body.arrivalTerminal;
    const departureTerminal = req.body.departureTerminal;
    Flights.findById(req.params.id)
    .then(flight => {
        flight.flightNumber = flightNumber;
        flight.arrivalTerminal = arrivalTerminal;
        flight.departureTerminal = departureTerminal;
        flight.arrivalTime = arrivalTime;
        flight.departureTime = departureTime;
        flight.noOfBusinessSeats = noOfBusinessSeats;
        flight.noOfEconSeats = noOfEconSeats;
        flight.noOfFirstSeats = noOfFirstSeats;
        flight.flightDate = flightDate;
        flight.save();
        res.json({success: true});
    })
    .catch(err => res.status(404).json({success: false}));
});

//Calling functions

/** Called once to fill table, not needed anymore. Keep just in case of
reusing its code **/
//populateTable();

//Exports
module.exports = router;

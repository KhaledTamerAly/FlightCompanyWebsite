//importing modules needed
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const excelToJson = require('convert-excel-to-json');
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


router.delete('/:id', (req,res)=> {
    Flights.findByIdAndDelete(req.params.id)
    .then((flight)=>console.log('Deleted flight ' + flight.flightNumber +' successfully'))
    .catch(err => console.log(err));
});


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

//Calling functions

/** Called once to fill table, not needed anymore. Keep just in case of
reusing its code **/

//populateTable();

//Exports
module.exports = router;

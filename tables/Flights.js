const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const flightsSchema = new Schema({
    flightNumber: {
        type: String,
        unique:true
    },
    arrivalTerminal:{
        type: String,
        length:3
    },
    departureTerminal:{
        type: String,
        length: 3
    },
    flightDate: {
        type: Date
    },
    departureTime:{
        type: Date
    },
    arrivalTime:{
        type: Date
    },
    noOfEconSeats:{
        type: Number 
    },
    noOfBusinessSeats:{
        type: Number 
    },
    noOfFirstSeats:{
        type: Number 
    },
    noOfEconSeatsLeft:{
        type: Number 
    },
    noOfBusinessSeatsLeft:{
        type: Number 
    },
    noOfFirstSeatsLeft:{
        type: Number 
    },
    seats: [{seatNumber: String,isTaken: Boolean,cabinType:String}]
});

module.exports = Flights = mongoose.model('flights', flightsSchema);
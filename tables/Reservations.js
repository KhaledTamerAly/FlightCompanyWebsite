const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reservationScheme = new Schema({
    username: {
        type: String,
        required: true
    },
    fName:{
        type: String,
        required: true
    },
    lName:{
        type: String,
        required: true
    },
    passportNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    flightNumber: {
        type: String,
        unique:true
    },
    chosenSeats : {
        type : [String]
    }
});

module.exports = Reservations = mongoose.model('reservations', reservationScheme);
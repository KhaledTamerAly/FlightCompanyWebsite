const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reservationScheme = new Schema({
    bookingNumber: {
        type: String,
        unique: true,
    },
    username: {
        type: String,
        required: true,
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
        required : true,
    },
    chosenSeats : {
        type : [String],
        required : true
    },
    paid : {
        type : Number,
        required : true
    },
    cabinType : {
        type : String,
        required : true
    }
});

module.exports = Reservations = mongoose.model('reservations', reservationScheme);
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const db = require('../config/keys').mongoURL;
const Reservations = require('../tables/Reservations');
mongoose.connect(db)
    .then(()=> console.log('MongoDB connected...'))
    .catch(err=> console.log(err));
//importing Table Users
const Users = require('../tables/Users');

router.post("/addReservation",async (req,res) => {
    var uName = req.body.username;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var passport = req.body.passport;
    var uemail = req.body.email;
    var flightNum = req.body.flightNumber;
    var seats = req.body.chosenSeats;
    var bookingNumber= flightNum+"-"+(Math.floor(Math.random() * 999));

    const reservation = new Reservations({
        bookingNumber:bookingNumber,
        username:uName,
        fName:firstName,
        lName:lastName,
        passportNumber: passport,
        email: uemail,
        flightNumber: flightNum,
        chosenSeats: seats
    });
    await reservation.save();
    console.log(uName + " reserved flight "+flightNum+" Seats: "+seats+" in reservations table, booking num is "+bookingNumber);
});
function addAdmin ()
{
    const admin = new Users({fName: "Administrator",lName: " ", homeAddress: "Nelkenstrasse",countryCode: "+49",telephoneNumber:["01277"],passportNumber: "A2765", username: "administrator",password: "osama",email:"admin@osamaTours.com",userType: ["Admin"]});
    try
    {
        admin.save();
        console.log("ok");
    }
    catch(err)
    {
        consol.log(err);
    }
};
function addDefaultUser ()
{
    const user = new Users({fName: "Khaled",lName: "Tamer", homeAddress: "Nelkenstrasse",countryCode: "+49",telephoneNumber:["01277"],passportNumber: "A2765", username: "khaledtamer",password: "khaled",email:"khaledtamer@gmail.com",userType: ["User"]});
    try
    {
        user.save();
        console.log("ok");
    }
    catch(err)
    {
        consol.log(err);
    }
};
router.get('/flightDetails/:username', async(req,res) => {
    var userFlights=[];
    await Reservations.find({username:req.params.username}).then(async(reservations)=> {
        for(var i=0;i<reservations.length;i++){
            var reservation={};
            var flightNumber=reservations[i].flightNumber;
            var chosenSeats=reservations[i].chosenSeats;
            var bookingNumber=reservations[i].bookingNumber;
            await Flights.findOne({bookingNumber:bookingNumber}).then((flight)=>{
                reservation.flightNumber=flight.flightNumber;
                reservation.bookingNumber=bookingNumber;
                reservation.flightDate=flight.flightDate;
                reservation.departureTime=flight.departureTime;
                reservation.arrivalTime=flight.arrivalTime;
                reservation.departureTerminal=flight.departureTerminal;
                reservation.arrivalTerminal=flight.arrivalTerminal;
                reservation.chosenSeats=chosenSeats;
                userFlights[i]=reservation;
            });
        }
    })
    res.json(userFlights);
    });

router.delete('/:bookingNumber', (req,res)=> {
    Reservations.findOneAndDelete(req.params.bookingNumber)
    .then((reservation)=>console.log('Deleted reservation ' + reservation.bookingNumber +' successfully'))
    .catch(err => console.log(err));
});

//addDefaultUser();


module.exports = router;
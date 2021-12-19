const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const db = require('../config/keys').mongoURL;
mongoose.connect(db)
    .then(()=> console.log('MongoDB connected...'))
    .catch(err=> console.log(err));

//importing Table Users
const Users = require('../tables/Users');
const Reservations = require('../tables/Reservations');


//Routes
router.post("/addReservation",async (req,res) => {
    var uName = req.body.username;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var passport = req.body.passport;
    var uemail = req.body.email;
    var flightNum = req.body.flightNumber;
    var seats = req.body.chosenSeats;

    const reservation = new Reservations({
        username:uName,
        fName:firstName,
        lName:lastName,
        passportNumber: passport,
        email: uemail,
        flightNumber: flightNum,
        chosenSeats: seats
    });
    await reservation.save();
    console.log(uName + "reserved flight "+flightNum+" Seats: "+seats+" in reservations table");
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

//addDefaultUser();


module.exports = router;
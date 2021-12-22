const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const db = require('../config/keys').mongoURL;
const Reservations = require('../tables/Reservations');
var nodemailer = require('nodemailer');
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
    var paid=req.body.paid;

    const reservation = new Reservations({
        bookingNumber:bookingNumber,
        username:uName,
        fName:firstName,
        lName:lastName,
        passportNumber: passport,
        email: uemail,
        flightNumber: flightNum,
        chosenSeats: seats,
        paid:paid
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
    const user = new Users({fName: "Youssef",lName: "Basuny", homeAddress: "Nelkenstrasse",countryCode: "+49",telephoneNumber:["01277"],passportNumber: "A2765", username: "youssef",password: "youssef",email:"youssefbasuny@gmail.com",userType: ["User"]});
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
            var paid=reservations[i].paid;
            await Flights.findOne({bookingNumber:bookingNumber}).then((flight)=>{
                reservation.flightNumber=flightNumber;
                reservation.bookingNumber=bookingNumber;
                reservation.flightDate=flight.flightDate;
                reservation.departureTime=flight.departureTime;
                reservation.arrivalTime=flight.arrivalTime;
                reservation.departureTerminal=flight.departureTerminal;
                reservation.arrivalTerminal=flight.arrivalTerminal;
                reservation.chosenSeats=chosenSeats;
                reservation.paid=paid;
                userFlights[i]=reservation;
            });
        }
    })
    res.json(userFlights);
    });

router.delete('/:bookingNumber', async(req,res)=> {
    console.log("aaa");
     Reservations.findOneAndDelete(req.params.bookingNumber)
    .then((reservation)=>{console.log(
        'Deleted reservation ' + reservation.bookingNumber +' successfully');
         Flights.findOne({bookingNumber:reservation.bookingNumber}).then((flight)=>{
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'osamatourss@gmail.com',
                  pass: 'osama1stop'
                }
              });
              console.log(reservation);
              var mailOptions = {
                from: 'osamatourss@gmail.com',
                to: reservation.email,
                subject: 'Cancellation confirmation '+reservation.bookingNumber,
                text: 'Dear Mr/Mrs '+reservation.lName+',\n\n'+
                'This email is to confirm that you cancelled your reservation with number '+reservation.bookingNumber+'.\n'+
                'You will be refunded $'+reservation.paid+', the following are the full details of the reservation.\n'+
                'Flight number: '+reservation.flightNumber+'\n'+
                'Flight date: '+flight.flightDate+'\n'+
                'Departure time: '+flight.departureTime+'\n'+
                'Arrival time: '+flight.arrivalTime+'\n'+
                'Departure terminal: '+flight.departureTerminal+'\n'+
                'Arrival terminal: '+flight.arrivalTerminal+'\n'+
                'Seats: '+reservation.chosenSeats.join(", ")+'\n'
                
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
        });
        
    })
    .catch(err => console.log(err));
});

router.get('/userInfo/:username', (req,res)=> {
    Users.findOne({username:req.params.username})
    .then(user => res.json(user))
    .catch(err => console.log(err));
});

//addDefaultUser();

router.put('/updateUser/:username', async(req, res)=>{
    var fName=req.body.fName;
    var lName=req.body.lName;
    var homeAddress=req.body.homeAddress;
    var countryCode=req.body.countryCode;
    var telephoneNumber=req.body.telephoneNumber;
    var passportNumber=req.body.passportNumber;
    var password=req.body.password;
    var email=req.body.email;
    await Users.findOne({username:req.params.username})
    .then(async(user)=> {
        user.fName= fName==null ||fName==""? user.fName:fName
        user.lName= lName==null ||lName==""? user.lName:lName
        user.homeAddress= homeAddress==null ||homeAddress==""? user.homeAddress:homeAddress
        user.countryCode= countryCode==null ||countryCode==""? user.countryCode:countryCode
        user.telephoneNumber= telephoneNumber==null ||telephoneNumber==""? user.telephoneNumber:telephoneNumber
        user.passportNumber= passportNumber==null ||passportNumber==""? user.passportNumber:passportNumber
        user.email= email==null ||email==""? user.email:email
        user.password= password==null ||password==""? user.password:password
        //res.json(user);
        user.save();
        await Reservations.find({username:req.params.username})
        .then(reservations=>{
            for(var i=0;i<reservations.length;i++){
                reservations[i].fName=fName==null || fName==""?reservations[i].fName:fName;
                reservations[i].lName=lName==null || lName==""?reservations[i].lName:lName;
                reservations[i].email=email==null || email==""?reservations[i].email:email;
                reservations[i].passportNumber=passportNumber==null || passportNumber==""?reservations[i].passportNumber:passportNumber;
                reservations[i].save();
            }
        })
    })
    
});
module.exports = router;
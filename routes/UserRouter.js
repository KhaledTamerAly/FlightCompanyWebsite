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
const Flights = require('../tables/Flights');



//Routes
router.post("/addReservation",async (req,res) => {
    var uName = req.body.username;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var passport = req.body.passport;
    var uemail = req.body.email;
    var flightNum = req.body.flightNumber;
    var flightID = req.body.flightID;
    var seats = req.body.chosenSeats;
    var price = req.body.price;
    var bookingNumber= ""+Math.floor(Math.random() * 99999999);
    var cabinType = req.body.cabin;
    var flightType = req.body.flightType;

    const reservation = new Reservations({
        bookingNumber:bookingNumber,
        username:uName,
        fName:firstName,
        lName:lastName,
        passportNumber: passport,
        email: uemail,
        flightNumber: flightNum,
        chosenSeats: seats,
        paid:price,
        cabinType: req.body.cabin,
        flightType: flightType,
        linkedBookingNumber:"NA"
    });
    await reservation.save();

    var chosenSeats = req.body.chosenSeats;

    if(cabinType == "Economy")
    {
        await Flights.findOne({flightNumber:flightNum}).then(res=>{
            console.log(res.noOfEconSeatsLeft);
            Flights.findOneAndUpdate({flightNumber:flightNum},{noOfEconSeatsLeft:res.noOfEconSeatsLeft - seats.length},()=>console.log());
             });
    }
    else if(cabinType == "First")
    {
        await Flights.findOne({flightNumber:flightNum}).then(res=>{
            console.log(res.noOfFirstSeatsLeft);
            Flights.findOneAndUpdate({flightNumber:flightNum},{noOfFirstSeatsLeft:res.noOfFirstSeatsLeft - seats.length},()=>console.log());
             });
        
    }
    else if(cabinType == "Business")
    {
        await Flights.findOne({flightNumber:flightNum}).then(res=>{
            console.log(res.noOfBusinessSeatsLeft);
            Flights.findOneAndUpdate({flightNumber:flightNum},{noOfBusinessSeatsLeft:res.noOfBusinessSeatsLeft-seats.length},()=>console.log());
             });
        
    }
    await Flights.findOne({flightNumber:flightNum}).select('seats').then(seats=>{
        var updatedSeats = updateSeats(chosenSeats,seats.seats);
        Flights.findOneAndUpdate({flightNumber:flightNum},{seats:updatedSeats},()=>console.log("Seat Reserved in Flights table"));
    });
    console.log(uName + "reserved flight "+flightNum+" Seats: "+seats+" in reservations table");

    Flights.findOne({flightNumber:reservation.flightNumber}).then((flight)=>{
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'osamatourss@gmail.com',
                  pass: 'osama1stop'
                }
              });
              var mailOptions = {
                from: 'osamatourss@gmail.com',
                to: reservation.email,
                subject: 'Itinerary confirmation '+reservation.bookingNumber,
                text: 'Dear Mr/Mrs '+reservation.lName+',\n\n'+
                'This email is to confirm that you booked your reservation with number '+reservation.bookingNumber+'.\n'+
                'You paid $'+reservation.paid+', the following are the full details of the reservation.\n'+
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
    res.json(bookingNumber);
});
router.post('/linkReservations', (req,res)=>{
    var departBookingNumber = req.body.departBookingNumber;
    var returnBookingNumber = req.body.returnBookingNumber;

    Reservations.findOneAndUpdate({bookingNumber:departBookingNumber},{linkedBookingNumber:returnBookingNumber},()=>{
         Reservations.findOneAndUpdate({bookingNumber:returnBookingNumber},{linkedBookingNumber:departBookingNumber},()=>{
            console.log('linked reservatons');
        });
    });
});
router.get('/flightDetails/:username', async(req,res) => {
    var userFlights=[];
    await Reservations.find({username:req.params.username}).then(async(reservations)=> {
        for(var i=0;i<reservations.length;i++){
            var reservation={};
            var flightNumber=reservations[i].flightNumber;
            var chosenSeats=reservations[i].chosenSeats;
            var bookingNumber=reservations[i].bookingNumber;
            var paid=reservations[i].paid;
            await Flights.findOne({flightNumber:flightNumber}).then((flight)=>{
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
    Reservations.findOneAndDelete(req.params.bookingNumber).then(async(reservation)=>
    {
        console.log('Deleted reservation ' + reservation.bookingNumber +' successfully');
        
        await Reservations.findOneAndDelete(reservation.linkedBookingNumber).then(async(reservation1)=>{
            Flights.findOne({flightNumber:reservation.flightNumber}).then((flight)=>{
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
            Flights.findOne({flightNumber:reservation.flightNumber}).select('seats').then(seats=>{
                var updatedSeats = updateSeatsToFalse(reservation.chosenSeats,seats.seats);
                Flights.findOneAndUpdate({flightNumber:reservation.flightNumber},{seats:updatedSeats},()=>{
                    console.log("Seat Unreserved in Flights table");
                });
            });  
            if(reservation.cabinType == "Economy")
        {
            await Flights.findOne({flightNumber:reservation.flightNumber}).then(res=>{
                Flights.findOneAndUpdate({flightNumber:reservation.flightNumber},{noOfEconSeatsLeft:res.noOfEconSeatsLeft + reservation.chosenSeats.length},()=>console.log());
                 });
            }
            else if(reservation.cabinType == "First")
        {
            await Flights.findOne({flightNumber:reservation.flightNumber}).then(res=>{
                Flights.findOneAndUpdate({flightNumber:reservation.flightNumber},{noOfFirstSeatsLeft:res.noOfFirstSeatsLeft + reservation.chosenSeats.length},()=>console.log());
                 });
            
            }
            else if(reservation.cabinType == "Business")
        {
            await Flights.findOne({flightNumber:reservation.flightNumber}).then(res=>{
                Flights.findOneAndUpdate({flightNumber:reservation.flightNumber},{noOfBusinessSeatsLeft:res.noOfBusinessSeatsLeft+reservation.chosenSeats.length},()=>console.log());
                 });
            }
            console.log('deleted linked flight')
            ////////////////////////////////////////////////////////
            Flights.findOne({flightNumber:reservation1.flightNumber}).then((flight)=>{
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                      user: 'osamatourss@gmail.com',
                      pass: 'osama1stop'
                    }
                  });
                  console.log(reservation1);
                  var mailOptions = {
                    from: 'osamatourss@gmail.com',
                    to: reservation1.email,
                    subject: 'Cancellation confirmation '+reservation1.bookingNumber,
                    text: 'Dear Mr/Mrs '+reservation1.lName+',\n\n'+
                    'This email is to confirm that you cancelled your reservation with number '+reservation1.bookingNumber+'.\n'+
                    'You will be refunded $'+reservation1.paid+', the following are the full details of the reservation.\n'+
                    'Flight number: '+reservation1.flightNumber+'\n'+
                    'Flight date: '+flight.flightDate+'\n'+
                    'Departure time: '+flight.departureTime+'\n'+
                    'Arrival time: '+flight.arrivalTime+'\n'+
                    'Departure terminal: '+flight.departureTerminal+'\n'+
                    'Arrival terminal: '+flight.arrivalTerminal+'\n'+
                    'Seats: '+reservation1.chosenSeats.join(", ")+'\n'
                    
                  };
                  
                  transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                    }
                  });
            });
            Flights.findOne({flightNumber:reservation1.flightNumber}).select('seats').then(seats=>{
                var updatedSeats = updateSeatsToFalse(reservation1.chosenSeats,seats.seats);
                Flights.findOneAndUpdate({flightNumber:reservation1.flightNumber},{seats:updatedSeats},()=>{
                    console.log("Seat Unreserved in Flights table");
                });
            });
            
            if(reservation1.cabinType == "Economy")
        {
            await Flights.findOne({flightNumber:reservation1.flightNumber}).then(res=>{
                Flights.findOneAndUpdate({flightNumber:reservation1.flightNumber},{noOfEconSeatsLeft:res.noOfEconSeatsLeft + reservation1.chosenSeats.length},()=>console.log());
                 });
            }
            else if(reservation1.cabinType == "First")
        {
            await Flights.findOne({flightNumber:reservation1.flightNumber}).then(res=>{
                Flights.findOneAndUpdate({flightNumber:reservation1.flightNumber},{noOfFirstSeatsLeft:res.noOfFirstSeatsLeft + reservation1.chosenSeats.length},()=>console.log());
                 });
            
            }
            else if(reservation1.cabinType == "Business")
        {
            await Flights.findOne({flightNumber:reservation1.flightNumber}).then(res=>{
                Flights.findOneAndUpdate({flightNumber:reservation1.flightNumber},{noOfBusinessSeatsLeft:res.noOfBusinessSeatsLeft+reservation1.chosenSeats.length},()=>console.log());
                 });
            }
        
        });    
    })
        .catch(err => console.log(err));
});
router.get('/userInfo/:username', (req,res)=> {
    Users.findOne({username:req.params.username})
    .then(user => res.json(user))
    .catch(err => console.log(err));
});
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
router.get('/reservationDetails/:bookingNumber', (req,res) => {
    Reservations.findOne({bookingNumber:req.params.bookingNumber}).then((reservations)=> {
        res.json(reservations);
    })
});
router.post('/updateSeatReservation', (req,res)=>{
    var chosenSeats = req.body.chosenSeats;
    var bookingNumber= req.body.bookingNumber;
    var flightNum = req.body.flightNumber;
    Reservations.findOneAndUpdate({bookingNumber:bookingNumber},{chosenSeats:chosenSeats},()=>{
        Flights.findOne({flightNumber:flightNum}).select('seats').then(seats=>{
            var updatedSeats = updateSeatsToFalse(req.body.oldChosenSeats,seats.seats);
            Flights.findOneAndUpdate({flightNumber:flightNum},{seats:updatedSeats},()=>{
                console.log("Seat Unreserved in Flights table");
                Flights.findOne({flightNumber:flightNum}).select('seats').then(seats=>{
                         var updatedSeats = updateSeats(chosenSeats,seats.seats);
                         Flights.findOneAndUpdate({flightNumber:flightNum},{seats:updatedSeats},()=>console.log("Seat Reserved in Flights table"));
                     });
            });
        });
    });
});




//Functions
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
function updateSeatsToFalse(chosenSeats, allSeats)
{
    for(var i =0;i<chosenSeats.length;i++)
    {
        var seatToLookFor = chosenSeats[i];

        for(var j =0;j<allSeats.length;j++)
        {
            if(seatToLookFor == allSeats[j].seatNumber)
                {
                    allSeats[j].isTaken = false;
                }
        }
    }
    return allSeats;
}

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
    const user = new Users({fName: "Youssef",lName: "Basuny", homeAddress: "Nelkenstrasse",countryCode: "+49",telephoneNumber:["01277"],passportNumber: "A2765", username: "youssef",password: "youssef",email:"k.tamer155@gmail.com",userType: ["User"]});
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
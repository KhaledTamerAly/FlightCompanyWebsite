require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_TEST);
const cors = require('cors');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const db = require('../config/keys').mongoURL;
const Reservations = require('../tables/Reservations');
var nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');
router.use(express.json());
mongoose.connect(db)
    .then(()=> console.log('MongoDB connected...'))
    .catch(err=> console.log(err));
//importing Table Users
const Users = require('../tables/Users');
const Flights = require('../tables/Flights');

router.use(cors());


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
            Flights.findOneAndUpdate({flightNumber:flightNum},{noOfEconSeatsLeft:res.noOfEconSeatsLeft - seats.length},()=>{});
             });
    }
    else if(cabinType == "First")
    {
        await Flights.findOne({flightNumber:flightNum}).then(res=>{
            Flights.findOneAndUpdate({flightNumber:flightNum},{noOfFirstSeatsLeft:res.noOfFirstSeatsLeft - seats.length},()=>{});
             });
        
    }
    else if(cabinType == "Business")
    {
        await Flights.findOne({flightNumber:flightNum}).then(res=>{
            Flights.findOneAndUpdate({flightNumber:flightNum},{noOfBusinessSeatsLeft:res.noOfBusinessSeatsLeft-seats.length},()=>{});
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
            'You paid'+reservation.paid+' Euros, the following are the full details of the reservation.\n'+
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
router.get('/emailItinerary/:bookingNumber', async (req,res)=>{
    Reservations.findOne({bookingNumber:req.params.bookingNumber})
    .then(async(reservation)=>{
        var flight;
        await Flights.findOne({flightNumber:reservation.flightNumber})
        .then(async (Flight)=>flight=Flight)
        Reservations.findOne({bookingNumber:reservation.linkedBookingNumber})
        .then(async(reservation2)=>{
            var flight2;
            await Flights.findOne({flightNumber:reservation2.flightNumber})
            .then(async Flight=> flight2=Flight)
            var departureRes=reservation;
            var arrivalRes=reservation2;
            var departureFlight=flight;
            var arrivalFlight=flight2;
            if(reservation2.flightType=="Departure"){
                departureRes=reservation2;
                arrivalRes=reservation;
                departureFlight=flight2;
                arrivalFlight=flight;
            }
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
                subject: 'Osama Tours requested itenerary',
                text: 'Dear Mr/Mrs '+reservation.lName+',\n\n'+
                "You've requested an itenerary for booking numbers "+departureRes.bookingNumber+" and "+arrivalRes.bookingNumber+'\n'+
                'Price for both flights is '+reservation.paid+" Euros"+'\n\n'+
                'Details for the departure flight are as follows.. \n'+
                'Booking number: '+departureRes.bookingNumber+'\n'+
                'Flight number: '+departureRes.flightNumber+'\n'+
                'Flight date: '+departureFlight.flightDate+'\n'+
                'Departure time: '+departureFlight.departureTime+'\n'+
                'Arrival time: '+departureFlight.arrivalTime+'\n'+
                'Departure terminal: '+departureFlight.departureTerminal+'\n'+
                'Arrival terminal: '+departureFlight.arrivalTerminal+'\n'+
                'Seats: '+departureRes.chosenSeats.join(", ")+'\n\n'+
                
                'Details for the return flight are as follows.. \n'+
                'Booking number: '+arrivalRes.bookingNumber+'\n'+
                'Flight number: '+arrivalRes.flightNumber+'\n'+
                'Flight date: '+arrivalFlight.flightDate+'\n'+
                'Departure time: '+arrivalFlight.departureTime+'\n'+
                'Arrival time: '+arrivalFlight.arrivalTime+'\n'+
                'Departure terminal: '+arrivalFlight.departureTerminal+'\n'+
                'Arrival terminal: '+arrivalFlight.arrivalTerminal+'\n'+
                'Seats: '+arrivalRes.chosenSeats.join(", ")+'\n\n'
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
        })
    })
})
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
router.delete('/:bookingNumber', async(req,res)=> 
{
    console.log(req.params.bookingNumber)
    Reservations.findOneAndDelete({bookingNumber:req.params.bookingNumber}).then((reservation)=>
    {
        console.log(reservation);
        console.log('Deleted reservation ' + reservation.bookingNumber +' successfully');
        Reservations.findOneAndDelete({bookingNumber:reservation.linkedBookingNumber}).then(async(reservation1)=>
        {    
            console.log('Deleted reservation ' + reservation1.bookingNumber +' successfully');
            
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
                    subject: 'Cancellation confirmation '+reservation.bookingNumber,
                    text: 'Dear Mr/Mrs '+reservation.lName+',\n\n'+
                    'This email is to confirm that you cancelled your reservation with number '+reservation.bookingNumber+'.\n'+
                    'You will be refunded '+reservation.paid+' Euros, the following are the full details of the reservation.\n'+
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
                Flights.findOneAndUpdate({flightNumber:reservation.flightNumber},{noOfEconSeatsLeft:res.noOfEconSeatsLeft + reservation.chosenSeats.length},()=>{});
                 });
            }
            else if(reservation.cabinType == "First")
        {
            await Flights.findOne({flightNumber:reservation.flightNumber}).then(res=>{
                Flights.findOneAndUpdate({flightNumber:reservation.flightNumber},{noOfFirstSeatsLeft:res.noOfFirstSeatsLeft + reservation.chosenSeats.length},()=>{});
                 });
            
            }
            else if(reservation.cabinType == "Business")
        {
            await Flights.findOne({flightNumber:reservation.flightNumber}).then(res=>{
                Flights.findOneAndUpdate({flightNumber:reservation.flightNumber},{noOfBusinessSeatsLeft:res.noOfBusinessSeatsLeft+reservation.chosenSeats.length},()=>{});
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
                  var mailOptions = {
                    from: 'osamatourss@gmail.com',
                    to: reservation1.email,
                    subject: 'Cancellation confirmation '+reservation1.bookingNumber,
                    text: 'Dear Mr/Mrs '+reservation1.lName+',\n\n'+
                    'This email is to confirm that you cancelled your reservation with number '+reservation1.bookingNumber+'.\n'+
                    'You will be refunded'+reservation1.paid+' Euros, the following are the full details of the reservation.\n'+
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
                Flights.findOneAndUpdate({flightNumber:reservation1.flightNumber},{noOfEconSeatsLeft:res.noOfEconSeatsLeft + reservation1.chosenSeats.length},()=>{});
                 });
            }
            else if(reservation1.cabinType == "First")
        {
            await Flights.findOne({flightNumber:reservation1.flightNumber}).then(res=>{
                Flights.findOneAndUpdate({flightNumber:reservation1.flightNumber},{noOfFirstSeatsLeft:res.noOfFirstSeatsLeft + reservation1.chosenSeats.length},()=>{});
                 });
            
            }
            else if(reservation1.cabinType == "Business")
        {
            await Flights.findOne({flightNumber:reservation1.flightNumber}).then(res=>{
                Flights.findOneAndUpdate({flightNumber:reservation1.flightNumber},{noOfBusinessSeatsLeft:res.noOfBusinessSeatsLeft+reservation1.chosenSeats.length},()=>{});
                 });
            }
        
        });    
    }).catch(err => console.log(err));
}); 
router.get('/userInfo/:username', (req,res)=> {
    Users.findOne({username:req.params.username})
    .then(user => res.json(user))
    .catch(err => console.log(err));
});
router.put('/updateUser/:username', async(req, res)=>{
    if(req.body.fName=="" || req.body.lName=="" || req.body.homeAddress=="" || req.body.countryCode=="" || req.body.telephoneNumber=="" || req.body.passportNumber=="" || req.body.email=="")
        res.send({errors:"All fields must be filled"})
    else{
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
        res.send("done");
    }
});
router.get('/reservationDetails/:bookingNumber', (req,res) => {
    Reservations.findOne({bookingNumber:req.params.bookingNumber}).then((reservation)=> {
        res.json(reservation);
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
router.post('/payment', cors(), async(req,res)=>{
    var {amount , id} = req.body;
    try {
		const payment = await stripe.paymentIntents.create({
			amount: amount*100,
			currency: "EUR",
			description: "Reserved Flight",
			payment_method: id,
			confirm: true
		})
		res.json({
			message: "Payment successful",
			success: true
		})
	} catch (error) {
		res.json({
			message: "Payment failed",
			success: false
		})
	}

})
router.post('/changeReservation', async(req,res)=>{
    var uName = req.body.username;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var passport = req.body.passport;
    var uemail = req.body.email;
    var flightNum = req.body.flightNumber;
    var seats = req.body.chosenSeats;
    var price = req.body.price;
    var bookingNumber= req.body.bookingNumber;
    var cabinType = req.body.cabin;
    var flightType = req.body.flightType;
    var linkedBookingNumber = null;
    //delete old reservation
    
    await Reservations.findOneAndDelete(bookingNumber).then(async(reservation1)=>
    {
        linkedBookingNumber = reservation1.linkedBookingNumber;

        await Flights.findOne({flightNumber:reservation1.flightNumber}).select('seats').then(seats=>{
            var updatedSeats = updateSeatsToFalse(reservation1.chosenSeats,seats.seats);
            Flights.findOneAndUpdate({flightNumber:reservation1.flightNumber},{seats:updatedSeats},()=>{
                console.log("Seat Unreserved in Flights table");
            });
        });
        
        if(reservation1.cabinType == "Economy")
        {
        await Flights.findOne({flightNumber:reservation1.flightNumber}).then(res=>{
            Flights.findOneAndUpdate({flightNumber:reservation1.flightNumber},{noOfEconSeatsLeft:res.noOfEconSeatsLeft + reservation1.chosenSeats.length},()=>{});
             });
        }
        else if(reservation1.cabinType == "First")
        {
        await Flights.findOne({flightNumber:reservation1.flightNumber}).then(res=>{
            Flights.findOneAndUpdate({flightNumber:reservation1.flightNumber},{noOfFirstSeatsLeft:res.noOfFirstSeatsLeft + reservation1.chosenSeats.length},()=>{});
             });
        }
        else if(reservation1.cabinType == "Business")
        {
        await Flights.findOne({flightNumber:reservation1.flightNumber}).then(res=>{
            Flights.findOneAndUpdate({flightNumber:reservation1.flightNumber},{noOfBusinessSeatsLeft:res.noOfBusinessSeatsLeft+reservation1.chosenSeats.length},()=>{});
             });
        }
    });
    
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
        linkedBookingNumber:linkedBookingNumber
    });
    await reservation.save();
    

    var chosenSeats = req.body.chosenSeats;

    if(cabinType == "Economy")
    {
        await Flights.findOne({flightNumber:flightNum}).then(res=>{
            Flights.findOneAndUpdate({flightNumber:flightNum},{noOfEconSeatsLeft:res.noOfEconSeatsLeft - seats.length},()=>{});
             });
    }
    else if(cabinType == "First")
    {
        await Flights.findOne({flightNumber:flightNum}).then(res=>{
            Flights.findOneAndUpdate({flightNumber:flightNum},{noOfFirstSeatsLeft:res.noOfFirstSeatsLeft - seats.length},()=>{});
             });
        
    }
    else if(cabinType == "Business")
    {
        await Flights.findOne({flightNumber:flightNum}).then(res=>{
            Flights.findOneAndUpdate({flightNumber:flightNum},{noOfBusinessSeatsLeft:res.noOfBusinessSeatsLeft-seats.length},()=>{});
             });
        
    }
    await Flights.findOne({flightNumber:flightNum}).select('seats').then(seats=>{
        var updatedSeats = updateSeats(chosenSeats,seats.seats);
        Flights.findOneAndUpdate({flightNumber:flightNum},{seats:updatedSeats},()=>console.log("Seat Reserved in Flights table"));
    });
    console.log(uName + "reserved flight "+flightNum+" Seats: "+seats+" in reservations table");
    res.json(linkedBookingNumber);
});
router.get('/flightInfo/:bookingNumber', (req,res)=>{
    Reservations.findOne({bookingNumber: req.params.bookingNumber}).then(reservation=>{
        Flights.findOne({flightNumber: reservation.flightNumber}).then(flight =>{
          Reservations.findOne({bookingNumber:reservation.linkedBookingNumber}).then(linkedReservation=>{
              Flights.findOne({flightNumber:linkedReservation.flightNumber}).then(linkedFlight=>{
                var flightInfoObject = {bnReservation: reservation, fnFlight: flight, linkedFlight:linkedFlight, linkedBooking:linkedReservation};
                res.json(flightInfoObject)
              })
          })
        });
    });
    
    
});
router.post('/signUp', async (req, res) => {
    try {
        if(req.body.password1=="" || req.body.password2=="" || req.body.fName=="" || req.body.lName=="" || req.body.homeAddress=="" || req.body.countryCode=="" || req.body.telephoneNumber=="" || req.body.passportNumber=="" || req.body.username=="" || req.body.email=="")
            res.send({errors:"All fields must be filled"})
        else{
            await Users.findOne({username:req.body.username}).then(async found=>{
                if(found!=null){
                    res.send({errors:"Username already taken"});
                }
                else if(req.body.password1!=req.body.password2)
                    res.send({errors:"Passwords don't match"});
                else{
                    const hashedPassword = await bcrypt.hash(req.body.password1, 10);
                    const fName=req.body.fName;
                    const lName=req.body.lName;
                    const homeAddress=req.body.homeAddress;
                    const countryCode=req.body.countryCode;
                    const telephoneNumber=req.body.telephoneNumber.split('\n');
                    const passportNumber=req.body.passportNumber;
                    const username=req.body.username.toLowerCase();
                    const email=req.body.email;
                    const user = new Users({ fName: fName, lName: lName, homeAddress:homeAddress, countryCode:countryCode, telephoneNumber:telephoneNumber, passportNumber:passportNumber, username:username, password:hashedPassword, email:email, userType:["User"]});
                    user.save();
                    res.send(user);
                }
            });
        }
    } catch(err) {
      res.status(500).send(err);
    }
});
router.put('/changePassword/:username', async (req,res)=>{
    if(req.body.oldPassword=="" || req.body.newPassword1=="" || req.body.newPassword2=="")
        res.send({errors:"All fields must be filled"})
    else{
      await Users.findOne({username:req.params.username}).then(async (user)=>{
        var errors="";
        var match=false;
        match=await bcrypt.compare(req.body.oldPassword,user.password);
        if(match){
            if(req.body.newPassword1!=req.body.newPassword2)
                errors="New passwords don't match";
            else if(req.body.newPassword1==req.body.oldPassword)
                errors="New password cannot be the same as old password"
            else{
                try{
                    const hashedPassword = await bcrypt.hash(req.body.newPassword1, 10);
                    user.password=hashedPassword;
                    user.save();
                    errors="Password changed successfully!";
                }
                catch{
                    res.send("oops")
                }
            }
        }
        else
            errors="Incorrect old password";
        res.send({errors:errors});
      })
    }
})
router.post('/login', async (req, res) => {
    var errors="";
  await Users.findOne({username:req.body.username}).then(async (user) => {
  if (user == null){
    errors="Invalid username";
    res.send({errors:errors});
  }
  else if(req.body.password==""){
      errors="Invalid password";
      res.send({errors:errors});
  }
  else{
      var found=false;
      found=await bcrypt.compare(req.body.password, user.password);
      try {
      if(found) {
          const payload={username:user.username,type:user.userType};
          const accessToken = jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET);
          res.json(JSON.parse(Buffer.from(accessToken.split('.')[1],'base64')));
      } else {
          errors="Incorrect password";
          res.send({errors:errors});
      }
      } catch(error) {
      console.log(error)
      }
  }
})
});
router.post('/refund/:username',(req,res)=>{
    var price = -1 * req.body.amount;

    Users.findOne({username:req.params.username}).then(user => {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'osamatourss@gmail.com',
              pass: 'osama1stop'
            }
          });
          var mailOptions = {
            from: 'osamatourss@gmail.com',
            to: user.email,
            subject: 'Refund From OsamaTours',
            text: 'Dear Mr/Mrs '+user.lName+',\n\n'+
            'This email is for a refund of '+price+" Euros"
          };
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
    })

});
router.post('/updatePricesInReservation/:bookingNumber',(req,res)=>{
     Reservations.findOneAndUpdate({bookingNumber:req.params.bookingNumber},{paid:req.body.price},()=>{
     });
})

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
    const admin = new Users({fName: "Administrator",lName: "admin", homeAddress: "Nelkenstrasse",countryCode: "+49",telephoneNumber:["0000"],passportNumber: "AAA", username: "administrator",password: "osama",email:"admin@osamaTours.com",userType: ["Admin"]});
    try
    {
        admin.save();
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

//addAdmin();
//addDefaultUser();
module.exports = router;
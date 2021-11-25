const express = require('express');
const mongoose = require('mongoose');

const flightRouter = require('./routes/FlightRouter');
const userRouter = require('./routes/UserRouter');

const app = express();
app.use(express.json());

//Connecting to DB
const db = require('./config/keys').mongoURL;
mongoose.connect(db)
    .then(()=> console.log('MongoDB connected...'))
    .catch(err=> console.log(err));


app.use('/users',userRouter);

//Get flight table
const Flights = require('./tables/Flights');
app.use('/flights',flightRouter.router);



//Routes
app.get('/', (req,res)=>{
    Flights.find({}).then((flight)=>res.json(flight));
});


//Run server
const port = process.env.PORT || 5000;
app.listen(port, () => {console.log("Running Server...")});
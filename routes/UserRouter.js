const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const db = require('../config/keys').mongoURL;
mongoose.connect(db)
    .then(()=> console.log('MongoDB connected...'))
    .catch(err=> console.log(err));

//importing Table Users
const Users = require('../tables/Users');

function addAdmin (){
    const admin = new Users({fName: "Youssef",lName: "Bassiouny", homeAddress: "Nelkenstrasse",countryCode: "+49",telephoneNumber:["01277"],passportNumber: "A2765", username: "youssef",password: "osama",email:"youssef@osamaTours.com",userType: ["Admin"]});
    try{
        admin.save();
       console.log("ok");
    }catch(err){
        consol.log(err);
    }
};

//addAdmin();


module.exports = router;
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const db = require('../config/keys').mongoURL;
mongoose.connect(db)
    .then(()=> console.log('MongoDB connected...'))
    .catch(err=> console.log(err));

//importing Table Users
const Users = require('../tables/Users');

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
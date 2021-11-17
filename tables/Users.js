const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersScheme = new Schema({
    fName:{
        type: String,
        required: true
    },
    lName:{
        type: String,
        required: true
    },
    homeAddress:{
        type: String,
        required: true
    },
    countryCode:{
        type: String,
        required: true
    },
    telephoneNumber:{
        type: [String],
        required: true
    },
    passportNumber: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    userType:{
        type: ['Admin','User']
    }
});

module.exports = Users = mongoose.model('users', usersSchema);
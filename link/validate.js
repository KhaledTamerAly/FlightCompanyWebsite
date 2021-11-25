const Validator = require("validator");
const isEmpty = require("is-empty");


 function validateFlightInput(data) {
  let errors = {};
// Convert empty fields to an empty string so we can use validator functions
  data.flightNumber = !isEmpty(data.flightNumber) ? data.flightNumber : "";
  data.arrivalTerminal = !isEmpty(data.arrivalTerminal) ? data.arrivalTerminal : "";
  data.departureTerminal = !isEmpty(data.departureTerminal) ? data.departureTerminal : "";
  data.flightDate = !isEmpty(data.flightDate) ? data.flightDate : "";
  data.departureTime = !isEmpty(data.departureTime) ? data.departureTime : "";
  data.arrivalTime = !isEmpty(data.arrivalTime) ? data.arrivalTime : "";
  data.noOfEconSeats = !isEmpty(data.noOfEconSeats) ? data.noOfEconSeats : "";
  data.noOfBusinessSeats = !isEmpty(data.noOfBusinessSeats) ? data.noOfBusinessSeats : "";
  data.noOfFirstSeats = !isEmpty(data.noOfFirstSeats) ? data.noOfFirstSeats : "";

  if (Validator.isEmpty(data.flightNumber)) {
    errors.flightNumber = "Flight Number field is required";
  }

  if (Validator.isEmpty(data.arrivalTerminal)) {
    errors.arrivalTerminal = "Arrival Terminal field is required";
  }

  if (Validator.isEmpty(data.departureTerminal)) {
    errors.departureTerminal = "Departure Terminal field is required";
  }
if (Validator.isEmpty(data.flightDate)) {
    errors.flightDate = "flightDate field is required";
  }
  if (Validator.isEmpty(data.departureTime)) {
    errors.departureTime = "Departure Time field is required";
  }

  if (Validator.isEmpty(data.arrivalTime)) {
    errors.arrivalTime = "Arrival Time field is required";
  }
  if (Validator.isEmpty(data.noOfEconSeats)) {
    errors.noOfEconSeats = "Number of Econonomy class seats field is required";
  }
if (Validator.isEmpty(data.noOfBusinessSeats)) {
    errors.noOfBusinessSeats = "Number of Business class seats field is required";
  }
if (Validator.isEmpty(data.noOfFirstSeats)) {
   errors.noOfFirstSeats = "Number of First class seats field is required";
 }
if (isNaN(data.noOfEconSeats)){
    errors.noOfEconSeats = "Number of Econonomy class seats field must be a number";
}
if (isNaN(data.noOfBusinessSeats)){
    errors.noOfBusinessSeats = "Number of Business class seats field must be a number";
}
if (isNaN(data.noOfFirstSeats)){
    errors.noOfFirstSeats = "Number of First class seats field must be a number";
}
return {
    errors,
    isValid: isEmpty(errors)
  };
};
module.exports=validateFlightInput;
# Osama
ACL Project

# Project Title
The theme of the project, is to create a complete Airline Reservation System. An Airline 
Reservation System is a web application through which individuals can reserve and pay 
for flights in order to travel to different countries and sometimes domestic cities.

# Motivation
• Learn how to properly use the Agile Methodology to plan out a project and develop 
the software.
• Learn to research and master the use of the MERN Stack.
• Learn how to work together as a team on GitHub.

# Build Status
No Bugs in build... Yet. :upside_down_face:

# Code Style
In Client side, we use a mix of Class-based ReactJS Components and Functional-based ReactJS Components, while usually depending on the later. It's usually less verbose and easier to understand. Hooks in particular provide a smooth experience with ReactJS.

# Tech/Framework used
- MongoDB/Mongoose
- ExpressJS
- ReactJS
- NodeJS
- Reactstrap/Bootsrap
- Material UI
- ReactRouterDOM
- Axios

# Features
- Can create/update flights with new info.
- Displays all flights for the admin for convenient manipulation.
- Search for specific flights using partial info.
- Deletes a flight.
- A flight schedule that displays all future flights will be displayed for any guest user.

# Code Examples
- server.js is the backend engine runner. Any path '/flights' is handled by FlightRouter.js
- /routes/FlightRouter.js handles all routes (HTTP Requests) from the server. It gets all info from the Flights DB.
Ex: An HTTP request that gets all flights from DB.
```
router.get('/',(req,res)=>{
    Flights.find({}).then(flights => {
        res.json(flights);
    });   
})
```
- UserRouter.js handles all routes (HTTP Requests) from the server. It gets all info from the Users DB.
- /tables/Users.js & Flights.js are the schema for the users and flights DB, respectively. To use DB anytime through the app we use them.
- /link/validate.js is used to check all data entered in flights DB.
- /config/keys.js is used to set up DB link.
- /client folder holds all logic for ReactJS and Frontend
- /client/index.js is the engine runner for frontend. It renders App.js on the ReactDOM.
- /client/App.js just renders all webpages in our website from /client/webpages/.
- /client/components are all reusable components used, ex: CardPanel, Forms, Searchbars, Buttons.

# Installation
- Pull project from master branch using `git clone https://github.com/KhaledTamerAly/Osama.git`
- Make sure you are in Osama folder in terminal, if not `cd osama` in terminal.
- Run `npm install`, then `npm audit fix` if needed.
- Change directory to client folder `cd client`.
- Run `npm install`, then `npm audit fix` if needed.
- Change directory back to Osama `cd ..`.
- To run project, enter in terminal`npm run dev`.
- Wait for project to automatically open in browser.

# How to Use?
- Once **home page** is opened, you will be greeted with a 1. login button and a register button. 2. A table used to *show flight schedules.*
- Login button will redirect to the **admin page** (Currently, there is only one existing user that is an Admin). (ReqID:3)
- You can use *table to see all flights in DB.* (ReqID:10)
- Once you *login as an admin*, you will see a 1. Search bars 2. Search results with update/delete buttons for each flight 3. A button to add a new flight.
- Initially, with *no search paramaters*, you will see a *list for all flights.* (ReqID:6)
- To search for a *specific flight, enter any needed paramter to search for, then click the search button*. (ReqID:5)
- To *delete a flight, click the red delete button*. A *popup is appear to ask for your confirmation*. Press on 'Delete, I am sure' to permanately delete it. (ReqID:8,9)
- To *update a flight, click on blue update button*. You will be redirected to **editFlight page**.
- Enter *new details and press submit button to update*. (ReqID:7)
- Once done updating flights, click to homepage button to go back to **admin page.**
- To add a new flight, click on green 'Add new flight' button to go to **editFlight page**.
- Enter *new details and press submit button to update*. (ReqID:4)
- Once done adding new flights, click to homepage button to go back to **admin page.**
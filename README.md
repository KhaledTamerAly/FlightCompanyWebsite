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
No Bugs in build... Yet.:upside_down_face:

# Code Style
In Client side, we use a mix of Class-based ReactJS Components and Functional-based ReactJS Components, while usually depending on the latter. It's usually less verbose and easier to understand. Hooks in particular provide a smooth experience with ReactJS.

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
- /tables/Users.js ,Flights.js, Reservation.js are the schema for the users, flights, and flight reservations DB, respectively. To use DB anytime through the app we use them.
- /link/validate.js is used to check all data entered in flights DB.
- /config/keys.js is used to set up DB link.
- /client folder holds all logic for ReactJS and Frontend
- /client/index.js is the engine runner for frontend. It renders App.js on the ReactDOM.
- /client/App.js just renders all webpages in our website from /client/webpages/.
- /client/components are all reusable components used, ex: CardPanel, Forms, Searchbars, Buttons.
- /client/webpages are all pages and routes we have in website.

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
- Once **home page** is opened, you will be greeted with a 1. login button, a sign-up button, a login-asAdmin button, and a the website's title button which always redirects to the home page. 2. A table used to *show flight schedules.*
- Login as Admin button will redirect to the **admin page** (Currently, there is only one existing user that is an Admin). (ReqID:3)
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
- ----------------------------------------------Sprint 2----------------------------------------------------------------
- In the **home page**, you can login using the login button which will provide the user with their options if the press on the account icon on the NavBar. (Currently, there is only one user as login feature isn't implemeted yet)
- Clicking on the account icon on the NavBar will provide you a list of options:
    1. Log Out -> guest user page.
    2. My Reservations -> **myReservations page** which handles all actions related to reservations.
    3. My Informations -> **myInformation page** which helps user edit any of their info.
- In **myReservations page**, the *user will see a table of all their current reservations*. (ReqID:26)
- *Clicking on a reservation will prompt the user to delete it* using Garbage Button. (ReqID:27)
- Once clicked on Garbage Button, a *pop up will appear asking for user confirmation*. (ReqID:28)
- System will *automatically send email along with refund to user's email*. (ReqID:29)
- In **myInformation page**, User will be greeted will their info as text boxes, they will see old values for their info.
- Clicking and *typing in any of the text box* will make an update button appear.
- Clicking on *that button after changing any value will change Info of user in db and all their reservations*. (ReqID:29,29.1)
- In **home page**, under the flights table, you will see the flight search engine.
- *Enter all parameters that you are looking for and press Search button.* (ReqID:11)
- Now you will see all *departing flights having those conditions you searched for*. Pressing on a flight will make a pop up appear with all the flight details. *Pressing the select button will save the flight*. (ReqID:12,13)
- *Now a list of return flights will appear. You can choose one as the same manner as above*. (ReqID:14,15,16)
- *Now a summary for both flights* will appear along with a confirmation button. (Some details are still not chosen and therefore empty, like seats chosen) (ReqID:17)
- Pressing on the accordion will reveal more details for flight.
- Pressing *choose seats button will reveal a popup asking for user confirmation*. If chosen, they will be directed to seat map page if logged in, else guest user will be prompted to login. (ReqID:18)
- *Seat map is a list of checkboxes each with seat number written above it.* Cabin Classes not chosen and reserved seats will be disabled. Number of seats you can currently reserve is show above. (ReqID:19)
- *Clicking on a checkbox will turn it green* (as in chosen), and number of seats you can choose will decrease.
- *You can also uncheck a box* (to unchoose seat). You cannot choose more than number of seats you chose. (ReqID:20)
- *Pressing confirm seats will lead you to seat map of return flight*. Choose seats similarly as above. (ReqID:21,22)
- Pressing confirm seats will finally reserve seats and flights and *now a summary for entire flights and its details are revealed* as accordions. (ReqID:24)

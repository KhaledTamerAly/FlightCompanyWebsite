import React, { Component ,  useState, useEffect } from 'react';
import axios from 'axios';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


function Summary(props)
{
    const [expanded, setExpanded] = React.useState(false);
    const [flights, setFlights] = React.useState(null);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(async()=>{
    var result = {};  
    var bodyDep = { 
    flightNumber: props.depFlight,
  }
  var bodyRet = { 
    flightNumber: props.retFlight,
  }
    const api = {};
    await axios.post('flights/',bodyDep,api).then(res=>{
        result.depFlight = res.data;
      })
    await axios.post('flights/',bodyRet,api).then(res=>{
        result.retFlight = res.data;
      })
      setFlights(result);
  })

  return (
    <div>
      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
          Departure Flight
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>Flight Number: {flights?.depFlight.flightNumber ?? ""} Booking Number:{props.bookingNumberD}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          Departure Date:{flights?.depFlight.flightDate?? ""}
            <br></br>
            <br></br>
            Arrival Time:{flights?.depFlight.arrivalTime?? ""}
            <br></br>
            <br></br>
            Cabin:{props.cabinClass}
            <br></br>
            <br></br>
            Seats:{"[ "+props.chosenSeatsD.join('-')+" ]"}
            <br></br>
            <br></br>
            Price:{props.price}
            <br></br>
            <br></br>
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>Return Flight</Typography>
          <Typography sx={{ color: 'text.secondary' }}>
          Flight Number: {flights?.retFlight.flightNumber?? ""}
             Booking Number:{props.bookingNumberR}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          Departure Date:{flights?.retFlight.flightDate?? ""}
            <br></br>
            <br></br>
            Arrival Time:{flights?.retFlight.arrivalTime ?? ""}
            <br></br>
            <br></br>
            Cabin:{props.cabinClass}
            <br></br>
            <br></br>
            Seats:{"[ "+ props.chosenSeatsR.join('-')+" ]"}
            <br></br>
            <br></br>
            Price:{props.price}
            <br></br>
            <br></br>
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
export default Summary;
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import SeatPicker, { propTypes } from 'react-seat-picker';

function SeatMap(props)
{
    const [chosenSeats, setChosenSeats] = useState([]);
    const [rows, setRows] = useState([]);
    const [flightS, setFlightSeats] = useState([]);
    
    var flightSeats = [];
    var numOfSeats = null;

    useEffect(async()=>{
        var urlSeats = '/flights/seatsOf/'+props.id;
        var urlNum = '/flights/numSeatsOf/'+props.id;
       
        await axios.get(urlSeats).then(res=> {flightSeats = res.data});
        await axios.get(urlNum).then(res => {numOfSeats=res.data});
        setFlightSeats(generateSeatArray());
    },[]);

    function generateSeatArray()
    {
        var seatArray = flightSeats;
        const numEcon = numOfSeats.econ;
        const numBusi = numOfSeats.busi;
        const numFirst = numOfSeats.first;

        var firstClassRows = seatArray.slice(0,numFirst);
        var busiClassRows = seatArray.slice(numFirst,numBusi+numFirst);
        var econClassRows = seatArray.slice(numBusi+numFirst);

        var resFirstCol = [];
        for(var i =0;i<firstClassRows.length;i+=2)
        {
            var row = [];
            for(var j =i;j<i+2;j++)
            {
                row.push(firstClassRows[j]);
            }
            resFirstCol.push(row);
        }

        var resBusiCol = [];
        for(var i =0;i<busiClassRows.length;i+=4)
        {
            var row = [];
            for(var j =i;j<i+4;j++)
            {
                row.push(busiClassRows[j]);
            }
            resBusiCol.push(row);
        }

        var resEconCol = [];
        for(var i =0;i<econClassRows.length;i+=6)
        {
            var row = [];
            for(var j =i;j<i+6;j++)
            {
                row.push(econClassRows[j]);
            }
            resEconCol.push(row);
        }
        
         resFirstCol = addSpaces(resFirstCol,1);
         resBusiCol = addSpaces(resBusiCol, 2);
         resEconCol = addSpaces(resEconCol,3);

        

        var allSeats = [];
        allSeats = resFirstCol.concat(resBusiCol).concat(resEconCol);

        allSeats = createSeatFormat(allSeats);
        
        return allSeats
        
    }
    Array.prototype.insert = function ( index, item ) {
        this.splice( index, 0, item );
    };
    function createSeatFormat(array)
    {
        var countItems = 1;
        for(var i =0;i<array.length;i++)
        {
            for(var j = 0;j<array[i].length;j++)
            {
                if(array[i][j]===null)
                    continue;
                else if(array[i][j]===undefined)
                    array[i][j] = null;
                else
                {
                    var newSeat = {
                        id:countItems,
                        number: array[i][j].seatNumber,
                        isSelected: false,
                    }
                    if(array[i][j].isTaken == true)
                    {
                        newSeat.isReserved = true;
                        newSeat.tooltip = "Seat is Taken";
                    }
                    else
                    {
                        newSeat.isReserved = false;
                        newSeat.tooltip = "Reserve Now";
                    }
                    countItems++;
                    array[i][j] = newSeat;
                }
            }
        }
        return array;
    }
    function addSpaces(array, half)
    {
        for(var i =0;i<array.length;i++)
        {
            array[i].insert(half,null);
        }
        return array;
    }
    function addSeatCallback({ row, number, id }, addCb)
    {
        console.log(row,number,id);
        var newChosenSeats = chosenSeats;
        newChosenSeats.push(number);
        setChosenSeats(newChosenSeats);
        addCb(row,number,id,"Reserved By You");
    }
    function removeSeatCallback({ row, number, id }, removeCb)
    {
        console.log(row,number,id);
        var newChosenSeats = chosenSeats;
        const index = newChosenSeats.indexOf(number);
        newChosenSeats.splice(index,1);
        setChosenSeats(newChosenSeats);
        removeCb(row,number,id,"Reserve Now");
    }
    console.log(flightS)
    return (
        <div>
        
        <div style={{marginTop: '100px'}}>
        <h2>Select Depertaure flight seats</h2>
          <SeatPicker
            addSeatCallback={addSeatCallback}
            removeSeatCallback={removeSeatCallback}
            rows={flightS}
            maxReservableSeats={props.numberOfSeats}
            alpha
            visible
            selectedByDefault
            loading={false}
            tooltipProps={{multiline: true}}
          />
        </div>
      </div>
    );
}

export default SeatMap;
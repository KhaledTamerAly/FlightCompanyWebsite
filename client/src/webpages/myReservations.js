import '../App.css';
import React from "react";
import Navbar from '../components/Navbar';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import axios from 'axios';
import { useState, useEffect } from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import SeatChange from "../components/SeatChange";
import FindReplaceIcon from '@mui/icons-material/FindReplace';
import ChangeFlights from '../components/ChangeFlight';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    {
        id: 'bookingNumber',
        numeric: false,
        disablePadding: true,
        label: 'Booking Number',
      },
      {
      id: 'flightNumber',
      numeric: false,
      disablePadding: false,
      label: 'Flight Number',
    },
    {
      id: 'paid',
      numeric: true,
      disablePadding: false,
      label: 'Flight price',
    },
    {
      id: 'flightDate',
      numeric: true,
      disablePadding: false,
      label: 'Flight Date',
    },
    {
      id: 'departureTime',
      numeric: true,
      disablePadding: false,
      label: 'Departure Time',
    },
    {
      id: 'arrivalTime',
      numeric: true,
      disablePadding: false,
      label: 'Arrival Time',
    },
    {
      id: 'departureTerminal',
      numeric: true,
      disablePadding: false,
      label: 'Departure Terminal',
    },
    {
      id: 'arrivalTerminal',
      numeric: true,
      disablePadding: false,
      label: 'Arrival Terminal',
    },
    {
      id: 'chosenSeats',
      numeric: true,
      disablePadding: false,
      label: 'Seats',
    }
  ];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, selected } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  selected: PropTypes.string.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const { numSelected } = props;
  const { selected } = props;

  const [open, setOpen] = React.useState(false);
  const [seatChangeOpen, setSeatOpen] = React.useState(false);
  const [isChangingSeats, setIsChangingSeats] = React.useState(false);
  const [isChangingFlights, setIsChangingFlights] = React.useState(false);
  const [flightChangeOpen, setFlightChange] = React.useState(false);
  const [user,setState] = React.useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  
  function deleteReservation(bookingNumber)
    {
        var url = "/users/" + bookingNumber;
        console.log(url);
         axios
             .delete(url)
            .then(()=> console.log("deleted..."));
            window.location.reload(false);
    }
    useEffect(()=>{
      axios.get('users/userInfo/youssef')
        .then(user=> {
          const userInfoObject=  {
            username:user.data.username,
            firstName: user.data.fName,
            lastname: user.data.lName,
            passport: user.data.passportNumber,
            email: user.data.email
      }
      setState(userInfoObject);
    });
    },[]);

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          Booking #{selected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          My Reservations
        </Typography>
      )}

      {numSelected > 0 ? (
        <>
        <Tooltip title="Change Flight Seats">
          <IconButton onClick={()=>{setSeatOpen(true)}}>
            <AirlineSeatReclineNormalIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Change Flight">
          <IconButton onClick={()=>{setFlightChange(true)}}>
            <FindReplaceIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Delete">
          <IconButton onClick={handleClickOpen}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </>
      ) : (
        <></>
      )}
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Confirm cancellation"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure you want to cancel your reservation for the selected flight with booking number {selected}?
            Warning: cancelling a flight will cancel entire itinerary, both return and departing flight!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={()=>deleteReservation(selected)}>Agree</Button>
        </DialogActions>
      </Dialog>


      <Dialog
        open={flightChangeOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={()=>{setFlightChange(false);setIsChangingSeats(false)}}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Confirm change flight"}</DialogTitle>
        <DialogContent>
        {isChangingFlights &&
          <ChangeFlights flightsToChange={
            [
              {
                flightNumber:"KT 754",
                bookingNumber: "71712339",
                type:"Departure"
              },
              {
                flightNumber:"KT 789",
                bookingNumber:"42504317",
                type:"Return"
              }
            ]
          } 
          flightNumSeats = {1} 
          cabinClass = {"Economy"} 
          userInfo={user} 
          price={60} />
        }
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>{setFlightChange(false); setIsChangingFlights(false); window.location.reload()}}>Exit</Button>
          {!isChangingFlights && <Button onClick={()=>setIsChangingFlights(true)}>Continue</Button>}
        </DialogActions>
      </Dialog>
      

      <Dialog
        open={seatChangeOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={()=>{setSeatOpen(false); setIsChangingSeats(false)}}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Confirm change seats"}</DialogTitle>
        <DialogContent>
           {!isChangingSeats && <DialogContentText id="alert-dialog-slide-description">
            Are you sure you want to change seats for selected flight with booking number {selected}?
          </DialogContentText>}
          {isChangingSeats && <SeatChange bookingNumber = {selected}/>}
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>{setSeatOpen(false); setIsChangingSeats(false)}}>Exit</Button>
          {!isChangingSeats && <Button onClick={()=>setIsChangingSeats(true)}>Continue</Button>}
        </DialogActions>
      </Dialog>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  Selected: PropTypes.string.isRequired,
};

export default function MyReservations() {
  const [myReservations, setMyReservations] = React.useState([]);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('flightDate');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = myReservations.map((n) => n.bookingNumber);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    if(name!=selected)
        setSelected(name);
    else
        setSelected("");
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - myReservations.length) : 0;


    
    useEffect(()=>{axios.get('/users/flightDetails/youssef').then(res =>{setMyReservations(res.data)})}, []);
    

  return (
    <div>
        <Navbar loggedIn={true}/>
        <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
            <EnhancedTableToolbar numSelected={selected.length} selected={selected}/>
            <TableContainer>
            <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={dense ? 'small' : 'medium'}
            >
                <EnhancedTableHead
                numSelected={selected.length}
                selected={selected}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={myReservations.length}
                />
                <TableBody>
                {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                    rows.slice().sort(getComparator(order, orderBy)) */}
                {stableSort(myReservations, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                    const isItemSelected = isSelected(row.bookingNumber);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                        <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.bookingNumber)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.bookingNumber}
                        selected={isItemSelected}
                        >
                        <TableCell padding="checkbox">
                            <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                                'aria-labelledby': labelId,
                            }}
                            />
                        </TableCell>
                        <TableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                        >
                            {row.bookingNumber}
                        </TableCell>
                        <TableCell align="right">{row.flightNumber}</TableCell>
                        <TableCell align="right">{row.paid}</TableCell>
                        <TableCell align="right">{row.flightDate.toString().substring(0,10)}</TableCell>
                        <TableCell align="right">{row.departureTime.toString().substring(11,16)}</TableCell>
                        <TableCell align="right">{row.arrivalTime==null?(row.arrivalTime):(row.arrivalTime.toString().substring(11,16))}</TableCell>
                        <TableCell align="right">{row.departureTerminal}</TableCell>
                        <TableCell align="right">{row.arrivalTerminal}</TableCell>
                        <TableCell align="right">{row.chosenSeats.join(", ")}</TableCell>
                        
                        </TableRow>
                    );
                    })}
                {emptyRows > 0 && (
                    <TableRow
                    style={{
                        height: (dense ? 33 : 53) * emptyRows,
                    }}
                    >
                    <TableCell colSpan={6} />
                    </TableRow>
                )}
                </TableBody>
            </Table>
            </TableContainer>
            <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={myReservations.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
        
        </Box>
    </div>
  );
}

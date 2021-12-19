import React from 'react'
import {useNavigate} from 'react-router-dom';
import { Button} from 'reactstrap';
import EnhancedTable from '../components/ScheduleViewer';
import SeatComponent from '../components/SeatsComponent';
function Home()
{
    const navigate = useNavigate();

    function goToAdmin() {
      navigate('/admin')
    }
    function goToLogin() {
        navigate('/login')
      }
    return (
      <>
        <div>
            <h1>Welcome to placeholder flights</h1>
            <p></p>
            <Button color="primary" outline onClick={goToAdmin}> Login as Admin </Button>
            <Button color="primary" outline onClick={()=> navigate('/user')}> Login as User </Button>
            <Button color="success" outline> Register </Button>
        </div>
        <div>
          <EnhancedTable />
          <SeatComponent depFlight= "61ba9bae06c919965b9308b5" retFlight="61ba9bae06c919965b9308b5" depFlightNumSeats ={5} retFlightNumSeats={5} depCabinClass="Economy" retCabinClass="First"/>          
        </div>
        </>
    );
}

export default Home;
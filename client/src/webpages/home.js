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
      const userInfo=  {
        username:"youssef",
        firstName: "youssef",
        lastname: "Bassiouny",
        passport: "A2765",
        email: "youssef@osamaTours.com"
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
          <SeatComponent depFlight= "KT 794" retFlight="KT 794" depFlightNumSeats ={5} retFlightNumSeats={5} depCabinClass="Economy" retCabinClass="First" userInfo ={userInfo}/>          
        </div>
        </>
    );
}

export default Home;
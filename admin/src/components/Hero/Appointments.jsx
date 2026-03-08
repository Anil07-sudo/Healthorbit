import React from 'react';
import { navbarStyles } from '../../dummyStyles';
import AppointmentsPage from '../AppointmentsPage/AppointmentsPage';
import Navbar from '../Navbar/Navbar';


function Appointment() {
  return (
    <div>
        <Navbar/>
         <AppointmentsPage/>
    </div>
  )
}

export default Appointment
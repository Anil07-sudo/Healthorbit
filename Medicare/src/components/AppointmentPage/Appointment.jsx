import React from 'react'
import AppointmentPage from '../AppointmentPage/AppointmentPage';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

function Appointment() {
  return (
    <div><Navbar/>
        <AppointmentPage/>
        <Footer/>
    </div>
  )
}

export default Appointment
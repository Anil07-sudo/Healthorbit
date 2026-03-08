import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import DoctorsPage from '../components/DoctorsPage/DoctorsPage';

const Doctor=()=> {
  return (
    <div>
        <Navbar/>
        <DoctorsPage/>
        <Footer/>
    </div>
  )
}

export default Doctor
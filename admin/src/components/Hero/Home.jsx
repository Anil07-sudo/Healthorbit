import React from 'react'
import { Routes } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import DashboardPage from '../DashboardPage/DashboardPage'

function Home() {
  return (
<>
    <Navbar/>
    <DashboardPage/>
</>
  );

};

export default Home;
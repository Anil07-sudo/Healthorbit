import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Hero from './components/Hero/Hero.jsx';
import { useAuth } from "@clerk/clerk-react";

import Home from './components/Hero/Home.jsx';
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import Navbar from './components/Navbar/Navbar.jsx';
import Add from './components/Hero/Add.jsx';
import List from './components/Hero/List.jsx';
import Appointments from './components/Hero/Appointments.jsx';
import ServeDashboard from './components/Hero/ServeDashboard.jsx';
import AddService from './components/AddService/AddService.jsx';
import Addser from './components/Hero/Addser.jsx';
import ListPage from './components/ListPage/ListPage.jsx';
import ListService from './components/Hero/ListService.jsx';
import ServiceAppointments from './components/Hero/ServiceAppointments.jsx';
import { CircleChevronUp } from 'lucide-react';
import { useEffect } from 'react';
import { useState } from 'react';




const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return null;
};


//scroll button
const ScrollButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 200);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button
      onClick={scrollTop}
      className={`fixed right-4 bottom-6 z-50 w-11 h-11 rounded-full flex items-center justify-center 
      bg-emerald-600 text-white shadow-lg transition-all duration-300 
      ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} 
      hover:scale-110 hover:shadow-xl`}
      title="Go to top"
    >
      <CircleChevronUp size={22} />
    </button>
  );
}


function RequireAuth({ children }) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return (
      <div className="min-h-screen font-mono flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 px-4">
        <div className="text-center">
          <p className="text-emerald-800 font-semibold text-lg sm:text-2xl mb-4">
            Please sign in to view this page
          </p>

          <div className="flex justify-center">
            <Link
              to="/"
              className="px-4 py-2 text-sm rounded-full bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 transition-all"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    );
  }
  return children;
}
function App() {
  return (
     <>
<ScrollToTop/>
<div className="overflow-x-hidden bg-white text-gray-900">
   
   <Routes>
    <Route path="/" element={<Hero/>}/>
     <Route
    path="/h"
    element={
      <RequireAuth>
        <Home />
      </RequireAuth>
    }
  />
   <Route
    path="/add"
    element={
      <RequireAuth>
        <Add />
      </RequireAuth>
    }
  />
  <Route
    path="/list"
    element={
      <RequireAuth>
        <List/>
      </RequireAuth>
    }
  />
  <Route
    path="/Appointments"
    element={
      <RequireAuth>
        <Appointments/>
      </RequireAuth>
    }
  />
  <Route
    path="/service-dashboard"
    element={
      <RequireAuth>
        <ServeDashboard/>
      </RequireAuth>
    }
  />
  <Route
    path="/add-service"
    element={
      <RequireAuth>
        <Addser/>
      </RequireAuth>
    }
  />
   <Route
    path="/list-service"
    element={
      <RequireAuth>
        <ListService/>
      </RequireAuth>
    }
  />
  <Route
    path="/service-appointments"
    element={
      <RequireAuth>
        <ServiceAppointments/>
      </RequireAuth>
    }
  />
   </Routes>
   </div>
<ScrollButton/>
</>
  );
};

export default App;